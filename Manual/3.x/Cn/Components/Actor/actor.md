# ACTOR

提供Actor模式支持，助力游戏行业开发。EasySwoole的Actor采用自定义process作为存储载体，以协程作为最小调度单位，利用协程Channel做mail box,而客户端与process之间的通讯，采用UnixSocket实现，并且借助TCP实现分布式的ActorClient，超高并发下也能轻松应对。

## Actor如何工作

一般来说有两种策略用来在并发线程中进行通信：共享数据和消息传递。使用共享数据方式的并发编程面临的最大的一个问题就是数据条件竞争，当两个实例需要访问同一个数据时，为了保证数据的一致性，通常需要为数据加锁，而Actor模型采用消息传递机制来避免数据竞争，无需复杂的加锁操作，各个实例只需要关注自身的状态以及处理收到的消息。

Actor是完全面向对象、无锁、异步、实例隔离、分布式的并发开发模式。Actor实例之间互相隔离，Actor实例拥有自己独立的状态，各个Actor之间不能直接访问对方的状态，需要通过消息投递机制来通知对方改变状态。由于每个实例的状态是独立的，没有数据被共享，所以不会发生数据竞争，从而避免了并发下的加锁问题。

举一个游戏场景的例子，在一个游戏房间中，有5个玩家，每个玩家都是一个PlayerActor，拥有自己的属性，比如角色ID，昵称，当前血量，攻击力等，游戏房间本身也是一个RoomActor，房间也拥有属性，比如当前在线的玩家，当前场景的怪物数量，怪物血量等。此时玩家A攻击某个怪物，则PlayerActor-A向RoomActor发送一个攻击怪物的指令，RoomActor经过计算，得出玩家A对怪物的伤害值，并给房间内的所有PlayerActor发送一个消息（玩家A攻击怪物A，造成175点伤害，怪物A剩余血量1200点），类似此过程，每个PlayerActor都可以得知房间内发生了什么事情，但又不会造成同时访问怪物A的属性，导致的共享加锁问题

## 基础用法

Actor并没有作为内置组件，需要先引入包并进行基础配置才能够使用

```php
composer require easyswoole/actor=2.x-dev
```

##### 建立一个Actor

每一种对象（玩家、房间、甚至是日志服务也可以作为一种Actor对象）都建立一个Actor来进行管理，一个对象可以拥有多个实例（Client）并且可以互相通过信箱发送消息来处理业务

```php
<?php

namespace App\Player;

use EasySwoole\Actor\AbstractActor;
use EasySwoole\Actor\ActorConfig;

/**
 * 玩家Actor
 * Class PlayerActor
 * @package App\Player
 */
class PlayerActor extends AbstractActor
{
    /**
     * 配置当前的Actor
     * @param ActorConfig $actorConfig
     */
    public static function configure(ActorConfig $actorConfig)
    {
        $actorConfig->setActorName('PlayerActor');
        $actorConfig->setWorkerNum(3);
    }

    /**
     * Actor首次启动时
     */
    protected function onStart()
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onStart\n";
    }

    /**
     * Actor收到消息时
     * @param $msg
     */
    protected function onMessage($msg)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onMessage\n";
    }

    /**
     * Actor即将退出前
     * @param $arg
     */
    protected function onExit($arg)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onExit\n";
    }

    /**
     * Actor发生异常时
     * @param \Throwable $throwable
     */
    protected function onException(\Throwable $throwable)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onException\n";
    }

}
```

##### 注册Actor服务

可以使用setListenAddress和setListenPort指定本机对外监听的端口，其他机器可以通过该端口向本机的Actor发送消息

```php

public static function mainServerCreate(EventRegister $register) {

    // 注册Actor管理器
    $server = ServerManager::getInstance()->getSwooleServer();
    Actor::getInstance()->register(PlayerActor::class);
    Actor::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)
        ->setListenAddress('0.0.0.0')->setListenPort('9900')->attachServer($server);
        
}
```

##### Actor实例管理

服务启动后就可以进行Actor的操作，管理本机的Client实例，则不需要给client传入$node参数，默认的node为本机，管理其他机器时需要传入

```php

    // 管理本机的Actor则不需要声明节点
    $node = new ActorNode;
    $node->setIp('127.0.0.1');
    $node->setListenPort(9900);

    // 启动一个Actor并得到ActorId 后续操作需要依赖ActorId
    $actorId = PlayerActor::client($node)->create(['time' => time()]);   // 00101000000000000000001
    // 给某个Actor发消息
    PlayerActor::client($node)->send($actorId, ['data' => 'data']);
    // 给该类型的全部Actor发消息
    PlayerActor::client($node)->sendAll(['data' => 'data']);
    // 退出某个Actor
    PlayerActor::client($node)->exit($actorId, ['arg' => 'arg']);
    // 退出全部Actor
    PlayerActor::client($node)->exitAll(['arg' => 'arg']);
    
```