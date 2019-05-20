## Mysql协程连接池

easyswoole已经实现了mysql连接池组件 https://github.com/easy-swoole/mysqli-pool
```
composer require easyswoole/mysqli-pool
```
> 该组件是mysql对于pool组件的再次封装

### 添加数据库配置
在`dev.php`,`produce.php`中添加配置信息：
```php
/*################ MYSQL CONFIG ##################*/

'MYSQL'         => [
         //数据库配置
               'host'                 => '',//数据库连接ip
               'user'                 => '',//数据库用户名
               'password'             => '',//数据库密码
               'database'             => '',//数据库
               'port'                 => '',//端口
               'timeout'              => '30',//超时时间
               'connect_timeout'      => '5',//连接超时时间
               'charset'              => 'utf8',//字符编码
               'strict_type'          => false, //开启严格模式，返回的字段将自动转为数字类型
               'fetch_mode'           => false,//开启fetch模式, 可与pdo一样使用fetch/fetchAll逐行或获取全部结果集(4.0版本以上)
               'alias'                => '',//子查询别名
               'isSubQuery'           => false,//是否为子查询
               'max_reconnect_times ' => '3',//最大重连次数
       
               //连接池配置
               'intervalCheckTime'    => 30 * 1000,//定时验证对象是否可用以及保持最小连接的间隔时间
               'maxIdleTime'          => 15,//最大存活时间,超出则会每$intervalCheckTime/1000秒被释放
               'maxObjectNum'         => 20,//最大创建数量
               'minObjectNum'         => 5,//最小创建数量 最小创建数量不能大于等于最大创建
    ],
```
## mysqli-pool组件

### 注册
在```EasySwooleEvent.php```的initialize方法中注册连接池对象(注意命名空间,新版本可以无需注册,自动注册)
```php
<?php
$mysql1Config = new \EasySwoole\Mysqli\Config(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL'));
$pool1Config = \EasySwoole\MysqliPool\Mysql::getInstance()->register('mysql1',$mysql1Config);
//根据返回的poolConfig对象进行配置连接池配置项
$pool1Config->setMaxObjectNum(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL.maxObjectNum'));

//多个mysql数据库配置
$mysql2Config = new \EasySwoole\Mysqli\Config(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL2'));
$pool2Config = \EasySwoole\MysqliPool\Mysql::getInstance()->register('mysql2',$mysql2Config);
//根据返回的poolConfig对象进行配置连接池配置项
$pool2Config->setMaxObjectNum(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL2.maxObjectNum'));

```
### 使用
```php
<?php
  //defer方式
    $db = EasySwoole\MysqliPool\Mysql::defer('mysql1');
    $data = $db->get('test');
    var_dump($data);
    
    //invoke方式
    \EasySwoole\MysqliPool\Mysql::invoker('mysql1',function ($db2){
        $db2 = EasySwoole\MysqliPool\Mysql::defer('mysql1');
        $data = $db2->get('test');
        var_dump($data);
    });
```
> 以上使用方式为mysql-pool组件使用方式,建议使用该方式实现mysql多数据库管理,但也可以根据pool管理器,自行实现,下面是pool管理器原生的实现教程
## pool管理器原生实现方式

> 参考Demo: [Pool连接池](https://github.com/easy-swoole/demo/tree/3.x-pool)

demo中有封装好的mysql连接池以及mysql类，复制demo中的MysqlPool.php和MysqlObject.php并放入App/Utility/Pool中即可使用


在```EasySwooleEvent.php```的initialize方法中注册连接池对象(注意命名空间,新版本可以无需注册,自动注册)
```php
<?php
// 注册mysql数据库连接池
        PoolManager::getInstance()->register(MysqlPool::class,Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'));
        //注册之后会返回conf配置,可继续配置,如果返回null代表注册失败
```
> 可通过register返回的PoolConf对象去配置其他参数

### 注意
连接池不是跨进程的，进程间的连接池连接数是相互独立的，默认最大值是10个；如果开了4个worker，最大连接数可以达到40个。

### 基础使用
在控制器 通过mysql连接池获取mysql操作对象
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
        //使用完毕需要回收
        PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
        $this->response()->write(json_encode($data));
        // TODO: Implement index() method.
    }
}
````
> 直接getobj时,可能会出现没有连接(返回null)的情况,需要增加判断

用完mysql连接池对象之后记得用recycleObj回收(新版本可使用`invoker`.`defer`方法自动回收)  
````php
<?php
PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);  

````

### 自动回收

#### invoke  
可通过`invoke`静态方法直接从连接池取出一个连接,直接使用,回调函数结束后自动回收:   

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
使用`defer`方法直接获取一个连接池连接,直接使用,协程结束后自动回收:   

````php   
<?php  
$db = MysqlPool::defer();  
$model = new UserModel($db);
$model->insert(new UserBean($this->request()->getRequestParam()));
````  

> 异常拦截,当invoke,defer调用,内部发生(连接不够,连接对象错误)等异常情况时,会抛出PoolEmpty和PoolException,可在控制器基类拦截或直接忽略,EasySwoole内部有做异常拦截处理,将直接拦截并返回错误到前端.  

> 只要使用以上两个方法,就无需关注连接回收问题,将自动回收

### 预创建链接
新增preload方法,可在程序启动后预创建连接,避免在启动时突然大量请求,造成连接来不及创建从而失败的问题.
示例:
在EasySwooleEvent文件,mainServerCreate事件中增加onWorkerStart回调事件中预热启动:
```php
<?php
//注册onWorkerStart回调事件
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart, function (\swoole_server $server, int $workerId) {
    if ($server->taskworker == false) {
        PoolManager::getInstance()->getPool(MysqlPool::class)->preLoad(1);
        //PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(预创建数量,必须小于连接池最大数量);
    }

        // var_dump('worker:' . $workerId . 'start');
    });
}
```