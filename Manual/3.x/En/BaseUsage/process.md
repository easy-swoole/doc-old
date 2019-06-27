# Process

## Usage

Handling time-consuming tasks, such as processing infinite loop queue consumption, clearing token data in redundant redis, and so on.

## How To Use

Register the process in EasySwooleEvent.

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/28
 * Time: 6:33 PM
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
         * Except for the process name, the remaining parameters are not required
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

Process Class:

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

## Core Object Method

Core Class: EasySwoole\Component\Process\AbstractProcess.

Constructor to create a child process

* string $processName - set the process name
* mixed $arg - setting parameters
* bool $redirectStdinStdout - redirect the standard input and output of a child process. When this option is enabled, the output of the child process will not be printed on screen, but will be written to the main process pipeline. Reading the keyboard input means reading the data from the pipeline. The default is reading in blocks.
* mixed $pipeType - pipe type option will ignore the user parameter and force it to 1 when $redirect_stdin_stdout is enabled. It can be set to 0 if there is no interprocess communication within the child process.
* bool $enableCoroutine - default is false, and coroutine is enabled in callback function. If it is true, coroutines can be used directly in the functions of child processes. 

final function __construct(string $processName, $arg = null, $redirectStdinStdout = false,$pipeType = 2, $enableCoroutine = false)

Set maximum waiting time

* int $maxExitWaitTime sets the maximum wait time
public function setMaxExitWaitTime(int $maxExitWaitTime)

Get the current process

public function getProcess():Process

Add a timer in the process, return the timer number

* int $ms - set timer time
* callable $call - sets the callback function

public function addTick($ms,callable $call):?int

Clear the timer in the process

* int $timerId - timer serial number

public function clearTick(int $timerId):?int

Add a delay timer in the process, return the timer serial number

* int $ms - set the delay time
* callable $call - sets the callback function

public function delay($ms,callable $call):?int

Get the child process pid

public function getPid():?int

Get the child process pid

* Process $process - process class

Execution process task

function __start(Process $process)

Get parameters

public function getArg()

Get process name

public function getProcessName()

Abnormal

protected function onException(\Throwable $throwable)

Process task

* mixed $arg - parameter

public abstract function run($arg)

Child process shutdown handler

public abstract function onShutDown()

Process communication

* string $str communication data

public abstract function onReceive(string $str)
