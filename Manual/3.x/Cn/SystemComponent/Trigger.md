# 触发器
触发器是用来主动触发错误或者异常而不中断程序继续执行。  
命名空间:`\EasySwoole\EasySwoole\Trigger`.  
例如在控制器的`onException`中调用异常处理
````php
protected function onException(\Throwable $throwable): void
{
    //拦截错误进日志,使控制器继续运行
    EasySwoole\EasySwoole\Trigger::getInstance()->throwable($throwable);
    $this->writeJson(Status::CODE_INTERNAL_SERVER_ERROR, null, $throwable->getMessage());
}
````
使用error方法直接记录输出错误
````php
//记录输出错误
EasySwoole\EasySwoole\Trigger::getInstance()->error('test error');
````

## Trigger默认处理类
在EasySwoole底层中,已经注册了默认的触发器处理类,以及一系列的错误处理逻辑:  
Trigger默认处理类
````php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/8/14
 * Time: 下午12:51
 */

namespace EasySwoole\Trace;


use EasySwoole\Trace\AbstractInterface\LoggerInterface;
use EasySwoole\Trace\AbstractInterface\TriggerInterface;
use EasySwoole\Trace\Bean\Error;
use EasySwoole\Trace\Bean\Location;

class Trigger implements TriggerInterface
{
    protected $logger;//日志处理类
    protected $displayError;//是否输出错误

    function __construct(LoggerInterface $logger,$displayError = true)
    {
        $this->logger = $logger;
        $this->displayError = $displayError;
    }

    /**
     * 直接记录/输出一个错误
     * error
     * @param               $msg
     * @param int           $errorCode
     * @param Location|null $location
     * @author Tioncico
     * Time: 14:30
     */
    public function error($msg, int $errorCode = E_USER_ERROR, Location $location = null)
    {
        // TODO: Implement error() method.
        if($location == null){
            $location = new Location();
            $debugTrace = debug_backtrace();
            $caller = array_shift($debugTrace);
            $location->setLine($caller['line']);
            $location->setFile($caller['file']);
        }
        $error = Error::mapErrorCode($errorCode);
        $msg = "[file:{$location->getFile()}][line:{$location->getLine()}]{$msg}";
        $this->logger->log($msg,$error->getErrorType());//记录错误信息
        if($this->displayError){//输出错误到控制台
            $this->logger->console($msg,$error->getErrorType(),false);
        }
    }

    /**
     * 处理一个异常
     * throwable
     * @param \Throwable $throwable
     * @author Tioncico
     * Time: 14:31
     */
    public function throwable(\Throwable $throwable)
    {
        // TODO: Implement throwable() method.
        $msg = "[file:{$throwable->getFile()}][line:{$throwable->getLine()}]{$throwable->getMessage()}";
        $this->logger->log($msg,'Exception');//记录错误信息
        if($this->displayError){//输出错误到控制台
            $this->logger->console($msg,'Exception',false);
        }
    }
}
````
## 自定义处理类
我们需要通过实现`EasySwoole\Trace\AbstractInterface\TriggerInterface`接口进行实现处理类:
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
        Logger::getInstance()->console('这是自定义输出的错误:'.$msg);
        // TODO: Implement error() method.
    }

    public function throwable(\Throwable $throwable)
    {
        Logger::getInstance()->console('这是自定义输出的异常:'.$throwable->getMessage());
        // TODO: Implement throwable() method.
    }
}
````
在`EasySwooleEvent.php`的`initialize`方法中进行注入:
````php
    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
        Di::getInstance()->set(SysConst::TRIGGER_HANDLER,\App\Utility\Trigger::class);
    }
````

