# Redis-Pool
Redis-Pool 基于 [pool通用连接池](./Pool/introduction.md),[redis协程客户端](./Redis/introduction.md)封装的组件
## 安装
```shell
composer require easyswoole/redis-pool
```

## 连接池注册
使用连接之前注册redis连接池:

```php
//redis连接池注册(config默认为127.0.0.1,端口6379)
\EasySwoole\RedisPool\Redis::getInstance()->register('redis',new \EasySwoole\Redis\Config\RedisConfig());

//redis集群连接池注册
\EasySwoole\RedisPool\Redis::getInstance()->register('redisCluster',new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ]
));
```

## 连接池配置
当注册好时,将返回连接池的poolConf用于配置连接池:
```php
$redisPoolConfig = \EasySwoole\RedisPool\Redis::getInstance()->register('redis',new \EasySwoole\Redis\Config\RedisConfig());
//配置连接池连接数
$redisPoolConfig->setMinObjectNum(5);
$redisPoolConfig->setMaxObjectNum(20);

$redisClusterPoolConfig = \EasySwoole\RedisPool\Redis::getInstance()->register('redisCluster',new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ]
));
//配置连接池连接数
$redisPoolConfig->setMinObjectNum(5);
$redisPoolConfig->setMaxObjectNum(20);
```

## 使用连接池:

```php
//redis连接池注册(config默认为127.0.0.1,端口6379)
\EasySwoole\RedisPool\Redis::getInstance()->register('redis',new \EasySwoole\Redis\Config\RedisConfig());

//redis集群连接池注册
\EasySwoole\RedisPool\Redis::getInstance()->register('redisCluster',new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ]
));
go(function () {
    //defer方式获取连接
    $redis = \EasySwoole\RedisPool\Redis::defer('redis');
    $redisCluster = \EasySwoole\RedisPool\Redis::defer('redisCluster');
    $redis->set('a', 1);
    $redisCluster->set('a', 1);

    //invoke方式获取连接
    \EasySwoole\RedisPool\Redis::invoker('redis', function (\EasySwoole\Redis\Redis $redis) {
        var_dump($redis->set('a', 1));
    });
    \EasySwoole\RedisPool\Redis::invoker('redisCluster', function (\EasySwoole\Redis\Redis $redis) {
        var_dump($redis->set('a', 1));
    });

    //获取连接池对象
    $redisPool = \EasySwoole\RedisPool\Redis::getInstance()->get('redis');
    $redisClusterPool = \EasySwoole\RedisPool\Redis::getInstance()->get('redisCluster');

    $redis = $redisPool->getObj();
    $redisPool->recycleObj($redis);

//清除pool中的定时器
    \EasySwoole\Component\Timer::getInstance()->clearAll();
});
```
