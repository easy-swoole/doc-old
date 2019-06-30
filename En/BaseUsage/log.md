# Handling Log
## Logger

`EasySwoole\Trace\Logger` is the default log processing class for easyswoole. We only need to call and use it directly.
````php
function index()
{
    \EasySwoole\EasySwoole\Logger::getInstance()->log('log content'); // will write log
    \EasySwoole\EasySwoole\Logger::getInstance()->console('controller output content'); // will record log + output to console
    \EasySwoole\EasySwoole\Logger::getInstance()->logWithLocation('log content+file source'); // will record log + call the file address and file line number of the method
    \EasySwoole\EasySwoole\Logger::getInstance()->consoleWithLocation('Controller output content+file source'); // will record log + output to console + call file address and file line number of this method
    $this->writeJson(200, [], 'success');
}
````
The following will be output/recorded:
````
[2019-04-12 10:04:18][default] controller output content
[2019-04-12 10:04:18][default][file:/www/easyswoole/easyswoole-test/App/HttpController/Index.php][line:26] controller output content
````

## Trigger

The `\EasySwoole\EasySwoole\Trigger` trigger is used to actively trigger an error or exception without interrupting the program.
For example, in the controller's onException, we can log the error exception, and then output other content, so that the system terminal is not running, and the user is not allowed to detect the real error.
````php
function onException(\Throwable $throwable): void
{
    // record error exception log, the level is Exception
    Trigger::getInstance()->throwable($throwable);
    // record error message, the level is FatalError
    Trigger::getInstance()->error($throwable->getMessage().'666');
    // directly respond to the front end 500 and output system busy
    $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
    $this->response()->write('System is busy, please try again later');
}
````

## Custom Logger

If you don't want to use the framework's default logging logic, you can customize the implementation of logger.
For example, the record log of the framework is recorded to the file, but we can change the log to be saved to the database, or send the error directly to the phone via sms (just for example).

Add the file `App/Utility/Logger.php`:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/18 0018
 * Time: 14:56
 */

namespace App\Utility;


use EasySwoole\Trace\AbstractInterface\LoggerInterface;

class Logger implements LoggerInterface
{
    /**
     * print the log to console and record it
     * console
     * @param string $str
     * @param null $category
     * @param bool $saveLog
     * @return string|null
     * @author Tioncico
     * Time: 14:57
     */
    public function console(string $str, $category = null, $saveLog = true): ?string
    {
        // customized logic, here is only echo the string, but we can refer to the framework itself, then call the log function to record
        echo $str;
        return $str; // must return the string back
  }

    /**
     * customized log storage methods, such as saving to a database, saving to a file, or requesting storage elsewhere
     * log
     * @param string $str
     * @param null $logCategory
     * @param int|null $timestamp
     * @return string|null
     * @author Tioncico
     * Time: 14:56
     */
    public function log(string $str, $logCategory = null, int $timestamp = null): ?string
    {
        // customized logic, such as stored to the database, sent error data to the phone via SMS, etc.
        file_put_contents(getcwd()."/test.log",$str.PHP_EOL,FILE_APPEND);
        return $str; // must return the string back
  }
}
````


Register with the `initialize` method in `EasySwooleEvent.php`:
````php
<?php
public static function initialize()
{
    // TODO: Implement initialize() method.
    date_default_timezone_set('Asia/Shanghai');
    Di::getInstance()->set(SysConst::LOGGER_HANDLER,\App\Utility\Logger::class);
}
````
Transfer:
````php
function index()
{
    \EasySwoole\EasySwoole\Logger::getInstance()->log('log content'); // will record log
    \EasySwoole\EasySwoole\Logger::getInstance()->console('controller output content'); // will record logs + output to the console
    $this->writeJson(200, [], 'success');
}
````

## Custom Trigger

Similarly, if you don't want to use the Trigger processing that comes with the framework, you can also implement it yourself.
We need to implement the processing class by implementing the `EasySwoole\Trace\AbstractInterface\TriggerInterface` interface:
Add file `App/Utility/Trigger.php`
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/18 0018
 * Time: 14:34
 */

namespace App\Utility;


use EasySwoole\EasySwoole\Logger;
use EasySwoole\Trace\AbstractInterface\TriggerInterface;
use EasySwoole\Trace\Bean\Location;

class Trigger implements TriggerInterface
{
    public function error($msg, int $errorCode = E_USER_ERROR, Location $location = null)
    {
        Logger::getInstance()->console('This is a custom output error: '.$msg);
        // TODO: Implement error() method.
    }

    public function throwable(\Throwable $throwable)
    {
        Logger::getInstance()->console('This is a custom output exception: '.$throwable->getMessage());
        // TODO: Implement throwable() method.
    }
}
````
Inject in the `initialize` method of `EasySwooleEvent.php`:
````php
    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
        Di::getInstance()->set(SysConst::TRIGGER_HANDLER,\App\Utility\Trigger::class);
    }
````
Transfer:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/4/11 0011
 * Time: 14:40
 */

namespace App\HttpController;

use EasySwoole\EasySwoole\Trigger;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Http\Message\Status;
class Index extends Controller
{
    function index()
    {
        $a = new a(); // new a non-existing class to trigger
        $this->writeJson(200, [], 'success');
    }

    function onException(\Throwable $throwable): void
    {
        // record error exception log, the level is Exception
        Trigger::getInstance()->throwable($throwable);
        // record error message, the level is FatalError
        Trigger::getInstance()->error($throwable->getMessage() . '666');
        // directly respond to the front end 500 and output system busy
        $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
        $this->response()->write('System is busy, please try again later');
    }
}
````
