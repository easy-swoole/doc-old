# MongoDB

目前，MongoDB并没有提供协程版本的php客户端，只有同步阻塞版本。在实际生产中，直接
创建原生的mongoDB客户端来进行数据交互，也不是不可。若希望将同步调用转为协程调用，可以用Easyswoole 提供的sync-invoker组件。

## composer 安装

```
composer require easyswoole/sync-invoker
```

## 实现例子
定义mongoDB驱动
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

定义mongoDB客户端
```

namespace App\Mongodb;


use EasySwoole\Component\Singleton;
use EasySwoole\SyncInvoker\SyncInvoker;

class MongoClient extends SyncInvoker
{
    use Singleton;
}
```

在Easyswoole全局事件mainServerCreate中进行服务注册
```
MongoClient::getInstance(new Driver())->attachServer(ServerManager::getInstance()->getSwooleServer());
```

## 使用
服务启动后即可在任意位置使用
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

> 更多使用和原理解析，请看SyncInvoker章节