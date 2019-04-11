# 进程

## 用途
处理耗时任务，比如处理死循环队列消费，清除多余redis中的token数据等等。


## 如何使用

在EasySwooleEvent注册进程。

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/28
 * Time: 下午6:33
 */

namespace EasySwoole\EasySwoole;


use App\Process\ProcessOne;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
        /**
         * 除了进程名，其余参数非必须
         */
        $myProcess = new ProcessOne("processName",time(),false,2,true);
        ServerManager::getInstance()->getSwooleServer()->addProcess($myProcess->getProcess());
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```

Process类：

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2019-03-05
 * Time: 20:08
 */

namespace App\Process;


use EasySwoole\Component\Process\AbstractProcess;
use EasySwoole\EasySwoole\Logger;

class ProcessOne extends AbstractProcess
{

    public function run($arg)
    {
        // TODO: Implement run() method.
        Logger::getInstance()->console($this->getProcessName()." start");
        while (1){
            \co::sleep(5);
            Logger::getInstance()->console($this->getProcessName()." run");
        }
    }

    public function onShutDown()
    {
        // TODO: Implement onShutDown() method.
    }

    public function onReceive(string $str)
    {
        // TODO: Implement onReceive() method.
    }
}
```

## 核心对象方法

核心类：AbstractProcess。

构造函数，创建子进程

* string $processName           设置进程名字
* mixed  $arg                   设置参数
* bool   $redirectStdinStdout   重定向子进程的标准输入和输出。启用此选项后，在子进程内输出内容将不是打印屏幕，而是写入到主进程管道。读取键盘输入将变为从管道中读取数据。默认为阻塞读取。
* mixed  $pipeType              管道类型，启用$redirect_stdin_stdout后，此选项将忽略用户参数，强制为1。如果子进程内没有进程间通信，可以设置为 0
* bool   $enableCoroutine       默认为false，在callback function中启用协程，开启后可以直接在子进程的函数中使用协程

final function __construct(string $processName,$arg = null,$redirectStdinStdout = false,$pipeType = 2,$enableCoroutine = false)

设置最大等待时间

* int    $maxExitWaitTime       设置最大等待时间
public function setMaxExitWaitTime(int $maxExitWaitTime)

获取当前进程

public function getProcess():Process

在进程内添加定时器，返回定时器序号

* int        $ms                设置定时器时间
* callable   $call              设置回调函数

public function addTick($ms,callable $call):?int

清除进程内的定时器

* int        $timerId           定时器序号

public function clearTick(int $timerId):?int

在进程内添加延时定时器，返回定时器序号

* int        $ms                设置延时时间
* callable   $call              设置回调函数

public function delay($ms,callable $call):?int

获取子进程pid

public function getPid():?int

获取子进程pid

* Process    $process           进程类

执行进程任务

function __start(Process $process)

获取参数

public function getArg()

获取进程名称

public function getProcessName()

异常

protected function onException(\Throwable $throwable)

进程任务

* mixed   $arg                参数

public abstract function run($arg)

子进程关闭处理函数

public abstract function onShutDown()

进程通信

* string   $str                通信数据

public abstract function onReceive(string $str)


