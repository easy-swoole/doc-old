---
title: EasySwoole通用连接池
meta:
  - name: description
    content: EasySwoole通用连接池,协程连接池,easyswoole连接池
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|连接池|swoole 连接池|通用连接池
---


## 池对象方法

| 方法名称      | 参数                                     | 说明                                                        | 备注                                         |
|:--------------|:-----------------------------------------|:-----------------------------------------------------------|:--------------------------------------------|
| createObject  |                                          | 抽象方法,创建连接对象                                        |                                             |
| recycleObj    | $obj                                     | 回收一个连接                                                |                                             |
| getObj        | float $timeout = null, int $tryTimes = 3 | 获取一个连接,超时时间$timeout,尝试获取$tryTimes次             |                                             |
| unsetObj      | $obj                                     | 直接释放一个连接                                             |                                             |
| idleCheck     | int $idleTime                            | 回收超过$idleTime未出队使用的连接                             |                                             |
| intervalCheck |                                          | 回收连接,以及热启动方法,允许外部调用热启动                      |                                             |
| keepMin       | ?int $num = null                         | 保持最小连接(热启动)                                         |                                             |
| getConfig     |                                          | 获取连接池的配置信息                                         |                                             |
| status        |                                          | 获取连接池状态信息                                           | 获取当前连接池已创建,已使用,最大创建,最小创建数据 |
| isPoolObject  | $obj                                     | 查看$obj对象是否由该连接池创建                                |                                             |
| isInPool      | $obj                                     | 获取当前连接是否在连接池内未使用                               |                                             |
| destroyPool   |                                          | 销毁该连接池                                                |                                             |
| reset         |                                          | 重置该连接池                                                |                                             |
| invoke        | callable $call,float $timeout = null     | 获取一个连接,传入到$call回调函数中进行处理,回调结束后自动回收连接 |                                             |
| defer         | float $timeout = null                    | 获取一个连接,协程结束后自动回收                               |                                             |


### getObj
获取一个连接池的对象:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    $redis = $redisPool->getObj();
    var_dump($redis->echo('仙士可'));
    $redisPool->recycleObj($redis);
});
```
::: warning
通过getObj方法获取的对象,都必须调用unsetObj或者recycleObj进行回收,否则连接池对象会越来越少
:::

### unsetObj
直接释放一个连接池对象,其他协程不能再获取这个连接,而是会重新创建一个连接

::: warning
释放之后,并不会立即销毁该对象,而是会在作用域结束之后销毁
:::

### recycleObj
回收一个连接对象,回收之后,其他协程可以正常获取这个连接.
::: warning
回收之后,其他协程可以正常获取这个连接,但在此时,该连接还处于当前协程中,如果再次调用该连接进行数据操作,将会协程混乱,所以需要开发人员自行约束,当recycleObj不能再操作这个对象
:::

### invoke
获取一个连接,传入到$call回调函数中进行处理,回调结束后自动回收连接:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    $redisPool->invoke(function (\EasySwoole\Redis\Redis $redis){
        var_dump($redis->echo('仙士可'));
    });
});

```
::: warning
通过该方法无需手动回收连接,在回调函数结束后,则自动回收
:::

### defer
获取一个连接,协程结束后自动回收
```php
go(function () {
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    $redis = $redisPool->defer();
    var_dump($redis->echo('仙士可'));
});
```
::: warning
通过该方法无需手动回收连接,在协程结束后,则自动回收
:::

::: warning
需要注意的事,defer方法是协程结束后才回收,如果你当前协程运行时间过长,则会一直无法回收,直到协程结束
:::

### keepMin
保持最小连接(热启动)
由于easyswoole/pool的
当一启动服务,出现过大的并发时,可能会突然需要几十上百个连接,这个时候为了使创建连接的时间分散,可以通过调用keepMin进行预热启动连接  
调用此方法后,将会预先创建n个连接,用于服务启动之后的控制器直接获取连接:
在`EasySwooleEvent.php`中的`mainServerCreate`中,当worker进程启动后,热启动连接
```php

public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
        if ($server->taskworker == false) {
            //每个worker进程都预创建连接
            \EasySwoole\Pool\Manager::getInstance()->get('redis')->keepMin(10);
            var_dump(\EasySwoole\Pool\Manager::getInstance()->get('redis')->status());
        }
    });

    // TODO: Implement mainServerCreate() method.
}
```
将会输出:
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
 keepMin是根据不同进程,创建不同的连接的,比如你有10个worker进程,将会输出10次,总共创建10*10=100个连接
:::

### getConfig
获取连接池的配置:
```php
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    var_dump($redisPool->getConfig());

```

### destroyPool
销毁连接池  
调用之后,连接池剩余的所有链接都会unsetObj,并且将关闭连接队列,调用之后getObj等方法都将失效:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    var_dump($redisPool->getObj());
    $redisPool->destroyPool();
    var_dump($redisPool->getObj());
});
```
### reset
重置连接池,调用reset之后,会自动调用destroyPool销毁连接池,并在下一次getObj时重新初始化该连接池:
```php
go(function (){
    $redisPool = new \App\Pool\RedisPool(new \EasySwoole\Pool\Config(), new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS')));
    var_dump($redisPool->getObj());
    $redisPool->reset();
    var_dump($redisPool->getObj());
});
```

### status
获取连接池当前状态,调用之后将输出:
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
回收空闲超时的连接

### intervalCheck
调用此方法后,将调用idleCheck和keepMin方法,用于手动回收空闲连接和手动热启动连接
```php
public function intervalCheck()
{
    $this->idleCheck($this->getConfig()->getMaxIdleTime());
    $this->keepMin($this->getConfig()->getMinObjectNum());
}
```
