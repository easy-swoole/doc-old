---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## Redis coroutine client
Redis coroutine client,Implemented by swoole coroutine client   
github地址: https://github.com/easy-swoole/redis 

## Composer installation   
```php
composer require easyswoole/redis
```

## Use the client (requires a coroutine environment): 
```php
$redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
    'host' => '127.0.0.1',
    'port' => '6379',
    'auth' => 'easyswoole',
    'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
]));
```

## Redis usage example
```php
<?php
include "../vendor/autoload.php";
go(function (){
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host' => '127.0.0.1',
        'port' => '6379',
        'auth' => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));
    var_dump($redis->set('a',1));
    var_dump($redis->get('a'));
});
```

## Redis cluster usage example
```php
<?php
include "../vendor/autoload.php";
go(function () {
    $redis = new \EasySwoole\Redis\RedisCluster(new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ], [
        'auth' => '',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_PHP
    ]));
    var_dump($redis->set('a',1));
    var_dump($redis->get('a'));
    var_dump($redis->clusterKeySlot('a'));

});
```
