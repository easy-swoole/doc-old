# SyncInvoker

## 场景

Swoole4.x后，提供了非常强大的协程能力，让我们可以更好的压榨服务器性能，提高并发。然而，目前PHP在swoole协程生态上，并不是很完善，比如没有协程版本的monogodb客户端，而为了避免在worker中调用了同步阻塞的Api，例如在Http回调中使用了同步的芒果客户端，导致worker退化为同步阻塞，导致没办法完全的发挥协程的优势，
EasySwoole 提供了一个同步程序协程调用转化驱动。

## 原理

启动自定义进程监听UnixSocket，然后worker端调用协程客户端发送命令到自定义进程并处理，然后吧处理结果返回给worker的协程客户端。

## 安装

```
composer require easyswoole/sync-invoker
```

## 使用

定义一个驱动工作实例（可以定义多个）

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

//注册一个对应的调用器

class MyInvoker extends SyncInvoker
{
    use Singleton;
}
```

EasySwoole 全局事件中的mainServerCreate 进行注册
```
 MyInvoker::getInstance(new MyInvokerDriver())->attachServer(ServerManager::getInstance()->getSwooleServer());
```

服务启动后，即可在任意位置调用
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

## 注意事项

- 尽量使用函数名调用方式，闭包方式调用会存在部分闭包函数序列化失败问题
- 传递参数，返回结果尽量用数组或者字符串传递，资源对象无法序列化