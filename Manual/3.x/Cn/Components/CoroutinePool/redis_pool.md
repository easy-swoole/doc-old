## Redis协程连接池

> 参考Demo: [Pool连接池](https://github.com/easy-swoole/demo/tree/3.x-pool)

demo中有封装好的redis连接池以及redis类，复制demo中的RedisPool.php和RedisObject.php并放入App/Utility/Pool中即可使用

### 添加数据库配置
在`dev.php`,`produce.php`中添加配置信息：
```php
/*################ REDIS CONFIG ##################*/
'REDIS' => [
    'host'          => '127.0.0.1',
    'port'          => '6379',
    'auth'          => '',
    'POOL_MAX_NUM'  => '20',
    'POOL_MIN_NUM'  => '5',
    'POOL_TIME_OUT' => '0.1',
],
```
在```EasySwooleEvent.php```的initialize方法中注册连接池对象(注意命名空间,新版本可以无需注册,自动注册)
```php
<?php
        $redisConf2 = PoolManager::getInstance()->register(RedisPool::class, Config::getInstance()->getConf('REDIS.POOL_MAX_NUM'));
        //注册之后会返回conf配置,可继续配置,如果返回null代表注册失败
```
> 可通过register返回的PoolConf对象去配置其他参数


### 注意
连接池不是跨进程的，进程间的连接池连接数是相互独立的，默认最大值是10个；如果开了4个worker，最大连接数可以达到40个。


### 基础使用

通过redis连接池获取redis操作对象

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
用完redis连接池对象之后记得用recycleObj回收
> 直接getobj时,可能会出现没有连接(返回null)的情况,需要增加判断  

用完redis连接池对象之后记得用recycleObj回收(新版本可使用`invoker`.`defer`方法自动回收)

```php
<?php
PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($redis);
```

### 自动回收
* invoke
可通过`invoke`静态方法直接从连接池取出一个连接,直接使用,回调函数结束后自动回收:
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
使用`defer`方法直接获取一个连接池连接,直接使用,协程结束后自动回收:
````php
$redis = RedisPool::defer();
$name = $redis->get('name');
````
> 异常拦截,当invoke调用,内部发生(连接不够,连接对象错误)等异常情况时,会抛出PoolEmpty和PoolException,可在控制器基类拦截或直接忽略,EasySwoole内部有做异常拦截处理,将直接拦截并返回错误到前端.
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
        PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(1);
        //PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(预创建数量,必须小于连接池最大数量);
    }

    // var_dump('worker:' . $workerId . 'start');
    });
}
```

