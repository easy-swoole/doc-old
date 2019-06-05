## Redis Cooperative Connection Pool

### Add database configuration
Add configuration information in `dev.php', `produce.php':
```php
/*################ REDIS CONFIG ##################*/
'REDIS' => [
    'host'          => '127.0.0.1',
    'port'          => '6379',
    'auth'          => '',
    
   //The connection pool configuration needs to be configured according to the poolconfig returned at registration time, but The connection pool configuration needs to be configured according to the poolconfig returned at registration time, but it is not valid here.
   'intervalCheckTime'    => 30 * 1000,//Timely validation of object availability and minimum connection interval
   'maxIdleTime'          => 15,//Maximum survival time is released every $intervalCheckTime/1000 seconds
   'maxObjectNum'         => 20,//Maximum Creation Quantity
   'minObjectNum'         => 5,//The minimum number of creation must not be greater than or equal to the maximum number of creation.
],
```
## Redis-pool component

Easyswoole has implemented redis connection pool components https://github.com/easy-swoole/redis-pool
```
composer require easyswoole/redis-pool
```
> This component is redis re-encapsulation of pool components

### register
Register connection pool objects in the initialize method of ``EasySwooleEvent.php`(Note the namespace, you can register more than one)
```php
$redisConfig =new \EasySwoole\RedisPool\Config(Config::getInstance()->getConf('REDIS'));
$redisPoolConfig = Redis::getInstance()->register('redis',$redisConfig);
$redisPoolConfig->setMaxObjectNum(Config::getInstance()->getConf('REDIS.maxObjectNum'));
```
### Use
```php
<?php
 //defer way
$redis = \EasySwoole\RedisPool\Redis::defer('redis');
$redis->set('test',1);
//invoke way
\EasySwoole\RedisPool\Redis::invoker('redis',function ($redis){
   var_dump($redis->get('test'));
});
```
> The above way of using is redis-pool component. It is suggested that redis multi-database management be realized by this way, but it can also be implemented by itself according to pool manager. The following is the original implementation tutorial of pool manager.

## Native implementation of pool manager

> Reference Demo: [Pool connection pool](https://github.com/easy-swoole/demo/tree/3.x-pool)

There are encapsulated redis connection pools and redis classes in demo. Copy RedisPool.PHP and RedisObject.PHP in demo and put them into App/Utility/Pool.

Register the connection pool object in the initialize method of `EasySwooleEvent.php` (note the namespace, the new version can be automatically registered without registration)
```php
<?php
        $redisConf2 = PoolManager::getInstance()->register(RedisPool::class, Config::getInstance()->getConf('REDIS.POOL_MAX_NUM'));
        //After registration, conf configuration is returned, which can be continued if NULL is returned to represent registration failure.
```
> Other parameters can be configured through the PoolConf object returned by register


### Notice
Connection pools are not cross-process. The number of connection pools between processes is independent. The default maximum is 10. If four workers are opened, the maximum number of connections can reach 40.


### Basic use

Obtaining redis operation object through redis connection pool

```php
<?php

function index()
{
    $redis = PoolManager::getInstance()->getPool(RedisPool::class)->getObj();

    $redis->set('key', '仙士可');
    $data = $redis->get('key');
    PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($redis);
    $this->response()->write($data);
}
```
Remember to recycleObj after using redis connection pool objects
> When directly getobj, there may be no connection (returning null), which requires additional judgment.

Remember to recycle Obj after using redis connection pool objects (the new version can be automatically recycled using `invoker'. `defer')

```php
<?php
PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($redis);
```

### Automatic Recycling
* invoke
A connection can be extracted directly from the connection pool by `invoke'static method, used directly, and automatically recovered after the callback function ends:
```php
<?php
try {
    $result = RedisPool::invoke(function(RedisObject $redis) {
            $name = $redis->get('name');
            return $name;
        });
    $this->writeJson(Status::CODE_OK, $result);
} catch (\Throwable $throwable) {
    $this->writeJson(Status::CODE_BAD_REQUEST, null, $throwable->getMessage());
}
```
* defer
Use the `defer'method to get a connection pool connection directly, use it directly, and recover it automatically after the end of the coroutine:
````php
$redis = RedisPool::defer();
$name = $redis->get('name');
````
> Exception interception, when invoke calls, internal occurrence (inadequate connection, connection object error) and other abnormal situations, will throw PoolEmpty and PoolException, can be intercepted or directly ignored in the controller base class, EasySwoole internal exception interception processing, will directly intercept and return the error to the front end.
> As long as the above two methods are used, there is no need to pay attention to connection recycling and it will be automatically recycled.

### Pre-create links
A new preload method can pre-create the connection after the program starts, avoiding sudden large number of requests at the start, causing the connection to fail because it is too late to create.
Examples:
In the EasySwooleEvent file, add the onWorkerStart callback event to the main Server Create event to warm up the start:
```php
<?php
//Register onWorkerStart callback event
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart, function (\swoole_server $server, int $workerId) {
    if ($server->taskworker == false) {
        PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(1);
        //PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(Pre-created number must be less than the maximum number of connection pools);
    }

    // var_dump('worker:' . $workerId . 'start');
    });
}
```

