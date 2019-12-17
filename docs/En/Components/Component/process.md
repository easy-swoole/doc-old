---
title: Custom process
meta:
  - name: description
    content: This article focuses on how to add swoole's custom process to enable PHP multi-process processing 
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Custom process|swoole Custom process|swoole process|swoole Multiple processes|php Multiple processes
---


# Process

## Useage
Processing time-consuming tasks, such as looping through queue messages, clearing token data from redundant redis, and so on.

## Example

### Define a process class
```php
use EasySwoole\Component\Process\AbstractProcess;

class Process extends AbstractProcess
{

    protected function run($arg)
    {
        //The callback that is executed when the process starts
        var_dump($this->getProcessName()." run");
        var_dump($arg);
    }
    
    protected function onPipeReadable(\Swoole\Process $process)
    {
        /*
         * This callback is optional
         * Be sure to use the callback that is triggered when a primary process sends a message to a child process
         * $process->read() Read the message
         */
    }
    
    protected function onShutDown()
    {
        /*
         * This callback is optional
         * The callback is executed when the process exits
         */
    }
    
    protected function onException(\Throwable $throwable, ...$args)
    {
        /*
         * This callback is optional
         * This callback is executed when an exception occurs in the process
         */
    }
}
```


### Registration process

We register the process in the EasySwoole global ```mainServerCreate``` event
```php
use App\Process;
use EasySwoole\Component\Process\Config;


$processConfig = new Config();
$processConfig->setProcessName('testProcess');
/*
 * Parameters passed to the process
*/
$processConfig->setArg([
    'arg1'=>time()
]);
ServerManager::getInstance()->getSwooleServer()->addProcess((new Process($processConfig))->getProcess());
```

::: warning 
Note that a process model can be registered N times, that is, N processes of the same type can be created
:::

## Custom process warm restart
In the Swoole document, it is explicitly mentioned that custom processes cannot reload like workers. But there's a way to do that, we just need to know the pid of a process, send it the SIGTERM command,
The process will push itself out. And Swoole Manager will pull up the feature of the process again, all the way around to allow a warm restart of the process.

### The sample code
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
> Define a controller that sends signals, and of course, this logic can be used in other ways


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

> Define a task class and note that the run method is static

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

> Define a process class whose run method statically calls the static method of the task class.

### The principle of interpretation

The main problem is that the custom process class needs to call a task class。A lot of people might be confused。In fact, the principle is that.

When I need to register a process, I need to new a custom process class, so the custom process code is required in the main process, so no matter how I change it later.

The manager process reclones the process from the previous code. This is a clever use of the new class. Since PHP is an interpreted language, the run method is not executed immediately。
Only when I do have a process clone, after process start, will I actually execute run().

However, the contents in my process class run method will actually load the code of worker class when the Work::run () is executed. Therefore, every time I kill this custom process, the process will
When cloned by the main process, the Work class code is reloaded.

### Pid management

In many ways, you can do it yourself in swoole table, redis, files, etc.
