# MongoDB

Currently, MongoDB does not provide a coroutine version of the PHP client, only a synchronous blocking version. In actual production, direct
It is not necessary to create native mongoDB clients for data interaction. If you want to convert a synchronous call to a coroutine call, you can use the sync-invoker component provided by Easyswoole.

## Composer install

```
composer require easyswoole/sync-invoker
```

## Example
Define the mongoDB driver
```
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

Define the mongoDB client
```

namespace App\Mongodb;


use EasySwoole\Component\Singleton;
use EasySwoole\SyncInvoker\SyncInvoker;

class MongoClient extends SyncInvoker
{
    use Singleton;
}
```

Registration of services in Easyswoole global event mainServerCreate
```
MongoClient::getInstance(new Driver())->attachServer(ServerManager::getInstance()->getSwooleServer());
```

## Use
The service can be used anywhere after it is started.
```
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

> See SyncInvoker chapter for more use and original analysis