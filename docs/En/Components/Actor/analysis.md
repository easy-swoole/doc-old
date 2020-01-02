---
title: Interpretation of ACTOR architecture
meta:
  - name: description
    content: EasySwoole provides Actor mode support for game industry development
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|ACTOR components|Architecture interpretation
---

## Actor2 architecture interpretation

### Actor
It should be called ActorManager more precisely, it is used to register Actor, start Proxy and ActorWorker process.
When you define several Actors in the business logic, such as RoomActor, PlayerActor, we need to register them when SwooleServer starts.
Specifically, add the following code in the EasySwooleEvent.mainServerCreate method.
```php
$actor = Actor::getInstance();
$actor->register(RoomActor::class);
$actor->register(PlayerActor::class);
$actorConf = Config::getInstance()->getConf('ACTOR_SERVER');
$actor->setMachineId($actorConf['MACHINE_ID'])
    ->setListenAddress($actorConf['LISTEN_ADDRESS'])
    ->setListenPort($actorConf['PORT'])
    ->attachServer($server);
```
The ListenAddress and the ListenPort are the listening address ports of the Proxy process, and the MachineId is the machine code of the ActorWorker process.
MachineId corresponds to IP:PORT.
attachServer will open the corresponding number of Proxy processes, as well as the ActorWorker process registered in front.

#### working principle
The Proxy process does the message relay, and the Worker process does the message distribution push. Let's look at a concrete example:

In the game, the player P requests to enter the room R, abstracting into the Actor model is the PlayerActor needs to send a request to the RoomActor to join.
Then this time you need to write like this:
```php
RoomActor::client($node)->send($roomActorId, [
	'user_actor_id' => $userActorId,
	'data'	=> 'Other parameters to enter the room'
])
```
Where $roomActorId and $userActorId are your pre-xxActor::client()->create().
The above code means that a $userActorId user's UserActor instance is pushed to the room in the RoomActor instance of $roomActorId.
The parameter $node is used to address the Proxy, which is determined by the Worker.MachineId of the target Actor instance, which in this case is the MachineProcess for which MachineId is created.
Find the IP:PORT via the machine code in $roomActorId and generate $node.
When sending, a coroutine TcpClient is created, and the message is sent to the Proxy. Then the Proxy forwards the message (UnixClient) to the native WorkerProcess, and the WorkerProcess receives the message and pushes it to the specific Actor instance.
This completes the request communication from the PlayerActor to the RoomActor. After receiving the request message and processing it, the RoomActor sends back the processing result to the PlayerActor, using the same communication flow.
If it is a stand-alone deployment, you can ignore the $node parameter because all communication is done locally.
For multi-machine, you need to implement how to distribute and locate Actors according to your business.

#### Main attribute

`machineId` machine code

`proxyNum` starts several ProxyProcess

`listenPort` listening port

`listenAddress` listen ip

### AbstractActor
The base class of the Actor instance, all the Actors used in the business will inherit from AbstractActor. For example, in a room in a game scene, you can:
```php
class RoomActor extends AbstractActor
```
#### working principle
Each Actor instance maintains a separate data and state. When an Actor instance passes client()->create(), it will start the coroutine loop, receive the message of mailbox pop, and then process the business logic and update its own data. And status. The concrete implementation is the __run() method.

#### Static method configure
To configure ActorCofig, you only need to override this method in a specific Actor (such as RoomActor).
For the specific properties of ActorConfig, see the ActorConfig section below.

#### Several virtual methods
The following virtual methods need to be implemented in the Actor subclass. These methods are used in __run() to complete the Actor's run cycle.

`onStart()` is executed before the coroutine is started. You can perform some operations on the Actor initialization, such as getting the basic properties of the room.

`onMessage()` When executed, the lifetime of an Actor instance is basically in the message-handling-message, where you need to parse the message.

`onExit()` is executed when an exit command is received. For example, if you want to quit an Actor instance, you can also notify some related Actors at the same time, which can be handled here.

#### Other
`exit()` is used to exit the operation itself, and will send an exit command to itself.

`tick(), after()` Two timers, used for timed tasks of the Actor instance, such as the timing of the game room (tick); how long after the line is automatically kicked (after).

`static client()` is used to create an ActorClient to communicate with the corresponding Actor.

### ActorClient
The Actor communication client calls xxActor::client() to create an ActorClient for Actor communication.
The above has already talked about the Actor communication process, the essence is TcpClient->Proxy process->UnixClient->ActorWorker process->xxActor.
See what methods it implements:

`create()` creates a xxActor instance and returns the actorId, which you can then use to communicate with this instance.

`send()` specifies the actorId to send a message to.

`exit()` tells xxActor to exit the instance of the specified actorId.

`sendAll()` sends a message to all xxActor instances.

`exitAll()` exits all xxActor instances.

`exist()` Whether there is currently a xxActor instance of the specified actorId.

`status()` The current state of the xxActor under ActorWorker.

### ActorConfig
Configuration items for specific Actors, such as RoomActor and PlayerActor, have their own configuration.

`actorName` generally uses the class name. Note that this cannot be repeated in the same service.

`actorClass` will write the corresponding class name in Actor->register().

`workerNum` starts several processes for the Actor. Actor->attachServer() will start the WorkerNum Worker process for the corresponding Actor according to this parameter.

### ActorNode
As mentioned above, xxActor::client($node), this $node is the ActorNode object, and the attributes are Ip and Port, which are used to address the Proxy, so I won't say much.

### WorkerConfig
WorkerProcess configuration item, used when WorkerProcess starts.

`workerId` worker process Id, used to generate actorId when creating Actor

`machineId` worker process machine code, used to generate actorId when creating Actor

`trigger` exception trigger processing interface

### WorkerProcess
The focus of the Actor is here, and each registered Actor (class) will launch the corresponding number of WorkerProcess.
For example, if you register RoomActor, PlayerActor, and WorkerNum are configured with 3, then the system will launch 3 RoomActor Worker processes and 3 PlayerActor Worker processes.
Each WorkerProcess maintains an ActorList, and your Actors via client()->create() will be distributed among different Worker processes and managed by its ActorList.
WorkerProcess receives the client (this client is the UnixClient when the proxy is forwarding) through the coroutine, distinguishes the message type, and then distributes it to the corresponding Actor instance.
Please read the source code of WorkerProcess carefully, which inherits from AbstractUnixProcess.

### UnixClient
UnixStream Socket, understand it yourself. The Proxy forwards the message to the Client used by the native Actor.

### Protocol
Data packet protocol.

### ProxyCommand
The message command object, Actor2 encapsulates different types of messages into formatted commands, which are ultimately passed to WorkerProcess.
You can find out the correspondence between methods and commands in ActorClient, but this does not need to be changed at the business layer.

### ProxyConfig
The configuration item of the message broker.

`actorList` Registered actor list.

`machineId` machine code

`tempDir` temporary directory

`trigger` error trigger processing interface

### ProxyProcess
Actor->attachServer() will start proxyNum ProxyProcess.
Used to make message relays in Actor instances and WorkerProcess.
