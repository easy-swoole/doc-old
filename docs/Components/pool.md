# Pool
通用的连接池管理。
## 安装
```php
composer require easyswoole/pool
```

## 基础实例代码
### 定义池对象
```php
class Std implements \EasySwoole\Pool\ObjectInterface {
    function gc()
    {
        /*
         * 本对象被pool执行unset的时候
         */
    }

    function objectRestore()
    {
        /*
         * 回归到连接池的时候
         */
    }

    function beforeUse(): ?bool
    {
        /*
         * 取出连接池的时候，若返回false，则当前对象被弃用回收
         */
        return true;
    }

    public function who()
    {
        return spl_object_id($this);
    }
}
```
### 定义池
```php

class StdPool extends \EasySwoole\Pool\AbstractPool{
    
    protected function createObject()
    {
        return new Std();
    }
}

```
> 不一定非要创建返回 ```EasySwoole\Pool\ObjectInterface``` 对象，任意类型对象均可

### 使用
```php

$config = new \EasySwoole\Pool\Config();
$pool = new StdPool($config);

go(function ()use($pool){
    $obj = $pool->getObj();
    $obj2 = $pool->getObj();
    var_dump($obj->who());
    var_dump($obj2->who());
});
```

## Redis连接池示例

### 安装easyswoole/redis组件:

```shell
composer require easyswoole/redis
```

### 新增redisPool管理器
新增文件`/App/Pool/RedisPool.php`

```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/10/15 0015
 * Time: 14:46
 */

namespace App\Pool;

use EasySwoole\Pool\Config;
use EasySwoole\Pool\AbstractPool;
use EasySwoole\Redis\Config\RedisConfig;
use EasySwoole\Redis\Redis;

class RedisPool extends AbstractPool
{
    protected $redisConfig;

    /**
     * 重写构造函数,为了传入redis配置
     * RedisPool constructor.
     * @param Config      $conf
     * @param RedisConfig $redisConfig
     * @throws \EasySwoole\Pool\Exception\Exception
     */
    public function __construct(Config $conf,RedisConfig $redisConfig)
    {
        parent::__construct($conf);
        $this->redisConfig = $redisConfig;
    }

    protected function createObject()
    {
        //根据传入的redis配置进行new 一个redis
        $redis = new Redis($this->redisConfig);
        return $redis;
    }
}
```
注册到Manager中:
```php
$config = new \EasySwoole\Pool\Config();

$redisConfig1 = new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS1'));

$redisConfig2 = new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS2'));

\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig1),'redis1');

\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig2),'redis2');

```

调用(可在控制器中全局调用):
```php
go(function (){
   
    $redis1=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();
    $redis2=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();

    $redis1->set('name','仙士可');
    var_dump($redis1->get('name'));

    $redis2->set('name','仙士可2号');
    var_dump($redis2->get('name'));

    //回收对象
    \EasySwoole\Pool\Manager::getInstance()->get('redis1')->unsetObj($redis1);
    \EasySwoole\Pool\Manager::getInstance()->get('redis2')->unsetObj($redis2);
});
```






## 连接池配置项
在实例化一个连接池对象时,需要传入一个连接池配置对象`EasySwoole\Pool\Config`,该对象的属性如下:

| 配置项             | 默认值  | 说明                    | 备注                                                                                  |
|:-------------------|:--------|:------------------------|:--------------------------------------------------------------------------------------|
| $intervalCheckTime | 30*1000 | 定时器执行频率           | 用于定时执行连接池对象回收,创建操作                                                       |
| $maxIdleTime       | 15      | 连接池对象最大闲置时间(秒) | 超过这个时间未使用的对象将会被定时器回收                                                  |
| $maxObjectNum      | 20      | 连接池最大数量           | 每个进程最多会创建$maxObjectNum连接池对象,如果对象都在使用,则会返回空,或者等待连接空闲        |
| $minObjectNum      | 5       | 连接池最小数量(热启动)    | 当连接池对象总数低于$minObjectNum时,会自动创建连接,保持连接的活跃性,让控制器能够尽快的获取连接 |
| $getObjectTimeout  | 3.0     | 获取连接池的超时时间      | 当连接池为空时,会等待$getObjectTimeout秒,如果期间有连接空闲,则会返回连接对象,否则返回null    |
| $extraConf         |         | 额外配置信息             | 在实例化连接池前,可把一些额外配置放到这里,例如数据库配置信息,redis配置等等                   |


## 池管理器

池管理器可以做全局的连接池管理,例如在`EasySwooleEvent.php`中的`initialize`中注册,然后可以在控制器中获取连接池进行获取连接:
```php
public static function initialize()
{
    // TODO: Implement initialize() method.
    date_default_timezone_set('Asia/Shanghai');

    $config = new \EasySwoole\Pool\Config();

    $redisConfig1 = new \EasySwoole\Redis\Config\RedisConfig(Config::getInstance()->getConf('REDIS1'));
    $redisConfig2 = new \EasySwoole\Redis\Config\RedisConfig(Config::getInstance()->getConf('REDIS2'));
    //注册连接池管理对象
    \EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig1),'redis1');
    \EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig2),'redis2');

}
```

控制器获取连接池连接:
```php
public function index()
{
    //取出连接池管理对象,并getObj
   
    $redis1=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();
    $redis2=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();

    $redis1->set('name','仙士可');
    var_dump($redis1->get('name'));

    $redis2->set('name','仙士可2号');
    var_dump($redis2->get('name'));

    //回收对象
    \EasySwoole\Pool\Manager::getInstance()->get('redis1')->unsetObj($redis1);
    \EasySwoole\Pool\Manager::getInstance()->get('redis2')->unsetObj($redis2);
}
```


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