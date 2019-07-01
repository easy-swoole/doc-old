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
RoomActor::client($node)->send($roomActorId, [
	'user_actor_id' => $userActorId,
	'data'	=> '其他进入房间的参数'
])
```
其中$roomActorId和$userActorId是你事先xxActor::client()->create()出来的。
上面那段代码的意思就是往$roomActorId的RoomActor实例推送了一条$userActorId玩家的UserActor实例要加入房间的消息。
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
