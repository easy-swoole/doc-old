## Mysql coroutine connection pool

### Add database configuration
Add configuration information in `dev.php', `produce.php'：
```php
/*################ MYSQL CONFIG ##################*/

'MYSQL'         => [
         //Database Configuration
               'host'                 => '',//Database connection ip
               'user'                 => '',//Database username
               'password'             => '',//Database password
               'database'             => '',//database
               'port'                 => '',//port
               'timeout'              => '30',//timeout
               'connect_timeout'      => '5',//Connection timeout
               'charset'              => 'utf8',//Character encoding
               'strict_type'          => false, //Open strict mode, returning fields will automatically be converted to digital types
               'fetch_mode'           => false,//Open fetch mode and use fetch / fetchAll line by line or get all result sets (version 4.0 or more) as PDO does.
               'alias'                => '',//Subquery aliases
               'isSubQuery'           => false,//Is it a subquery
               'max_reconnect_times ' => '3',//Maximum number of reconnections
       
               //The connection pool configuration needs to be configured according to the poolconfig returned at registration time, but it is not valid here.
               'intervalCheckTime'    => 30 * 1000,//Timely validation of object availability and minimum connection interval
               'maxIdleTime'          => 15,//Maximum survival time,If it exceeds, it will be released every $intervalCheckTime/1000 second.
               'maxObjectNum'         => 20,//Maximum Creation Quantity
               'minObjectNum'         => 5,//The minimum number of creation must not be greater than or equal to the maximum number of creation.
    ],
```
## Mysqli-pool component
Easyswoole has implemented MySQL connection pool component https://github.com/easy-swoole/mysqli-pool
```
composer require easyswoole/mysqli-pool
```
> This component is mysql's re-encapsulation of pool components

### register
Register connection pool objects in the initialize method of ``EasySwooleEvent.php`. (Note namespaces, you can register more than one)
```php
<?php
$mysql1Config = new \EasySwoole\Mysqli\Config(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL'));
$pool1Config = \EasySwoole\MysqliPool\Mysql::getInstance()->register('mysql1',$mysql1Config);
//Configure connection pool configuration items based on returned poolConfig objects
$pool1Config->setMaxObjectNum(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL.maxObjectNum'));

//Multiple MySQL database configuration
$mysql2Config = new \EasySwoole\Mysqli\Config(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL2'));
$pool2Config = \EasySwoole\MysqliPool\Mysql::getInstance()->register('mysql2',$mysql2Config);
//Configure connection pool configuration items based on returned poolConfig objects
$pool2Config->setMaxObjectNum(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL2.maxObjectNum'));

```
### Use
```php
<?php
  //defer way
    $db = EasySwoole\MysqliPool\Mysql::defer('mysql1');
    $data = $db->get('test');
    var_dump($data);
    
    //invoke way
    \EasySwoole\MysqliPool\Mysql::invoker('mysql1',function ($db2){
        $db2 = EasySwoole\MysqliPool\Mysql::defer('mysql1');
        $data = $db2->get('test');
        var_dump($data);
    });
```
> The above way of using is mysql-pool component. It is suggested that MySQL multi-database management be realized by this way, but it can also be implemented by itself according to pool manager. The following is the original implementation tutorial of pool manager.
## Native implementation of pool manager

> Reference Demo: [Pool connection pool](https://github.com/easy-swoole/demo/tree/3.x-pool)

There are encapsulated MySQL connection pool and MySQL class in demo. Copy MysqlPool. PHP and MysqlObject. PHP in demo and put them into App/Utility/Pool.


Register connection pool objects in the initialize method of ``EasySwooleEvent.php` (note namespaces, new versions can be registered automatically without registration)
```php
<?php
// Register MySQL database connection pool
        PoolManager::getInstance()->register(MysqlPool::class,Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'));
        //After registration, conf configuration is returned, which can be continued if NULL is returned to represent registration failure.
```
> Other parameters can be configured through the PoolConf object returned by register

### Notice
Connection pools are not cross-process. The number of connection pools between processes is independent. The default maximum is 10. If four workers are opened, the maximum number of connections can reach 40.

### Basic use
The controller obtains MySQL operation object through MySQL connection pool
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/5 0005
 * Time: 21:07
 */
namespace App\HttpController;
use App\Utility\Pool\MysqlPool;
use EasySwoole\Component\Pool\PoolManager;
use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller
{
    function index()
    {
        $db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
        $data = $db->get('test');
        //Recycling after use
        PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
        $this->response()->write(json_encode($data));
        // TODO: Implement index() method.
    }
}
````
> When directly getobj, there may be no connection (returning null), which requires additional judgment.

Remember to recycle with recycleObj after using MySQL connection pool objects(The new version can be automatically recycled using `invoker'. `defer'.)  
````php
<?php
PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);  

````

### Automatic Recycling

#### invoke  
A connection can be extracted directly from the connection pool by `invoke'static method, used directly, and automatically recovered after the callback function ends:   

````php  
<?php
    try {
        MysqlPool::invoke(function (MysqlObject $mysqlObject) {
            $model = new UserModel($mysqlObject);
            $model->insert(new UserBean($this->request()->getRequestParam()));
        });
    } catch (\Throwable $throwable) {
        $this->writeJson(Status::CODE_BAD_REQUEST, null, $throwable->getMessage());
    }catch (PoolEmpty $poolEmpty){
        $this->writeJson(Status::CODE_BAD_REQUEST, null, '没有链接可用');
    
    }catch (PoolUnRegister $poolUnRegister){
        $this->writeJson(Status::CODE_BAD_REQUEST, null, '连接池未注册');
    }
````


#### defer  
Use the `defer'method to get a connection pool connection directly, use it directly, and recover it automatically after the end of the coroutine:   

````php   
<?php  
$db = MysqlPool::defer();  
$model = new UserModel($db);
$model->insert(new UserBean($this->request()->getRequestParam()));
````  

> Exception interception, when invoke, defer call, internal occurrence (inadequate connection, connection object error) and other abnormal situations, will throw PoolEmpty and PoolException, can be intercepted or directly ignored in the controller base class, EasySwoole internal exception interception processing, will directly intercept and return the error to the front end.  

> As long as the above two methods are used, there is no need to pay attention to connection recycling and it will be automatically recycled.

### Pre-create links
The new preload method can pre create connections after the program is started, avoiding sudden massive requests at startup, resulting in problems that the connection is too late to create and fail.
Example:
In the EasySwooleEvent file, add the onWorkerStart callback event to the mainServerCreate event to warm up the start:
```php
<?php
//Register onWorkerStart callback event
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart, function (\swoole_server $server, int $workerId) {
    if ($server->taskworker == false) {
        PoolManager::getInstance()->getPool(MysqlPool::class)->preLoad(1);
        //PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(Pre-created number must be less than the maximum number of connection pools);
    }
        // var_dump('worker:' . $workerId . 'start');
    });
}
```