---
title: ACTOR component
meta:
  - name: description
    content: EasySwoole provides Actor mode support for game industry development
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|ACTOR component
---

# ACTOR

Provides Actor mode support to help the game industry develop. EasySwoole's Actor uses a custom process as the storage carrier, with the coroutine as the minimum scheduling unit, the coroutine Channel as the mail box, and the communication between the client and the process, using UnixSocket, and implementing the distributed ActorClient via TCP. It can be easily handled with super high concurrency.

## How Actors work

There are generally two strategies for communicating in concurrent threads: sharing data and messaging. One of the biggest problems faced by concurrent programming using shared data is data condition competition. When two instances need to access the same data, in order to ensure data consistency, it is usually necessary to lock the data, and the Actor model uses the message passing mechanism. To avoid data competition, no complicated locking operations are required, and each instance only needs to pay attention to its own state and process the received messages.

Actors are fully object-oriented, lock-free, asynchronous, instance-isolated, distributed, concurrent development models. Actor instances are isolated from each other. Actor instances have their own independent state. Each Actor cannot directly access the other party's state. You need to notify the other party to change the state through the message delivery mechanism. Since the state of each instance is independent and no data is shared, data competition does not occur, thus avoiding the locking problem under concurrent.

As an example of a game scene, in a game room, there are 5 players, each player is a PlayerActor, with its own attributes, such as character ID, nickname, current blood volume, attack power, etc. The game room itself is also a RoomActor, the room also has properties, such as the current online player, the number of monsters in the current scene, the amount of monster blood. At this time player A attacks a monster, PlayerActor-A sends an attack monster command to the RoomActor. The RoomActor calculates the damage value of player A to the monster and sends a message to all PlayerActors in the room. Monster A, causing 175 damage, monster A remaining 1200 points), similar to this process, each PlayerActor can know what is happening in the room, but will not cause simultaneous access to the properties of Monster A, resulting in sharing Lock problem

## Basic usage

Actors are not built-in components. You need to import the package first and configure it to be able to use it.

```php
composer require easyswoole/actor=2.x-dev
```

##### Build an Actor

Each type of object (player, room, and even log service can also be used as an Actor object) to create an Actor to manage, an object can have multiple instances (Client) and can send messages to each other through the mailbox to handle the business.

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
     * When the Actor first starts
     */
    protected function onStart()
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onStart\n";
    }

    /**
     * When the Actor receives the message
     * @param $msg
     */
    protected function onMessage($msg)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onMessage\n";
    }

    /**
     * Actor is about to quit before
     * @param $arg
     */
    protected function onExit($arg)
    {
        $actorId = $this->actorId();
        echo "Player Actor {$actorId} onExit\n";
    }

    /**
     * When an Actor is abnormal
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

You can use setListenAddress and setListenPort to specify the port that the local machine listens to. Other machines can send messages to the Actor of this machine through this port.

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

After the service is started, the Actor can be operated. If the Client instance of the machine is managed, the client does not need to pass the $node parameter to the client. The default node is the local machine, and the other machines need to be imported.

```php

    // Actors managing this machine do not need to declare nodes
    $node = new ActorNode;
    $node->setIp('127.0.0.1');
    $node->setListenPort(9900);

    // Start an Actor and get the ActorId. Subsequent operations need to rely on the ActorId.
    $actorId = PlayerActor::client($node)->create(['time' => time()]);   // 00101000000000000000001
    // Send a message to an actor
    PlayerActor::client($node)->send($actorId, ['data' => 'data']);
    // Send a message to all Actors of this type
    PlayerActor::client($node)->sendAll(['data' => 'data']);
    // Exit an Actor
    PlayerActor::client($node)->exit($actorId, ['arg' => 'arg']);
    // Exit all Actors
    PlayerActor::client($node)->exitAll(['arg' => 'arg']);
    
```
