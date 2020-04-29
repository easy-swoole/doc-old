---
title: Redis connection pool
meta:
  - name: description
    content: easyswoole Redis connection pool component, implemented by universal connection pool and redis coroutine client package
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis|redis connection pool|swoole redis|redis connection pool
---

# Redis-Pool
Redis-Pool is based on [pool universal connection pool] (./Pool/introduction.md), [redis coroutine client] (./Redis/introduction.md) packaged components
## Installation
```shell
composer require easyswoole/redis-pool
```

## Connection pool registration
Register the Redis connection pool before using the connection:

```php
//Redis connection pool registration (config defaults to 127.0.0.1, port 6379)
\EasySwoole\RedisPool\Redis::getInstance()->register('redis',new \EasySwoole\Redis\Config\RedisConfig());

//Redis cluster connection pool registration
\EasySwoole\RedisPool\Redis::getInstance()->register('redisCluster',new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ]
));
```

## Connection pool configuration
When registered, the poolConf that will return the connection pool is used to configure the connection pool:
```php
$redisPoolConfig = \EasySwoole\RedisPool\Redis::getInstance()->register('redis',new \EasySwoole\Redis\Config\RedisConfig());
//Configure connection pool connections
$redisPoolConfig->setMinObjectNum(5);
$redisPoolConfig->setMaxObjectNum(20);

$redisClusterPoolConfig = \EasySwoole\RedisPool\Redis::getInstance()->register('redisCluster',new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ]
));
//Configure connection pool connections
$redisPoolConfig->setMinObjectNum(5);
$redisPoolConfig->setMaxObjectNum(20);
```

## Use a connection pool:

```php
//Redis connection pool registration (config defaults to 127.0.0.1, port 6379)
\EasySwoole\RedisPool\Redis::getInstance()->register('redis',new \EasySwoole\Redis\Config\RedisConfig());

//Redis cluster connection pool registration
\EasySwoole\RedisPool\Redis::getInstance()->register('redisCluster',new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ]
));
go(function () {
    //defer mode to get the connection
    $redis = \EasySwoole\RedisPool\Redis::defer('redis');
    $redisCluster = \EasySwoole\RedisPool\Redis::defer('redisCluster');
    $redis->set('a', 1);
    $redisCluster->set('a', 1);

    //invoke mode to get the connection
    \EasySwoole\RedisPool\Redis::invoker('redis', function (\EasySwoole\Redis\Redis $redis) {
        var_dump($redis->set('a', 1));
    });
    \EasySwoole\RedisPool\Redis::invoker('redisCluster', function (\EasySwoole\Redis\Redis $redis) {
        var_dump($redis->set('a', 1));
    });

    //Get the connection pool object
    $redisPool = \EasySwoole\RedisPool\Redis::getInstance()->get('redis');
    $redisClusterPool = \EasySwoole\RedisPool\Redis::getInstance()->get('redisCluster');

    $redis = $redisPool->getObj();
    $redisPool->recycleObj($redis);

    //Clear the timer in the pool
    \EasySwoole\Component\Timer::getInstance()->clearAll();
});
```
