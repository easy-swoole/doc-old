---
title: MongoDb 协程使用
meta:
  - name: description
    content: EasySwoole 提供了一个同步程序协程调用转化驱动
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|SyncInvoker MongoDb 协程| MongoDb 协程使用
---

# MongoDb

目前，MongoDB并没有提供协程版本的php客户端，只有同步阻塞版本。

::: tip 提示
EasySwoole 的协程版客户端已经在排期内。
:::

在实际生产中，直接 创建原生的mongoDB客户端来进行数据交互，也不是不可。

若希望将同步调用转为协程调用，可以用Easyswoole 提供的sync-invoker组件。

## 定义驱动

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

## 客户端
```php
namespace App\Mongodb;

use EasySwoole\Component\Singleton;
use EasySwoole\SyncInvoker\SyncInvoker;

class MongoClient extends SyncInvoker
{
    use Singleton;
}
```

## 服务注册

在Easyswoole全局事件mainServerCreate中进行服务注册

```php
MongoClient::getInstance(new Driver())->attachServer(ServerManager::getInstance()->getSwooleServer());
```

## 开始使用

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
