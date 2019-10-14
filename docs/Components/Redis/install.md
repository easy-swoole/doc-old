---
title: 安装-redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现 
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端
---
## redis协程客户端
redis协程客户端,由swoole 协程client实现   
github地址: https://github.com/easy-swoole/redis 

## composer安装   
```php
composer require easyswoole/redis
```

## 使用客户端(需要协程环境):  
```php
$redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
    'host' => '127.0.0.1',
    'port' => '6379',
    'auth' => 'easyswoole',
    'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
]));
```

## redis使用示例
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

## redis集群使用示例
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