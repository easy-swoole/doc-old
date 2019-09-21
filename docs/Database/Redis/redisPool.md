---
title: 连接池
meta:
  - name: description
    content: 用swoole协程channle实现的redis连接池
  - name: keywords
    content:  EasySwoole 连接池|swoole 连接池|swoole redis连接池|PHP连接池
---

# Redis-Pool
EasySwoole 提供了一个Redis Pool组件，等于高度封装了Pool的链接管理器
## 安装
```
composer require easyswoole/redis-pool
```
> 该组件基于[pool管理器](../Components/Component/pool.md)封装

## 添加数据库配置
在`dev.php`或者是`produce.php`中添加配置信息：
```php
/*################ REDIS CONFIG ##################*/
'REDIS' => [
    'host'          => '127.0.0.1',
    'port'          => '6379',
    'auth'          => '',
    'db'            => 1,//选择数据库,默认为0
    'intervalCheckTime'    => 30 * 1000,//定时验证对象是否可用以及保持最小连接的间隔时间
    'maxIdleTime'          => 15,//最大存活时间,超出则会每$intervalCheckTime/1000秒被释放
    'maxObjectNum'         => 20,//最大创建数量
    'minObjectNum'         => 5,//最小创建数量 最小创建数量不能大于等于最大创建   
]
```

## 主进程注册
一般滴，我们在EasySwoole的全局initialize 事件中，进行注册
```
use EasySwoole\EasySwoole\Config as GConfig;
use EasySwoole\RedisPool\Config;
use EasySwoole\RedisPool\Redis;
$configData = GConfig::getInstance()->getConf('REDIS');
$config = new Config($configData);
// $config->setOptions(['serialize'=>true]);
/**
    这里注册的名字叫redis，你可以注册多个，比如redis2,redis3
*/
$poolConf = Redis::getInstance()->register('redis',$config);
$poolConf->setMaxObjectNum($configData['maxObjectNum']);
$poolConf->setMinObjectNum($configData['minObjectNum']);
```

### 可配置选项

- connect_timeout: 连接的超时时间, 默认为全局的协程socket_connect_timeout(1秒)

- timeout: 超时时间, 默认为全局的协程socket_timeout(-1, 永不超时)

- serialize: 自动序列化, 默认开启

- reconnect: 自动连接尝试次数, 如果连接由于超时等原因被close正常断开, 下一次发起请求时, 会自动尝试连接然后再发送请求, 默认为1次(true), 一旦失败指定次数后不会再继续尝试, 需手动重连. 该机制仅用于连接保活, 不会重发请求导致不幂等接口出错等问题

- compatibility_mode: hmGet/hGetAll/zRange/zRevRange/zRangeByScore/zRevRangeByScore 函数返回结果与php-redis不一致的兼容解决方案，开启之后 Co\Redis 和 php-redis 返回结果一致，默认关闭

> compatibility_mode 配置项在4.4.0或更高版本可用

## 服务启动后任意位置使用
```
  /*@var \EasySwoole\RedisPool\Connection $redis */
    $redis = \EasySwoole\RedisPool\Redis::getInstance()->pool('redis')::defer();
    ($redis->set('name','仙士可'));
    
    $redis = \EasySwoole\RedisPool\Redis::defer('redis');
    var_dump($redis->get('name'));
    
    $data = \EasySwoole\RedisPool\Redis::invoker('redis',function (\EasySwoole\RedisPool\Connection $redis){
        return $redis->get('name');
    });
    var_dump($data);
    $data = \EasySwoole\RedisPool\Redis::getInstance()->pool('redis')::invoke(function (\EasySwoole\RedisPool\Connection $redis){
        return $redis->get('name');
    });
    var_dump($data);

    //原生获取方式，getobj和recycleObj必须成对使用
    $redis =\EasySwoole\RedisPool\Redis::getInstance()->pool('redis')->getObj();
    var_dump($redis->get('name'));
    //回收
    \EasySwoole\RedisPool\Redis::getInstance()->pool('redis')->recycleObj($redis);
```

## 如何使用select
redis默认操作数据库为0,可以通过`select`方法改变数据库,可以通过原生实现redis数据库,在`createObject`的时候调用`select`方法,在本页面下文的`原生实现`标题中有介绍.  

> redis-pool组件已经实现了select,只需要在配置项配置db即可  

## 方法列表
EasySwoole\RedisPool\Connection 实际上是 Swoole\Coroutine\Redis 的子类,支持的方法列表如下：

- connect
- getAuth
- getDBNum
- getOptions
- setOptions
- getDefer
- setDefer
- recv
- request
- close
- set
- setBit
- setEx
- psetEx
- lSet
- get
- mGet
- del
- hDel
- hSet
- hMSet
- hSetNx
- delete
- mSet
- mSetNx
- getKeys
- keys
- exists
- type
- strLen
- lPop
- blPop
- rPop
- brPop
- bRPopLPush
- lSize
- lLen
- sSize
- scard
- sPop
- sMembers
- sGetMembers
- sRandMember
- persist
- ttl
- pttl
- zCard
- zSize
- hLen
- hKeys
- hVals
- hGetAll
- debug
- restore
- dump
- renameKey
- rename
- renameNx
- rpoplpush
- randomKey
- pfadd
- pfcount
- pfmerge
- ping
- auth
- unwatch
- watch
- save
- bgSave
- lastSave
- flushDB
- flushAll
- dbSize
- bgrewriteaof
- time
- role
- setRange
- setNx
- getSet
- append
- lPushx
- lPush
- rPush
- rPushx
- sContains
- sismember
- zScore
- zRank
- zRevRank
- hGet
- hMGet
- hExists
- publish
- zIncrBy
- zAdd
- zDeleteRangeByScore
- zRemRangeByScore
- zCount
- zRange
- zRevRange
- zRangeByScore
- zRevRangeByScore
- zRangeByLex
- zRevRangeByLex
- zInter
- zinterstore
- zUnion
- zunionstore
- incrBy
- hIncrBy
- incr
- decrBy
- decr
- getBit
- lInsert
- lGet
- lIndex
- setTimeout
- expire
- pexpire
- expireAt
- pexpireAt
- move
- select
- getRange
- listTrim
- ltrim
- lGetRange
- lRange
- lRem
- lRemove
- zDeleteRangeByRank
- zRemRangeByRank
- incrByFloat
- hIncrByFloat
- bitCount
- bitOp
- sAdd
- sMove
- sDiff
- sDiffStore
- sUnion
- sUnionStore
- sInter
- sInterStore
- sRemove
- srem
- zDelete
- zRemove
- zRem
- pSubscribe
- subscribe
- unsubscribe
- pUnSubscribe
- multi
- exec
- eval
- evalSha
- script

## 原生实现

### 定义一个Pool对象
```
namespace App\Utility\Pool;

use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\EasySwoole\Config;

class RedisPool extends AbstractPool
{
    /**
     * 创建redis连接池对象
     * @return bool
     */
    protected function createObject()
    {
        // TODO: Implement createObject() method.
        if (!extension_loaded('redis')) {
            throw new \BadFunctionCallException('not support: redis');
        }
        $conf = Config::getInstance()->getConf('REDIS');
        $redis = new RedisObject();
        $connected = $redis->connect($conf['host'], $conf['port']);
        if($connected){
            if(!empty($conf['auth'])){
                $redis->auth($conf['auth']);
            }
            //选择数据库,默认为0
            if(!empty($conf['db'])){
                $redis->select($conf['db']);
            }
            return $redis;
        }else{
            return null;
        }
    }
}

```

### 定义一个PoolObject对象
```
namespace App\Utility\Pool;


use EasySwoole\Component\Pool\PoolObjectInterface;
use Swoole\Coroutine\Redis;

class RedisObject extends Redis implements PoolObjectInterface
{
    function gc()
    {
        // TODO: Implement gc() method.
        $this->close();
    }

    function objectRestore()
    {
        // TODO: Implement objectRestore() method.
    }

    function beforeUse(): bool
    {
        // TODO: Implement beforeUse() method.
        return true;
    }
}
```

### Pool注册
我们在EasySwoole全局的mainServerCreate事件中进行注册
```
use use App\Utility\Pool\RedisPool;
PoolManager::getInstance()->register(RedisPool::class)
```

> 注册成功的时候，会返回一个PoolConf对象，你可以设置这个pool的最大最小连接数等其他信息

### Pool 调用
方法一
```
/** @var Redis $redis */
$redis = RedisPool::defer();
$redis->set('test','test');
```
方法二

```
$data = RedisPool::invoke(function (Redis $redis){
    $redis->set('test','test');
    return $redis->get('test');
});
```
方法三
```
$redis = PoolManager::getInstance()->getPool(RedisPool::class)->getObj();
$data = $redis->get('test');
//使用完毕需要回收
PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($redis);
```

> 其余调用方法请看[pool管理器](../Components/Component/pool.md)章节