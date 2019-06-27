# SyncInvoker

## Scene

Swoole 4.x provides a very powerful coroutine capability, allowing us to better squeeze server performance and improve concurrency. However, at present, PHP is not perfect in the swoole coroutine ecology, such as the monogodb client without the coroutine version, but in order to avoid calling the synchronous blocking API in the worker, such as using the synchronous mango client in the Http callback, which leads to the degeneration of the worker into synchronous blocking, resulting in the incomplete play of the coroutine. Cheng's advantage, EasySwoole provides a synchronous program call conversion driver.

## Principle

Start the custom process to listen for UnixSocket, and then the worker calls the coroutine client to send commands to the custom process and process them, and then return the processing results to the worker's coroutine client.

## Install

```
composer require easyswoole/sync-invoker
```

## Use

Define a driving work instance (multiple can be defined)

```
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

Registration of mainServerCreate in EasySwoole Global Event

```
 MyInvoker::getInstance(new MyInvokerDriver())->attachServer(ServerManager::getInstance()->getSwooleServer());
```

Once the service is started, it can be invoked anywhere.

```
$ret = MySyncInvoker::getInstance()->client()->test(1,2);
var_dump($ret);
var_dump(MySyncInvoker::getInstance()->client()->a());
var_dump(MySyncInvoker::getInstance()->client()->a(1));
var_dump(MySyncInvoker::getInstance()->client()->fuck());
$ret = MySyncInvoker::getInstance()->client()->callback(function (MySync $mySync){
    $std = $mySync->getStdClass();
    if(isset($std->time)){
        return $std->time;
    }else{
        $std->time = time();
        return 'new set time';
    }
});
```

## Matters needing attention

- Use function name invocation as much as possible. Closure method invocation will result in partial closure function serialization failure.
- Pass parameters, return results as far as possible with arrays or strings, resource objects can not be serialized