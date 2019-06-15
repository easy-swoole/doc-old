# 进程

## 用途
处理耗时任务，比如处理死循环队列消费，清除多余redis中的token数据等等。


## 如何使用

在EasySwooleEvent注册进程。

```php
<?php

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

        /**
         * 除了进程名，其余参数非必须
         */

        $processConfig = new \EasySwoole\Component\Process\Config();
        $processConfig->setArg(['a'=>1,'b'=>2]);//额外参数
        $processConfig->setProcessName('processName');//进程名称
        $processConfig->setEnableCoroutine(true);//是否开启协程
   
        //实例化进程写法1
        $myProcess = new ProcessOne($processConfig);
        //实例化进程写法2
//        $myProcess = new ProcessOne('processName',['a'=>1,'b'=>2]/*,$redirectStdinStdout,$pipeType,$enableCoroutine*/);
        ServerManager::getInstance()->getSwooleServer()->addProcess($myProcess->getProcess());
        // TODO: Implement mainServerCreate() method.
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

### 核心类：EasySwoole\Component\Process\AbstractProcess。

#### construct

* string $processName           设置进程名字
* mixed  $arg                   设置参数
* bool   $redirectStdinStdout   重定向子进程的标准输入和输出。启用此选项后，在子进程内输出内容将不是打印屏幕，而是写入到主进程管道。读取键盘输入将变为从管道中读取数据。默认为阻塞读取。
* mixed  $pipeType              管道类型，PIPE_TYPE_NONE无 PIPE_TYPE_SOCK_STREAM流 PIPE_TYPE_SOCK_DGRAM数据报
* bool   $enableCoroutine       默认为false，在callback function中启用协程，开启后可以直接在子进程的函数中使用协程

function __construct(...$args)


#### getProcess
获取当前swoole进程实例,用于启动自定义进程
#### addTick
增加个定时任务
#### clearTick
清除定时任务
#### delay
增加个延时任务
#### getPid
获取进程id
#### __start
启动进程
#### getArg
获取进程的自定义参数
#### getProcessName
获取进程名


