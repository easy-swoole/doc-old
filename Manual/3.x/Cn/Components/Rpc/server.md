# 服务端
## 独立使用代码
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
$config->setServerIp('127.0.0.1');//注册提供rpc服务的ip

$config->setNodeManager(new RedisManager('127.0.0.1'));//注册节点管理器
$config->getBroadcastConfig()->setSecretKey('lucky');    //设置秘钥

$config->getBroadcastConfig()->setEnableBroadcast(false);     //是否启用广播    (ps:使用redis节点可以关闭)
$config->getBroadcastConfig()->setEnableListen(false);        //是否启用监听广播(ps:使用redis节点可以关闭)

$rpc = new Rpc($config);
$rpc->add(new UserService());  //注册服务
$rpc->add(new OrderService());
$rpc->add(new NodeService());

$list = $rpc->generateProcess();   
foreach ($list['worker'] as $p) {//启动rpc 进程
    $p->getProcess()->start();
}

foreach ($list['tickWorker'] as $p) { //启动定时进程(ps:定时广播，监听广播)
    $p->getProcess()->start();
}

while ($ret = \Swoole\Process::wait()) {//回收子进程
    echo "PID={$ret['pid']}\n";
}
````
## easyswoole框架下使用

````php
<?php
use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Test\UserService;
use EasySwoole\Rpc\Test\OrderService;
use EasySwoole\Rpc\Test\NodeService;
use EasySwoole\EasySwoole\ServerManager;

#在EasySwooleEvent.php  的全局 mainServerCreate 事件中注册

$config = new Config();
$config->setServerIp('127.0.0.1');//注册提供rpc服务的ip
$config->setNodeManager(new RedisManager('127.0.0.1'));//注册节点管理器
$config->getBroadcastConfig()->setSecretKey('lucky');        //设置秘钥        

$rpc = Rpc::getInstance($config);;
$rpc->add(new UserService());  //注册服务
$rpc->add(new OrderService());
$rpc->add(new NodeService());

$rpc->attachToServer(ServerManager::getInstance()->getSwooleServer());

````



