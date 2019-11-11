---
title: Rpc客户端
meta:
  - name: description
    content: EasySwoole中Rpc客户端实现
  - name: keywords
    content: easyswoole|Rpc客户端|swoole RPC
---

# 客户端

## CLI独立测试(注意命名空间以及自动加载引入)

4.0.6版本后([demo](https://github.com/HeKunTong/rpc))

````php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-10-14
 * Time: 上午10:34
 */

require_once 'vendor/autoload.php';

use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Response;

$redisPool = new \EasySwoole\RedisPool\RedisPool(new \EasySwoole\Redis\Config\RedisConfig([
    'host' => '127.0.0.1'
]));
$manager = new RedisManager($redisPool);

$config = new Config();
$config->setNodeManager($manager);
$rpc = new Rpc($config);

go(function () use ($rpc) {
    $client = $rpc->client();
    $client->addCall('user', 'register', ['arg1', 'arg2'])
        ->setOnFail(function (Response $response) {
            print_r($response->toArray());
        })
        ->setOnSuccess(function (Response $response) {
            print_r($response->toArray());
        });

    $client->exec();
});

````


4.0.6版本前([demo](https://github.com/HeKunTong/rpc4.0.5))

````php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-10-14
 * Time: 上午10:34
 */

require_once 'vendor/autoload.php';

use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Response;

$manager = new RedisManager('127.0.0.1');

$config = new Config();
$config->setNodeManager($manager);
$rpc = new Rpc($config);

go(function () use ($rpc) {
    $client = $rpc->client();
    $client->addCall('user', 'register', ['arg1', 'arg2'])
        ->setOnFail(function (Response $response) {
            print_r($response->toArray());
        })
        ->setOnSuccess(function (Response $response) {
            print_r($response->toArray());
        });

    $client->exec();
});

````
##easyswoole 框架下
````php
<?php
$client=Rpc::getInstance()->client();
go(function () use ($client) {
    $client->addCall('UserService', 'register', ['arg1', 'arg2'])
        ->setOnFail(function (Response $response) {
            print_r($response->toArray());
        })
        ->setOnSuccess(function (Response $response) {
            print_r($response->toArray());
        });
    $client->exec();
});
````