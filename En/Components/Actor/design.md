<head>
     <title>EasySwoole actor design|swoole actor design|php actor design</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole actor design|swoole actor design|php actor design"/>
     <meta name="description" content="EasySwoole actor design|swoole actor design|php actor design"/>
</head>
---<head>---

## Interpretation of Architecture Actor2

### Actor
ActorManager should be more precise. It is used to register Actors, start Proxy and Actor Worker processes.
When you define several kinds of Actors in your business logic, such as RoomActor, PlayerActor, we need to register them when Woole Server starts.
Specifically, the following code is added to the EasySwooleEvent.mainServerCreate method.
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
ListenAddress and ListenPort are the listening address ports of Proxy process and MachineId is the machine code of ActorWorker process.
MachineId corresponds to IP: PORT.
AttachServer will open the corresponding number of Proxy processes, as well as the ActorWorker process of the front register.

#### Working principle
Proxy processes do message transfer and Worker processes do message distribution and push. Let's take a concrete example:

Player P requests to enter room R in the game, which is abstracted as an actor model. Player Actor needs to send a request to RoomActor to join.
Then you need to write like this:
```
RoomActor::client($node)->send($roomActorId, [
	'user_actor_id' => $userActorId,
	'data'	=> 'Other parameters entering the room'
])
```
Among them, $roomActorId and $userActorId are from xxActor:: client ()-> create ().
The above code means to push a message to the RoomActor instance of $roomActorId that the UserActor instance of the $userActorId player wants to join the room.
The parameter $node is used to address Proxy, which is determined by the Worker. MachineId of the target Actor instance, in which MachineId WorkerProcess $roomActorId was created.
Find IP: PORT through the machine code in $roomActorId and generate $node.
When send, a protocol TcpClient is created to send the message to Proxy, and then Proxy forwards the message to the native Worker Process, which receives the message and pushes it to a specific Actor instance.
This completes the request communication from Player Actor to RoomActor. After receiving the request message and processing it, RoomActor sends back the processing result to Player Actor, using the same communication process.
If it's a stand-alone deployment, you can ignore the $node parameter because all communications are done locally.
If there are multiple computers, you need to realize how to distribute and locate the Actor according to your business.

#### Main attributes

*machineId* Machine code

*proxyNum* Start several Proxy Processes

*listenPort* Listening port

*listenAddress* Listening ip

### AbstractActor
Actor instance base class, all actors used in business will inherit from AbstractActor. For example, in a room in a game scene, you can:
```
class RoomActor extends AbstractActor
```
#### Working principle
Each Actor instance maintains a separate data and state. When an Actor instance passes through client()->create(), it opens a coroutine loop, receives mailbox pop messages, and then processes business logic and updates its own data and state. The specific implementation is the _run() method.
#### Static method configure
To configure ActorCofig, you just need to rewrite the method in a specific Actor (such as RoomActor).
For the specific properties of ActorConfig, see the ActorConfig section below.

#### Several Virtual Methods
The following virtual methods need to be implemented in the Actor subclass. These methods are used in _run() to complete the operation cycle of the Actor.

*onStart()* is executed prior to the start of the coordinator, where you can perform some actions of Actor initialization, such as obtaining the basic properties of the room.

*onMessage()* is executed when a message is received, and the life cycle of an actor instance is basically receiving - processing - sending messages, where you need to parse the messages.

*onExit()* executes when an exit command is received. For example, you want to notify some associated other Actors when an Actor instance exits, which can be dealt with here.

#### Others

*Exit()* is used to exit the operation by the instance itself, and an exit command is issued to the instance itself.

*tick() and after()* timers are used for timed tasks of Actor instances, such as timed tick brushing in game rooms, and automatic kick-out after how long it takes to go offline.

*Static client()* is used to create an ActorClient to communicate with the corresponding Actor (instance).

### ActorClient
Actor communication client, call xxActor::client() to create an ActorClient for Actor communication.
Actor's communication process has been discussed above, which is essentially TcpClient -> Proxy process -> UnixClient -> Actor Worker process -> xxActor.
See what it implements:

*Create()* Create an xxActor instance and return to actorId, which you can then use to communicate with.

*send()* Specifies actorId to send a message to it.

*Exit()* notifies xxActor to exit an instance of the specified actorId.

*sendAll()* sends messages to all xxActor instances.

*exitAll()* exits all xxActor instances.

*Existen()* Is there an xxActor instance that specifies actorId currently?

*Status()* Distribution status of xxActor under current ActorWorker.

### ActorConfig
Specific Actor configurations, such as RoomActor and Player Actor, have their own configurations.

*ActorName* is usually a class name. Note that this is not duplicated in the same service.

*ActorClass* writes the corresponding class name in Actor->register().

*WorkerNum* opens several processes for Actor, and Actor->attachServer() will start WorkerNum Worker processes for the corresponding Actor based on this parameter.

### ActorNode
As mentioned above, xxActor:: client ($node), this $node is an ActorNode object with properties of IP and Port, which is used to address Proxy, let's not say much.

### WorkerConfig
The WorkerProcess configuration item is used when the WorkerProcess starts.

*workerId* worker process Id, used to generate actorId when creating Actor

*MachineineId* worker process machine code, used to generate actorId when creating Actor

*trigger* Exception Trigger Processing Interface

### WorkerProcess

Actor's emphasis here is that each registered Actor (class) starts a corresponding number of WorkerProcesses.
For example, if you register RoomActor, PlayerActor and workerNum are all configured with 3, then the system will start the Worker process of three RoomActors and the Worker process of three Player Actors.
Each WorkerProcess maintains an ActorList, which is managed by its ActorList and distributed among different Worker processes through the actor of client()->create().
WorkerProcess receives client (this client is UnixClient when Proxy forwards) messages through a collaborative process, distinguishes message types, and then distributes them to the corresponding Actor instance.
Read carefully the source code for WorkerProcess, which inherits from AbstractUnixProcess.

### UnixClient
UnixStream Socket, self-understanding. Proxy forwards messages to the Client used by the native actor.

### Protocol
Data Packet Protocol.

### ProxyCommand
Message command object, Actor2 encapsulates different types of messages into formatted commands, which are eventually passed to WorkerProcess.
You can see how methods and commands correspond in ActorClient, but this does not need to be changed at the business level.

### ProxyConfig
Configuration items for message brokers.

*Actor List* Registered Actor List.

*machineId* machine code

*TempDir* Temporary Directory

*trigger * error trigger processing interface

### ProxyProcess
Actor->attachServer() starts the proxyNum ProxyProcess.
Used for message transit in Actor instances and WorkerProcess.
