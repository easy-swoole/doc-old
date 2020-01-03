---
title: Rpc server
meta:
  - name: description
    content: RPC server implementation in EasySwoole
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Rpc server | swoole RPC
---


# Server
## Independent code
````php
<?php
/**
 * Created by PhpStorm.
 * User: xcg
 * Date: 2019/5/30
 * Time: 9:17
 */
require_once 'vendor/autoload.php';

use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Test\UserService;
use EasySwoole\Rpc\Test\OrderService;
use EasySwoole\Rpc\Test\NodeService;

$config = new Config();
$config->setServerIp('127.0.0.1');//Register to provide ip service ip

$config->setNodeManager(new RedisManager('127.0.0.1'));//Register Node Manager
$config->getBroadcastConfig()->setSecretKey('lucky');    //Set key

$config->getBroadcastConfig()->setEnableBroadcast(false);     //Whether to enable broadcast (ps: use redis node to close)
$config->getBroadcastConfig()->setEnableListen(false);        //Whether to enable listening broadcast (ps: use redis node to close)

$rpc = new Rpc($config);
$rpc->add(new UserService());  //Registration service
$rpc->add(new OrderService());
$rpc->add(new NodeService());

$list = $rpc->generateProcess();   
foreach ($list['worker'] as $p) {//Start the rpc process
    $p->getProcess()->start();
}

foreach ($list['tickWorker'] as $p) { //Start the timing process (ps: timed broadcast, monitor broadcast)
    $p->getProcess()->start();
}

while ($ret = \Swoole\Process::wait()) {//Recycling child process
    echo "PID={$ret['pid']}\n";
}
````
## Used under the easyswoole framework

````php
<?php
use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Test\UserService;
use EasySwoole\Rpc\Test\OrderService;
use EasySwoole\Rpc\Test\NodeService;
use EasySwoole\EasySwoole\ServerManager;

#Register in the global mainServerCreate event of EasySwooleEvent.php

$config = new Config();
$config->setServerIp('127.0.0.1');//Register to provide ip service ip
$config->setNodeManager(new RedisManager('127.0.0.1'));//Register Node Manager
$config->getBroadcastConfig()->setSecretKey('lucky');        //Set key        

$rpc = Rpc::getInstance($config);;
$rpc->add(new UserService());  //Registration service
$rpc->add(new OrderService());
$rpc->add(new NodeService());

$rpc->attachToServer(ServerManager::getInstance()->getSwooleServer());

````



