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

## Actor2架构解读

### Actor
应该叫ActorManager更确切点，它用来注册Actor、启动Proxy和ActorWorker进程。
当你在业务逻辑里定义了几种Actor，比如RoomActor、PlayerActor，我们需要在SwooleServer启动时注册它们。
具体就是在EasySwooleEvent.mainServerCreate方法中添加如下代码。
```
$actor = Actor::getInstance();
$actor->register(RoomActor::class);
$actor->register(PlayerActor::class);
$actorConf = Config::getInstance()->getConf('ACTOR_SERVER');
$actor->setMachineId($actorConf['MACHINE_ID'])
    ->setListenAddress($actorConf['LISTEN_ADDRESS'])
    ->setListenPort($actorConf['PORT'])
    ->attachServer($server);
```
其中ListenAddress、ListenPort为Proxy进程的监听地址端口，MachineId为ActorWorker进程的机器码。
MachineId和IP:PORT对应。
attachServer将开启相应数量的Proxy进程，以及前边register的ActorWorker进程。

#### 工作原理
Proxy进程做消息中转，Worker进程做消息分发推送。来看个具体的例子：

游戏中玩家P请求进入房间R，抽象成Actor模型就是PlayerActor需要往RoomActor发送请求加入的命令。
那么这时候需要这样写：
```
PlayerActor::client($node)->send($roomActorId, $msg)
```
PlayerActor创建了一个client（ActorClient）。
参数$node用来寻址Proxy，它由目标Actor实例的Worker.MachineId决定，在本例中就是$roomActorId被创建在了哪个MachineId的WorkerProcess。
通过$roomActorId中的机器码找到IP:PORT，生成$node。
send时会创建一个协程TcpClient，将消息发送给Proxy，然后Proxy将消息转发（UnixClient）至本机WorkerProcess，WorkerProcess收到消息，推送到具体的Actor实例。
这样就完成了从PlayerActor到RoomActor的请求通讯，RoomActor收到请求消息并处理完成后，向PlayerActor回发处理结果，用的是同样的通讯流程。
如果是单机部署，可以忽略$node参数，因为所有通讯都是在本机进行。
多机的话，需要自己根据业务来实现Actor如何分布和定位。

#### 主要属性

*machineId* 机器码

*proxyNum* 启动几个ProxyProcess

*listenPort* 监听端口

*listenAddress* 监听ip

### AbstractActor
Actor实例的基类，所有业务中用到的Actor都将继承于AbstractActor。例如游戏场景中的房间，你可以：
```
class RoomActor extends AbstractActor
```
#### 工作原理
每个Actor实例都维护一份独立的数据和状态，当一个Actor实例通过client()->create()后，会开启协程循环，接收mailbox pop的消息，进而处理业务逻辑，更新自己的数据及状态。具体实现就是__run()这个方法。

#### 静态方法 configure
用来配置ActorCofig，只需要在具体的Actor（如RoomActor）去重写这个方法就行。
关于ActorConfig具体属性可以看下边ActorConfig部分。

#### 几个虚拟方法
以下几个虚拟方法需要在Actor子类中实现，这几个方法被用在__run()中来完成Actor的运行周期。

*onStart()* 在协程开启前执行，你可以在此进行Actor初始化的一些操作，比如获取房间的基础属性等。

*onMessage()* 当接收到消息时执行，一个Actor实例的生命周期基本上就是在收消息-处理-发消息，你需要在这里对消息进行解析处理。

*onExit()* 当接收到退出命令时执行。比如你希望在一个Actor实例退出的时候，同时通知某些关联的其他Actor，可以在此处理。

#### 其他
*exit()* 用于实例自己退出操作，会向自己发一条退出的命令。

*tick()、after()* 两个定时器，用于Actor实例的定时任务，比如游戏房间的定时刷怪（tick）；掉线后多长时间自动踢出(after)。

*static client()* 用于创建一个ActorClient来进行对应Actor（实例）的通讯。

### ActorClient
Actor通讯客户端，调用xxActor::client()来创建一个ActorClient进行Actor通讯。
上边已经大概讲过了Actor的通讯流程，本质就是TcpClient->Proxy进程->UnixClient->ActorWorker进程->xxActor。
看下它实现了哪些方法：

*create()* 创建一个xxActor实例，返回actorId，在之后你可以使用这个actorId与此实例进行通讯。

*send()* 指定actorId，向其发送消息。

*exit()* 通知xxActor退出指定actorId的实例。

*sendAll()* 向所有的xxActor实例发送消息。

*exitAll()* 退出所有xxActor实例。

*exist()* 当前是否存在指定actorId的xxActor实例。

*status()* 当前ActorWorker下xxActor的分布状态。

### ActorConfig
具体Actor的配置项，比如RoomActor、PlayerActor都有自己的配置。

*actorName* 一般用类名就可以，注意在同一个服务中这个是不能重复的。

*actorClass* 在Actor->register()会将对应的类名写入。

*workerNum* 为Actor开启几个进程，Actor->attachServer()时会根据这个参数为相应Actor启动WorkerNum个Worker进程

### ActorNode
上边提到过，xxActor::client($node)，这个$node就是ActorNode对象，属性为Ip和Port，用于寻址Proxy，就不多说了。

### WorkerConfig
WorkerProcess的配置项，WorkerProcess启动时用到。

*workerId* worker进程Id，create Actor的时候用于生成actorId

*machineId* worker进程机器码，create Actor的时候用于生成actorId

*trigger* 异常触发处理接口

### WorkerProcess
Actor的重点在这里，每个注册的Actor（类）会启动相应数量的WorkerProcess。
比如你注册了RoomActor、PlayerActor，workerNum都配置的是3，那么系统将启动3个RoomActor的Worker进程和3个PlayerActor的Worker进程。
每个WorkerProcess维护一个ActorList，你通过client()->create()的Actor将分布在不同Worker进程里，由它的ActorList进行管理。
WorkerProcess通过协程接收client（这个client就是Proxy做转发时的UnixClient）消息，区分消息类型，然后分发给对应的Actor实例。
请仔细阅读下WorkerProcess的源码，它继承于AbstractUnixProcess。

### UnixClient
UnixStream Socket，自行了解。Proxy转发消息给本机Actor所使用的Client。

### Protocol
数据封包协议。

### ProxyCommand
消息命令对象，Actor2将不同类型的消息封装成格式化的命令，最终传给WorkerProcess。
你可以在ActorClient中了解一下方法和命令的对应关系，但这个不需要在业务层去更改。

### ProxyConfig
消息代理的配置项。

*actorList* 注册的actor列表。

*machineId* 机器码

*tempDir* 临时目录

*trigger* 错误触发处理接口 

### ProxyProcess
Actor->attachServer()会启动proxyNum个ProxyProcess。
用于在Actor实例和WorkerProcess做消息中转。
