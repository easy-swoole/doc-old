---
title: 自定义进程
meta:
  - name: description
    content: 本文主要讲述如何添加swoole的自定义进程，从而实现php多进程任务处理 
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|EasySwoole自定义进程|swoole自定义进程|swoole进程|swoole多进程|php多进程
---


# 进程

## 用途
处理耗时任务，比如循环处理队列消息，清除多余redis中的token数据等等。

## 例子

### 定义一个进程类
```php
use EasySwoole\Component\Process\AbstractProcess;

class Process extends AbstractProcess
{

    protected function run($arg)
    {
        //当进程启动后，会执行的回调
        var_dump($this->getProcessName()." run");
        var_dump($arg);
    }
    
    protected function onPipeReadable(\Swoole\Process $process)
    {
        /*
         * 该回调可选
         * 当有主进程对子进程发送消息的时候，会触发的回调，触发后，务必使用
         * $process->read()来读取消息
         */
    }
    
    protected function onShutDown()
    {
        /*
         * 该回调可选
         * 当该进程退出的时候，会执行该回调
         */
    }
    
    protected function onException(\Throwable $throwable, ...$args)
    {
        /*
         * 该回调可选
         * 当该进程出现异常的时候，会执行该回调
         */
    }
}
```


### 注册进程

我们在EasySwoole全局的 `mainServerCreate` 事件中进行进程注册
```php
use App\Process;
use EasySwoole\Component\Process\Config;


$processConfig = new Config();
$processConfig->setProcessName('testProcess');
/*
 * 传递给进程的参数
*/
$processConfig->setArg([
    'arg1'=>time()
]);
ServerManager::getInstance()->getSwooleServer()->addProcess((new Process($processConfig))->getProcess());
```


::: warning 
注意，一个进程模型可以被注册N次，也就是创建N个相同类型的进程
:::

## 自定义进程热重启
在Swoole 文档中，明确提及自定义进程无法像worker一样reload 。但想实现，终归有办法的，我们只要知道某个进程的pid，给他发送SIGTERM命令，
这个进程自己就会推出。而再利用Swoole Manager会重新拉起进程的这个特性，绕一圈实现进程的热重启。

### 实例代码
```
namespace App\HttpController;


use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller
{

    function index()
    {
        $pid = $this->request()->getRequestParam('pid');
        \Swoole\Process::kill($pid,SIGTERM);
        $this->writeJson(200,null,'send reboot signal');
    }
}
```
> 定义一个控制器，用来发送信号，当然，这个逻辑可有其他方式


```
namespace App\ProcessReload;


use EasySwoole\Component\Timer;
use EasySwoole\EasySwoole\Logger;

class Work
{
    static function run()
    {
        Timer::getInstance()->loop(3000,function (){
            $pid = getmypid();
            Logger::getInstance()->info("asassdaasd");
        });
    }
}
```

> 定义一个任务类，注意，run方法为静态

```
namespace App\ProcessReload;


use EasySwoole\Component\Process\AbstractProcess;
use EasySwoole\EasySwoole\Logger;

class Process extends AbstractProcess
{

    protected function run($arg)
    {
        $pid = getmypid();
        Logger::getInstance()->info("process for pid {$pid} start");
        Work::run();
    }

    function onShutDown()
    {
        $pid = getmypid();
        Logger::getInstance()->info("process for pid {$pid} shutdown");
        parent::onShutDown();
    }
}
```

> 定义一个进程类，进程类的run方法静态调用任务类的静态方法即可。

### 原理讲解

这里面主要的问题，在于自定义进程类还需要再去调用一个任务类。很多人可能不解。实际上的原理是因为，
我要注册一个进程的时候，我需要new一个自定义进程类，因此，自定义进程的代码就在主进程中被require进去，因此以后续无论如何再怎么修改，
manager进程重新克隆出来的进程还是之前的代码。而这里面就巧妙的利用了、当我new这个类的时候，因为php是解释性语言，run方法并未立即被执行。
只有当我真的发生进程克隆的时候，也就是process start后，才会真正的去执行run()这个方法，
而我进程类run方法里面的内容，当执行到Work::run（）的时候，才会真正的去加载worker类的代码，因此我每次杀掉这个自定义进程的时候，进程
重新被主进程克隆出来的时候，都会重新去加载Work类的代码。

### Pid管理

很多方式，可以自己用swoole table或者是redis,文件等多种方式实现。
