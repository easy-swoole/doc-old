---
title: SyncInvoker
meta:
  - name: description
    content: EasySwoole provides a synchronization program coroutine call conversion driver
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|SyncInvoker
---
# SyncInvoker

## Scenes

After Swoole 4.x, it provides a very powerful coroutine capability, which allows us to better squeeze server performance and improve concurrency. However, currently PHP is not perfect in the swoole coroutine ecosystem, such as the monogodb client without the coroutine version, and in order to avoid calling the synchronous blocking API in the worker, for example, using the synchronized mango client in the Http callback. End, causing the worker to degenerate into a synchronous blocking, resulting in no way to fully exploit the advantages of the coroutine.
EasySwoole provides a synchronous program coroutine call conversion driver.

## Principle

Start the custom process to listen to the UnixSocket, and then the worker side calls the coroutine client to send the command to the custom process and process it, and then the processing result is returned to the worker's coroutine client.

## Installation

```
composer require easyswoole/sync-invoker
```

## Use

Define a driver work instance (you can define multiple)

```php
namespace App;
use EasySwoole\SyncInvoker\AbstractInvoker;
use EasySwoole\SyncInvoker\SyncInvoker;
use EasySwoole\Component\Singleton;

class MyInvokerDriver extends AbstractInvoker{

    private $stdclass;

    function __construct()
    {
        $this->stdclass = new \stdClass();
        parent::__construct();
    }

    public function test($a,$b)
    {
        return $a+$b;
    }

    public function a()
    {
        return 'this is a';
    }

    public function getStdClass()
    {
        return $this->stdclass;
    }
}

//Register a corresponding caller

class MyInvoker extends SyncInvoker
{
    use Singleton;
}
```

mainServerCreate in the EasySwoole global event is registered
```
 MyInvoker::getInstance(new MyInvokerDriver())->attachServer(ServerManager::getInstance()->getSwooleServer());
```

Once the service is started, it can be called from anywhere
```php
$ret = MyInvoker::getInstance()->client()->test(1,2);
var_dump($ret);
var_dump(MyInvoker::getInstance()->client()->a());
var_dump(MyInvoker::getInstance()->client()->a(1));
var_dump(MyInvoker::getInstance()->client()->fuck());
$ret = MyInvoker::getInstance()->client()->callback(function (MyInvokerDriver $driver){
    $std = $driver->getStdClass();
    if(isset($std->time)){
        return $std->time;
    }else{
        $std->time = time();
        return 'new set time';
    }
});
```

## Precautions

- Try to use the function name calling method, the closure mode call will have some closure function serialization failure problem
- Pass parameters, return results as far as possible with arrays or strings, resource objects cannot be serialized
