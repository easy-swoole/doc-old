# Process

## Use
Handle time-consuming tasks, such as processing infinite loop queue consumption, clearing token data in redundant redis, and so on.


## how to use

Register the process in EasySwooleEvent.

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/28
 * Time: 6:33 PM
 */

Namespace EasySwoole\EasySwoole;


Use App\Process\ProcessOne;
Use EasySwoole\EasySwoole\Swoole\EventRegister;
Use EasySwoole\EasySwoole\AbstractInterface\Event;
Use EasySwoole\Http\Request;
Use EasySwoole\Http\Response;

Class EasySwooleEvent implements Event
{

    Public static function initialize()
    {
        // TODO: Implement initialize() method.
        Date_default_timezone_set('Asia/Shanghai');
    }

    Public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
        /**
         * Except for the process name, the remaining parameters are not required
         */
        $myProcess = new ProcessOne("processName",time(),false,2,true);
        ServerManager::getInstance()->getSwooleServer()->addProcess($myProcess->getProcess());
    }

    Public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        Return true;
    }

    Public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```

Process class:

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2019-03-05
 * Time: 20:08
 */

Namespace App\Process;


Use EasySwoole\Component\Process\AbstractProcess;
Use EasySwoole\EasySwoole\Logger;

Class ProcessOne extends AbstractProcess
{

    Public function run($arg)
    {
        // TODO: Implement run() method.
        Logger::getInstance()->console($this->getProcessName()." start");
        While (1){
            \co::sleep(5);
            Logger::getInstance()->console($this->getProcessName()." run");
        }
    }

    Public function onShutDown()
    {
        // TODO: Implement onShutDown() method.
    }

    Public function onReceive(string $str)
    {
        // TODO: Implement onReceive() method.
    }
}
```

## Core Object Method

Core class: EasySwoole\Component\Process\AbstractProcess.

Constructor to create a child process

* string $processName set the process name
* mixed $arg setting parameters
* bool $redirectStdinStdout Redirects the standard input and output of a child process. When this option is enabled, the output within the child process will not be printed but will be written to the main process pipeline. Reading the keyboard input will change the data from the pipeline. The default is blocking read.
* mixed $pipeType pipe type. When $redirect_stdin_stdout is enabled, this option will ignore the user parameter and force it to 1. Can be set to 0 if there is no interprocess communication within the child process
* bool $enableCoroutine defaults to false, enables coroutines in callback function, and can use coroutines directly in the functions of child processes after opening

Final function __construct(string $processName,$arg = null,$redirectStdinStdout = false,$pipeType = 2,$enableCoroutine = false)

Set maximum wait time

* int $maxExitWaitTime sets the maximum wait time
Public function setMaxExitWaitTime(int $maxExitWaitTime)

Get the current process

Public function getProcess():Process

Add a timer in the process, return the timer number

* int $ms set timer time
* callable $call sets the callback function

Public function addTick($ms,callable $call):?int

Clear the timer in the process

* int $timerId timer number

Public function clearTick(int $timerId):?int

Add a delay timer in the process, return the timer number

* int $ms set the delay time
* callable $call sets the callback function

Public function delay($ms,callable $call):?int

Get the child process pid

Public function getPid():?int

Get the child process pid

* Process $process process class

Execution process task

Function __start(Process $process)

Get parameters

Public function getArg()

Get process name

Public function getProcessName()

abnormal

Protected function onException(\Throwable $throwable)

Process task

* mixed $arg parameter

Public abstract function run($arg)

Child process shutdown handler

Public abstract function onShutDown()

Process communication

* string $str communication data

Public abstract function onReceive(string $str)
