# ACTOR

Provide Actor Mode Support to Help Game Industry Development。EasySwoole's Actor uses custom process as storage carrier, cooperative process as minimum dispatching unit, cooperative Channel as mail box, while the communication between client and process is implemented by UnixSocket, and distributed Actor Client is implemented by TCP, which can be easily coped with under ultra-high concurrency.

## How Actor works

Generally speaking, there are two strategies for communicating in concurrent threads: sharing data and messaging. One of the biggest problems faced by concurrent programming using shared data is data condition competition. When two instances need to access the same data, in order to ensure data consistency, they usually need to lock the data. Actor model uses message passing mechanism to avoid data competition, without complicated lock operation, each instance only needs to pay attention to its own state and Handle incoming messages.

Actor is a fully object-oriented, lock-free, asynchronous, instance-isolated, distributed concurrent development model. Actor instances are isolated from each other. Actor instances have their own independent state. Actors can not directly access each other's state. They need to notify each other of the change of state through message delivery mechanism. Since the state of each instance is independent and no data is shared, there will be no data competition, thus avoiding the locking problem under concurrency.

For example, in a game room, there are five players, each player is a Player Actor, with its own attributes, such as character ID, nickname, current blood volume, attack power, etc. The game room itself is a Room Actor, and the room also has attributes, such as the current online player, the number of monsters in the current scene, monster blood volume, etc. Player Actor-A sends a command to attack a monster to RoomActor when Player A attacks a monster. RoomActor calculates the damage value of Player A to the monster and sends a message to all Player Actors in the room (Player A attacks Monster A, causing 175 damage, and Monster A has 1200 blood left). Similar to this process, each Player Actor can know the room. What's going on inside, but it won't cause the shared lock problem by accessing the attributes of Monster A at the same time

## Basic usage

Actor is not a built-in component and requires package introduction and basic configuration before it can be used

```php
composer require easyswoole/actor=2.x-dev
```

##### Create an Actor

Each object (player, room, even log service can also be used as an actor object) is managed by an actor. An object can have multiple instances (Clients) and can send messages to each other through mailboxes to process business.

```php
<?php

namespace App\Player;

use EasySwoole\Actor\AbstractActor;
use EasySwoole\Actor\ActorConfig;

/**
 * Player Actor
 * Class PlayerActor
 * @package App\Player
 */
class PlayerActor extends AbstractActor
{
    /**
     * Configure the current Actor
     * @param ActorConfig $actorConfig
     */
    public static function configure(ActorConfig $actorConfig)
    {
        $actorConfig->setActorName('PlayerActor');
        $actorConfig->setWorkerNum(3);
    }

    /**
     * When Actor first starts
     */
    protected function onStart()
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onStart\n";
    }

    /**
     * When Actor receives a message
     * @param $msg
     */
    protected function onMessage($msg)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onMessage\n";
    }

    /**
     * Actor is about to quit
     * @param $arg
     */
    protected function onExit($arg)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onExit\n";
    }

    /**
     * When an exception occurs to an actor
     * @param \Throwable $throwable
     */
    protected function onException(\Throwable $throwable)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onException\n";
    }

}
```

##### Register Actor Service

You can use setListenAddress and setListenPort to specify the port that the local machine listens on to, and other machines can send messages to the local actor through that port.

```php

public static function mainServerCreate(EventRegister $register) {

    // Register Actor Manager
    $server = ServerManager::getInstance()->getSwooleServer();
    Actor::getInstance()->register(PlayerActor::class);
    Actor::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)
        ->setListenAddress('0.0.0.0')->setListenPort('9900')->attachServer($server);
        
}
```

##### Actor instance management

Actor can be operated after the service is started. Client instances on the machine are managed without the need to pass $node parameters to the client. The default node is native and needs to be passed in when other machines are managed.

```php

    // Actors that manage native machines do not need to declare nodes
    $node = new ActorNode;
    $node->setIp('127.0.0.1');
    $node->setListenPort(9900);

    // Starting an Actor and getting an ActorId follow-up requires relying on ActorId
    $actorId = PlayerActor::client($node)->create(['time' => time()]);   // 00101000000000000000001
    // Send a message to an actor
    PlayerActor::client($node)->send($actorId, ['data' => 'data']);
    // Send messages to all Actors of this type
    PlayerActor::client($node)->sendAll(['data' => 'data']);
    // Exit an Actor
    PlayerActor::client($node)->exit($actorId, ['arg' => 'arg']);
    // Exit all Actors
    PlayerActor::client($node)->exitAll(['arg' => 'arg']);
    
```