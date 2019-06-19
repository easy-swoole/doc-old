## Connection pool component
EasySwoole integrates connection pool components in the basic components to increase the reusability of i/o connections such as mysql/redis, and the namespace is `EasySwooleComponentPool'.`
Demo address:(https://github.com/easy-swoole/demo/tree/3.x-pool)
> In the new version, automatic connection pool recycling, automatic registration, anonymous connection pool registration and its underlying exception handling are realized.
> When users use connection pool, they can use it directly, without registration, without recycling (automatic recycling through defer and invoke), and there will be no problems.

### PoolManager 
Connection pool management tools provide the following methods:
````php
<?php
/**
 * Get the default configuration of connection pool
 * getDefaultConfig
 * @author Tioncico
 * Time: 20:34
 */
function getDefaultConfig(){}
/**
 * Registered connection pool
 * register
 * @param string $className
 * @param int $maxNum Maximum number of connections
 * @author Tioncico
 * Time: 20:34
 */
function register(string $className, $maxNum = 20){}
/**
 * Register Anonymous Connection Pool
 * registerAnonymous
 * @param string $name
 * @param callable|null $createCall
 * @author Tioncico
 * Time: 20:35
 */
function registerAnonymous(string $name,?callable $createCall = null){}
/**
 * Get a connection object from the connection pool
 * getPool
 * @param $key
 * @author Tioncico
 * Time: 20:36
 */
function getPool($key){}
````
### AbstractPool 
Connection pool implements the interface and creates a connection pool by inheriting the connection pool.
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/5 0005
 * Time: 20:42
 */

namespace App\Utility\Pool;

use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\Mysqli\Config;
use EasySwoole\Mysqli\Mysqli;

class MysqlPool extends AbstractPool
{
    protected function createObject()
    {
        //This method is called when the connection pool first gets the connection
        //We need to create a connection in this method
        //Returns an object instance
        //An object that implements the AbstractPoolObject interface must be returned
        $conf = \EasySwoole\EasySwoole\Config::getInstance()->getConf("MYSQL");
        $dbConf = new Config($conf);
        return new MysqlObject($dbConf);
        // TODO: Implement createObject() method.
    }
}

````
The method is as follows:
````php
<?php
abstract protected function createObject(){};//This method is called to create connection pool objects when the maximum number of connections is not reached when the connection pool object is acquired.
public function recycleObj($obj){};//Release a connection pool object
public function getObj(float $timeout = null, int $beforeUseTryTimes = 3){};//Get a connection pool object 
public function unsetObj($obj){};//Release a connection pool object thoroughly/close the connection
public function gcObject(int $idleTime){};//Clean up timeout connections
protected function intervalCheck(){};//Timing calls clean up timeout connections and create new connection logic
public function keepMin(?int $num = null){};//Keep minimal connections and create when not enough
public function preLoad(?int $num = null){};//Hot Start, Alias for keepMin
public function getConfig(){};//Get the current connection pool configuration
public function status(){};//Get the current connection pool status
public function isPoolObject($obj){};//Determine whether a connection is created for the connection pool
public function isInPool($obj){};//Gets whether the connection exists in the connection pool(Use does not exist)
````

### PoolObjectInterface
To create a connection pool object by implementing the PoolObjectInterface interface, for example
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/5 0005
 * Time: 20:42
 */


namespace App\Utility\Pool;

use EasySwoole\Component\Pool\PoolObjectInterface;
use EasySwoole\Mysqli\Mysqli;

class MysqlObject extends Mysqli implements PoolObjectInterface
{
    /**
     * Called when the object is released
     * gc
     * @author Tioncico
     * Time: 20:49
     */
    function gc()
    {
        // Reset to initial state
        $this->resetDbStatus();
        // Close database connection
        $this->getMysqlClient()->close();
    }

    /**
     * Called when the object is reclaimed
     * objectRestore
     * @author Tioncico
     * Time: 20:49
     */
    function objectRestore()
    {
        // Reset to initial state
        $this->resetDbStatus();
    }

    /**
     * This method is called before each link is used. Return true / false
     * When returning to false, the PoolManager reclaims the link and re-enters the link acquisition process.
     * @return bool Returning true indicates that the link can be falsed to indicate that the link is unavailable and needs to be recycled
     */
    function beforeUse(): bool
    {
        // Here you can judge whether the link is disconnected or not. When using different database operation classes, you can modify them according to your own situation.
        return $this->getMysqlClient()->connected;
    }
}
````

### Connection pool configuration
The connection pool has the following configuration, which can be set and viewed through `PoolConf.php'.
````php
<?php
$intervalCheckTime = 30*1000;//Timely validation of object availability and minimum connection interval
$maxIdleTime = 15;//Maximum survival time is released every $intervalCheckTime/1000 seconds
$maxObjectNum = 20;//Maximum Creation Quantity
$minObjectNum = 5;//The minimum number of creation must not be greater than or equal to the maximum number of creation, otherwise the minimum number of connections is determined by an error per $intervalCheckTime/1000 seconds.
$getObjectTimeout = 3.0;
$extraConf = [];//Waiting time for connection pool object to acquire connection object
````
### Specific examples of use:
1:Through the above two interface examples, the ```connection pool object `` and `connection pool object'are realized.```

2:Register connection pool objects in the initialize method of ``EasySwooleEvent.php` (note namespaces, new versions can be registered automatically without registration)
```php
// Register MySQL database connection pool
        PoolManager::getInstance()->register(MysqlPool::class,Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'));
        //After registration, conf configuration is returned, which can be continued if NULL is returned to represent registration failure.
```
> Other parameters can be configured through the PoolConf object returned by register

3:Call in the worker (http controller) process (note the namespace):
```php
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
```
> When directly getobj, there may be no connection (returning null), which requires additional judgment.


### No registration required
In the `getPool'method of `Pool Manager', automatic registration of connection pool is realized.
When the user does not register the connection pool, the direct getPool can automatically register and use the connection directly, such as the controller usage above:
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
        $db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();//Direct use without registration
        $data = $db->get('test');
        //Recycling after use
        PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
        $this->response()->write(json_encode($data));
        // TODO: Implement index() method.
    }
}
````
### Automatic Recycling
In `AbstractPool', the `invoke'method of `EasySwoole\Component\Pool\TraitInvoker' is used. Through the invoke method, connection pool connections can be directly operated in closures and automatic recovery can be performed, for example:
````php
<?php
function poolInvoke(){
    $data = MysqlPool::invoke(function ( MysqlObject $db){
        $data = $db->get('test');
        return $data;
    });
    $this->response()->write(json_encode($data));
}
````
> Exception interception, when invoke calls, internal occurrence (inadequate connection, connection object err or) and other abnormal situations, will throw PoolEmpty and PoolException, can be intercepted or directly ignored in the controller base class, EasySwoole internal interception processing, will directly intercept and return the err Or to the front end.
In `AbstractPool', the `defer'method of `EasySwoole\Component\Pool\TraitInvoker` is used. Through the defer method, the connection will be automatically reclaimed when the coroutine process is completed, but it is not applicable to anonymous connection pool to implement the code:
````php
<?php
 public static function defer($timeout = null)
    {
        $key = md5(static::class);
        $obj = ContextManager::getInstance()->get($key);
        if($obj){
            return $obj;
        }else{
            $pool = PoolManager::getInstance()->getPool(static::class);
            if($pool instanceof AbstractPool){
                $obj = $pool->getObj($timeout);
                if($obj){
                    Coroutine::defer(function ()use($pool,$obj){
                        $pool->recycleObj($obj);
                    });
                    ContextManager::getInstance()->set($key,$obj);
                    return $obj;
                }else{
                    throw new PoolEmpty(static::class." pool is empty");
                }
            }else{
                throw new PoolException(static::class." convert to pool error");
            }
        }
    }
````



### Pre-Create Connection/Hot Start
In the previous case, if you restart EasySwoole, because the connection pool object is lazy to load (only to create connections when invoked), it will cause instantaneous excessive pressure when EasySwoole is started with a large amount of access, so the EasySwoole connection pool component provides a hot start.
In the `EasySwooleEvent'file, `mainServerCreate' event, add `onWorkerStart'callback event to preheat start:
```php
<?php 
//Register onWorkerStart callback event
   public static function mainServerCreate(EventRegister $register)
    {
        $register->add($register::onWorkerStart, function (\swoole_server $server, int $workerId) {
            if ($server->taskworker == false) {
                //Pre-create connections for each worker process
                PoolManager::getInstance()->getPool(MysqlPool::class)->preLoad(5);//Minimum Creation Quantity
            }
        });
    }
```
> When the connection pool object is instantiated, every 30 seconds ($interval CheckTime default value) completely releases unused connections for 15 seconds ($maxIdleTime default value), and executes the keepMin method once to recreate five connection objects ($minObjectNum default value). Make sure that the connection object is not automatically closed by timeout.
### Create anonymous connection pools
When you do not want to create new files to implement connection pools or do not want to implement connection pool objects, you can create anonymous connection pools by `registerAnonymous', for example:

Register connection pool objects in the initialize method of ``EasySwooleEvent.php`

````php
<?php
   PoolManager::getInstance()->registerAnonymous('mysql',function (){
            $conf = \EasySwoole\EasySwoole\Config::getInstance()->getConf("MYSQL");
            $dbConf = new Config($conf);
            return new Mysqli($dbConf);
        });
````
Use in the controller:
````php
<?php
        $db = PoolManager::getInstance()->getPool('mysql')->getObj();
        $data = $db->get('test');
        $db->resetDbStatus();//Reset to the initial state, otherwise there will be problems after recycling
        PoolManager::getInstance()->getPool('mysql')->recycleObj($db);
        $this->response()->write(json_encode($data));
````
> 

