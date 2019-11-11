---
title: Rpc服务端
meta:
  - name: description
    content: EasySwoole中Rpc服务端实现
  - name: keywords
    content: easyswoole|Rpc服务端|swoole RPC
---

# 如何定义一个Rpc服务

每一个Rpc服务其实就一个EasySwoole\Rpc\AbstractService类。 如下：

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-10-14
 * Time: 上午10:29
 */

namespace App\Rpc\Service;


use EasySwoole\Rpc\AbstractService;

class UserService extends AbstractService
{

    public function serviceName(): string
    {
        // TODO: Implement serviceName() method.
        return 'user';
    }

    public function register() {
        $this->response()->setResult('register');
    }
}
```
UserService类中serviceName定义当前得服务名字，register方法其实就是一个注册功能。

# 如何定义节点管理器

Easyswoole中的rpc包已经写好了节点管理器，具体可以看```php EasySwoole\Rpc\NodeManager```实现方式。

4.0.6版本后需要传redis连接池的方式。

4.0.6版本前需要传redis主机端口密码等参数。

如果您得项目需要考虑到redis集群方式，可以参考[redis集群文档](../Redis/cluster.md)。


# 服务端

4.0.6版本后

## 独立使用代码

```php

<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-11-11
 * Time: 下午3:34
 */

require_once "vendor/autoload.php";

use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\NodeManager\RedisManager;

$redisPool = new \EasySwoole\RedisPool\RedisPool(new \EasySwoole\Redis\Config\RedisConfig([
    'host' => '127.0.0.1'
]));
$manager = new RedisManager($redisPool);

$config = new Config();
$config->setServerIp('127.0.0.1');
$config->setNodeManager($manager);
$rpc = new Rpc($config);

$rpc->add(new \App\Rpc\Service\UserService());  //注册服务
$rpc->add(new \App\Rpc\Service\OrderService());
$rpc->add(new \App\Rpc\Service\NodeService());

$list = $rpc->generateProcess(); //获取注册的rpc worker自定义进程
foreach ($list['worker'] as $p){
    $p->getProcess()->start();
}

foreach ($list['tickWorker'] as $p){//获取注册的rpc tick自定义进程(ps:处理广播和监听广播)
    $p->getProcess()->start();
}

while($ret = \Swoole\Process::wait()) {
    echo "PID={$ret['pid']}\n";
}

```

## easyswoole框架下使用

第一种写法：

```php
<?php
use App\Rpc\Service\NodeService;
use App\Rpc\Service\OrderService;
use App\Rpc\Service\UserService;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Rpc;


#在EasySwooleEvent.php  的全局 mainServerCreate 事件中注册

$redisPool = new \EasySwoole\RedisPool\RedisPool(new \EasySwoole\Redis\Config\RedisConfig([
    'host' => '127.0.0.1'
]));

$manager = new RedisManager($redisPool);

$config = new \EasySwoole\Rpc\Config();
$config->setServerIp('127.0.0.1');//注册提供rpc服务的ip
$config->setNodeManager($manager);//注册节点管理器
$config->getBroadcastConfig()->setSecretKey('lucky');        //设置秘钥

$rpc = Rpc::getInstance($config);
$rpc->add(new UserService());  //注册服务
$rpc->add(new OrderService());
$rpc->add(new NodeService());

$rpc->attachToServer(ServerManager::getInstance()->getSwooleServer());

```

第二种写法：

```php
<?php
use App\Rpc\Service\NodeService;
use App\Rpc\Service\OrderService;
use App\Rpc\Service\UserService;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Redis\Config\RedisConfig;
use EasySwoole\RedisPool\Redis;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Rpc;

#在EasySwooleEvent.php  的全局 initialize 方法中注册

/**
 * REDIS协程连接池
 */
$redisData = Config::getInstance()->getConf('REDIS');
$redisConfig = new RedisConfig($redisData);
$redisConf = Redis::getInstance()->register('redis', $redisConfig);
$redisConf->setMaxObjectNum($redisData['POOL_MAX_NUM']);

#在EasySwooleEvent.php  的全局 mainServerCreate 事件中注册

$redisPool = new \EasySwoole\RedisPool\RedisPool(new \EasySwoole\Redis\Config\RedisConfig([
    'host' => '127.0.0.1'
]));

$manager = new RedisManager($redisPool);

$config = new \EasySwoole\Rpc\Config();
$config->setServerIp('127.0.0.1');//注册提供rpc服务的ip
$config->setNodeManager($manager);//注册节点管理器
$config->getBroadcastConfig()->setSecretKey('lucky');        //设置秘钥

$rpc = Rpc::getInstance($config);
$rpc->add(new UserService());  //注册服务
$rpc->add(new OrderService());
$rpc->add(new NodeService());

$rpc->attachToServer(ServerManager::getInstance()->getSwooleServer());

```

4.0.6版本前

## 独立使用代码
```php
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
```

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



