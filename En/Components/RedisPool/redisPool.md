# Redis-Pool
EasySwoole provides a Redis Pool component, which is equivalent to a link manager highly encapsulated with Pool.
## Install
```
composer require easyswoole/redis-pool
```

> The component is encapsulated based on [Pool Manager](../Components/Component/pool.md)

## Add database configuration
Add configuration information in `dev.php' or `produce.php':
```php
/*################ REDIS CONFIG ##################*/
'REDIS' => [
    'host'          => '127.0.0.1',
    'port'          => '6379',
    'auth'          => '',
    'intervalCheckTime'    => 30 * 1000,//Timely validation of object availability and minimum connection interval
    'maxIdleTime'          => 15,//Maximum survival time is released every $intervalCheckTime/1000 seconds
    'maxObjectNum'         => 20,//Maximum Creation Quantity
    'minObjectNum'         => 5,//Minimum Creation Quantity,The minimum number of creation must not be greater than or equal to the maximum number of creation.  
]
```

## Main process registration
Normally, we register in the global initialize event in EasySwoole
```
use EasySwoole\EasySwoole\Config as GConfig;
use EasySwoole\RedisPool\Config;
use EasySwoole\RedisPool\Redis;
$configData = GConfig::getInstance()->getConf('REDIS');
$config = new Config($configData);
/**
    The name of the registration here is redis. You can register more than one, such as redis2, redis3.
*/
$poolConf = Redis::getInstance()->register('redis',$config);
$poolConf->setMaxObjectNum($configData['maxObjectNum']);
$poolConf->setMinObjectNum($configData['minObjectNum']);
```

## Use anywhere after service starts
```
  /*@var \EasySwoole\RedisPool\Connection $redis */
    $redis = \EasySwoole\RedisPool\Redis::getInstance()->pool('redis')::defer();
    ($redis->set('name','test name'));
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

    //Native access, getobj and recycleObj must be used in pairs
    $redis =\EasySwoole\RedisPool\Redis::getInstance()->pool('redis')->getObj();
    var_dump($redis->get('name'));
    //recovery
    \EasySwoole\RedisPool\Redis::getInstance()->pool('redis')->recycleObj($redis);
```

## Method List
EasySwoole\RedisPool\Connection is actually a subclass of Swoole\Coroutine\Redis, and the list of supported methods is as follows:

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

## Native Realization

### Define a Pool object
```
namespace App\Utility\Pool;

use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\EasySwoole\Config;

class RedisPool extends AbstractPool
{
    /**
     * Create redis connection pool objects
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
            return $redis;
        }else{
            return null;
        }
    }
}

```

### Define a PoolObject object
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

### Pool register
We register in the EasySwoole global mainServerCreate event
```
use use App\Utility\Pool\RedisPool;
PoolManager::getInstance()->register(RedisPool::class)
```

> When registration is successful, a PoolConf object is returned. You can set the maximum and minimum number of connections for this pool and other information.

### Pool call
Method 1
```
/** @var Redis $redis */
$redis = RedisPool::defer();
$redis->set('test','test');
```
Method 2

```
$data = RedisPool::invoke(function (Redis $redis){
    $redis->set('test','test');
    return $redis->get('test');
});
```
Method 3
```
$redis = PoolManager::getInstance()->getPool(RedisPool::class)->getObj();
$data = $redis->get('test');
//Recycling after use
PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($redis);
```

> See the [pool manager](../Components/Component/pool.md) for the rest of the invocation methods