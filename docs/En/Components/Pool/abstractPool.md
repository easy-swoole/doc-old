---
title: EasySwoole universal connection pool
meta:
  - name: description
    content: EasySwoole universal connection pool,Coroutine connection pool,Easyswoole connection pool
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|connection pool|swoole connection pool|universal connection pool
---


## Pool object method

| Method name      | parameter                                     | Description                                                        | Remarks                                         |
|:--------------|:-----------------------------------------|:-----------------------------------------------------------|:--------------------------------------------|
| createObject  |                                          | Abstract method, create a connection object                                        |                                             |
| recycleObj    | $obj                                     | Reclaim a connection                                                |                                             |
| getObj        | float $timeout = null, int $tryTimes = 3 | Get a connection, timeout time $timeout, try to get $tryTimes times             |                                             |
| unsetObj      | $obj                                     | Directly release a connection                                             |                                             |
| idleCheck     | int $idleTime                            | Reclaim connections that are not used by $idleTime                            |                                             |
| intervalCheck |                                          | Recycling connections, as well as hot-start methods, allowing external calls to hot start                      |                                             |
| keepMin       | ?int $num = null                         | Keep the minimum connection (hot start)                                         |                                             |
| getConfig     |                                          | Get the configuration information of the connection pool                                         |                                             |
| status        |                                          | Get connection pool status information                                           | Get the current connection pool has been created, used, maximum creation, minimum creation data |
| isPoolObject  | $obj                                     | Check if the $obj object is created by the connection pool                                |                                             |
| isInPool      | $obj                                     | Get the current connection is not used in the connection pool                               |                                             |
| destroyPool   |                                          | Destroy the connection pool                                                |                                             |
| reset         |                                          | Reset the connection pool                                                |                                             |
| invoke        | callable $call,float $timeout = null     | Get a connection, pass it to the $call callback function for processing, and automatically reclaim the connection after the callback ends |                                             |
| defer         | float $timeout = null                    | Get a connection, automatically recycle after the end of the coroutine                               |                                             |


### getObj
Get an object for the connection pool:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    $redis = $redisPool->getObj();
    var_dump($redis->echo('仙士可'));
    $redisPool->recycleObj($redis);
});
```
::: warning
Objects obtained by the getObj method must be called with unsetObj or recycleObj, otherwise the connection pool object will be less and less.
:::

### unsetObj
Directly release a connection pool object, other coroutines can no longer get the connection, but will re-create a connection

::: warning
After the release, the object will not be destroyed immediately, but will be destroyed after the scope ends.
:::

### recycleObj
Retrieve a connection object, after the recovery, other coroutines can get this connection normally.
::: warning
After the recovery, other coroutines can obtain the connection normally, but at this time, the connection is still in the current coroutine. If the connection is called again for data operation, the coroutine will be confusing, so the developer needs to be bound by itself, when the recycleObj Can't manipulate this object anymore
:::

### invoke
Get a connection, pass it to the $call callback function for processing, and automatically reclaim the connection after the callback ends:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    $redisPool->invoke(function (\EasySwoole\Redis\Redis $redis){
        var_dump($redis->echo('仙士可'));
    });
});

```
::: warning
This method eliminates the need to manually reclaim the connection, and automatically recycles after the callback function ends.
:::

### defer
Get a connection, automatically recycle after the end of the coroutine
```php
go(function () {
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    $redis = $redisPool->defer();
    var_dump($redis->echo('仙士可'));
});
```
::: warning
This method eliminates the need to manually recycle the connection, and automatically recycles after the end of the coroutine.
:::

::: warning
Need to pay attention to, the defer method is only after the end of the coroutine is recycled, if your current coroutine runs too long, it will not be able to recycle until the end of the coroutine
:::

### keepMin
Keep the minimum connection (hot start)
Thanks to easyswoole/pool
When a service is started and there is too much concurrency, it may suddenly need tens of hundreds of connections. In this case, in order to make the connection creation time dispersed, the connection can be warmed up by calling keepMin.
After calling this method, n connections will be created in advance for the controller to directly obtain the connection after the service is started:
In `mainServerCreate` in `EasySwooleEvent.php`, when the worker process starts, the hot start connection
```php

public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
        if ($server->taskworker == false) {
            // Each worker process pre-creates a connection
            \EasySwoole\Pool\Manager::getInstance()->get('redis')->keepMin(10);
            var_dump(\EasySwoole\Pool\Manager::getInstance()->get('redis')->status());
        }
    });

    // TODO: Implement mainServerCreate() method.
}
```
Will output:
```
array(4) {
  ["created"]=>
  int(10)
  ["inuse"]=>
  int(0)
  ["max"]=>
  int(20)
  ["min"]=>
  int(5)
}
```

::: warning
 keepMin creates different connections according to different processes. For example, if you have 10 worker processes, it will output 10 times, and a total of 10*10=100 connections will be created.
:::

### getConfig
Get the configuration of the connection pool:
```php
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    var_dump($redisPool->getConfig());

```

### destroyPool
Destroy the connection pool
After the call, all the remaining links in the connection pool will be unsetObj, and the connection queue will be closed. After the call, getObj and other methods will be invalidated:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    var_dump($redisPool->getObj());
    $redisPool->destroyPool();
    var_dump($redisPool->getObj());
});
```
### reset
Reset the connection pool, after calling reset, will automatically call destroyPool to destroy the connection pool, and re-initialize the connection pool the next time getObj:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    var_dump($redisPool->getObj());
    $redisPool->reset();
    var_dump($redisPool->getObj());
});
```

### status
Get the current state of the connection pool, after the call will output:
```
array(4) {
  ["created"]=>
  int(10)
  ["inuse"]=>
  int(0)
  ["max"]=>
  int(20)
  ["min"]=>
  int(5)
}
```
### idleCheck
Reclaim idle timeout connections

### intervalCheck
After calling this method, the idleCheck and keepMin methods are called to manually reclaim idle connections and manual hot start connections.
```php
public function intervalCheck()
{
    $this->idleCheck($this->getConfig()->getMaxIdleTime());
    $this->keepMin($this->getConfig()->getMinObjectNum());
}
```
