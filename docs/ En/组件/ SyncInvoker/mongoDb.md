---
title: MongoDb coroutine use
meta:
  - name: description
    content: EasySwoole provides a synchronization program coroutine call conversion driver
  - name: keywords
    content: easyswoole|SyncInvoker MongoDb coroutine | MongoDb coroutine use
---

# MongoDb

Currently, MongoDB does not provide a coroutine version of the php client, only the sync blocking version.

::: tip prompt
EasySwoole's coroutine client is already in the flight.
:::

In actual production, it is not impossible to directly create a native mongoDB client for data interaction.

If you want to convert a synchronous call to a coroutine call, you can use the sync-invoker component provided by Easyswoole.

## Define driver

```php
namespace App\Mongodb;

use EasySwoole\EasySwoole\Trigger;
use EasySwoole\SyncInvoker\AbstractInvoker;
use MongoDB\Client;

class Driver extends AbstractInvoker
{
    private $db;

    function getDb():Client
    {
        if($this->db == null){
            $mongoUrl = "mongodb://127.0.0.1:27017";
            $this->db = new Client($mongoUrl);
        }
        return $this->db;
    }

    protected function onException(\Throwable $throwable)
    {
        Trigger::getInstance()->throwable($throwable);
        return null;
    }
}
```

## Client
```php
namespace App\Mongodb;

use EasySwoole\Component\Singleton;
use EasySwoole\SyncInvoker\SyncInvoker;

class MongoClient extends SyncInvoker
{
    use Singleton;
}
```

## Service Registration

Service registration in the Easyswoole global event mainServerCreate

```php
MongoClient::getInstance(new Driver())->attachServer(ServerManager::getInstance()->getSwooleServer());
```

## Start using

```php
$ret = MongoClient::getInstance()->client()->callback(function (Driver $driver){
    $ret = $driver->getDb()->user->list->insertOne([
        'name' =>Random::character(8),
        'sex'=>'man',
    ]);
    if(!$ret){
        return false;
    }
    return $ret->getInsertedId();
});

$ret = MongoClient::getInstance()->client()->callback(function (Driver $driver){
    $ret = [];
    $collections = $driver->getDb()->user->listCollections();
    foreach ($collections as $collection) {
        $ret[] = (array)$collection;
    }
    return $ret;
});
```
