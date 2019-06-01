# 日志处理
## Logger
在easyswoole3.2.3版本之后，easyswoole的默认日志处理类分离成了组件形式，组件地址：https://github.com/easy-swoole/log


### logger调用方法
````php
function index()
{
        \EasySwoole\EasySwoole\Logger::getInstance()->log('log level info',Logger::LOG_LEVEL_INFO,'DEBUG');//记录info级别日志//例子后面2个参数默认值
        \EasySwoole\EasySwoole\Logger::getInstance()->log('log level notice',Logger::LOG_LEVEL_NOTICE,'DEBUG2');//记录notice级别日志//例子后面2个参数默认值
        
        \EasySwoole\EasySwoole\Logger::getInstance()->console('console',Logger::LOG_LEVEL_INFO,'DEBUG');//记录info级别日志并输出到控制台
        \EasySwoole\EasySwoole\Logger::getInstance()->info('log level info');//记录info级别日志并输出到控制台
        \EasySwoole\EasySwoole\Logger::getInstance()->notice('log level notice');//记录notice级别日志并输出到控制台
        \EasySwoole\EasySwoole\Logger::getInstance()->waring('log level waring');//记录waring级别日志并输出到控制台
        \EasySwoole\EasySwoole\Logger::getInstance()->error('log level error');//记录error级别日志并输出到控制台
        \EasySwoole\EasySwoole\Logger::getInstance()->onLog(function ($msg,$logLevel,$category){
            //增加日志写入之后的回调函数
        });
}
````
将输出/记录以下内容:
````
[2019-06-01 21:10:25][DEBUG][INFO] : [1]
[2019-06-01 21:10:25][DEBUG][INFO] : [2]
[2019-06-01 21:10:25][DEBUG][INFO] : [3]
[2019-06-01 21:10:25][DEBUG][NOTICE] : [4]
[2019-06-01 21:10:25][DEBUG][WARNING] : [5]
[2019-06-01 21:10:25][DEBUG][ERROR] : [6]
[2019-06-01 21:23:27][DEBUG][INFO] : [log level info]
[2019-06-01 21:23:27][DEBUG2][NOTICE] : [log level notice]
[2019-06-01 21:23:27][DEBUG][INFO] : [console]
[2019-06-01 21:23:27][DEBUG][INFO] : [log level info]
[2019-06-01 21:23:27][DEBUG][NOTICE] : [log level notice]
[2019-06-01 21:23:27][DEBUG][WARNING] : [log level waring]
[2019-06-01 21:23:27][DEBUG][ERROR] : [log level error]
````
> 在新版logger处理方案中，新增了 `LOG_LEVEL_INFO = 1`，`LOG_LEVEL_NOTICE = 2`，`LOG_LEVEL_WARNING = 3`，`LOG_LEVEL_ERROR = 4`，4个日志等级，有助于更好的区分日志

## Trigger

`\EasySwoole\EasySwoole\Trigger`触发器,用于主动触发错误或者异常而不中断程序继续执行。  

在easyswoole3.2.3版本之后，easyswoole的默认Trigger类分离成了组件形式，组件地址：https://github.com/easy-swoole/trigger

  
例如在控制器的onException中,我们可以记录错误异常,然后输出其他内容,不让系统终端运行,不让用户发觉真实错误.
````php
function onException(\Throwable $throwable): void
{
       //记录错误异常日志,等级为Exception
        \EasySwoole\EasySwoole\Trigger::getInstance()->throwable($throwable);
        //记录错误信息,等级为FatalError
        \EasySwoole\EasySwoole\Trigger::getInstance()->error($throwable->getMessage().'666');

        \EasySwoole\EasySwoole\Trigger::getInstance()->onError(function (){
            //当发生error时新增回调函数
        });
        \EasySwoole\EasySwoole\Trigger::getInstance()->onException(function (){
            //当发生exception时新增回调函数
        });
    $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
    $this->response()->write('系统繁忙,请稍后再试 ');
}
````

## 自定义logger
如果你不想使用框架默认的记录日志逻辑,可以自定义logger的实现.  
例如,框架的记录日志是记录到文件,我们可以改成记录到数据库,或者直接把错误发送短信到手机上(只是举例).  

新增文件`App/Utility/Logger.php`:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/18 0018
 * Time: 14:56
 */

namespace App\Utility;

use EasySwoole\Log\LoggerInterface;

class Logger implements LoggerInterface
{
    /**
     * 打印到控制台并记录日志
     * console
     * @param string $msg
     * @param int    $logLevel
     * @param string   $category
     * @return string|null
     * @author Tioncico
     * Time: 14:57
     */
    public function log(?string $msg, int $logLevel = self::LOG_LEVEL_INFO, string $category = 'DEBUG'): string
    {
        //自定义逻辑,这里只echo了字符串,我们可以参考框架本身的,再调用一下log记录一下
        echo $msg;
        return $msg;//必须返回字符串回去
    }

    /**
     * 自定义进行日志存储,比如存到数据库,存到文件,或者请求其他地方存储
     * log
     * @param string   $msg
     * @param int      $logLevel
     * @param string     $category
     * @return string|null
     * @author Tioncico
     * Time: 14:56
     */
    public function console(?string $msg, int $logLevel = self::LOG_LEVEL_INFO, string $category = 'DEBUG')
    {
        //自定义逻辑,例如存储到数据库,短信发送错误数据到手机等等
        file_put_contents(getcwd() . "/test.log", $msg . PHP_EOL, FILE_APPEND);
        return $msg;//必须返回字符串回去
    }
}
````


在`EasySwooleEvent.php`中的`initialize`方法进行注册:
````php
<?php
public static function initialize()
{
    // TODO: Implement initialize() method.
    date_default_timezone_set('Asia/Shanghai');
    Di::getInstance()->set(SysConst::LOGGER_HANDLER,\App\Utility\Logger::class);
}
````
调用:
````php
function index()
{
    \EasySwoole\EasySwoole\Logger::getInstance()->log('日志内容');//将记录日志
    \EasySwoole\EasySwoole\Logger::getInstance()->console('控制器输出内容');//将记录日志+输出到控制台
    $this->writeJson(200, [], 'success');
}
````

## 自定义Trigger

同样,如果不想使用框架自带的Trigger处理,也可以自行实现
我们需要通过实现`EasySwoole\Trace\AbstractInterface\TriggerInterface`接口进行实现处理类:
新增文件`App/Utility/Trigger.php`
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
调用:
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
        $a = new  a();//new一个不存在的类去触发
        $this->writeJson(200, [], 'success');
    }

    function onException(\Throwable $throwable): void
    {
        //记录错误异常日志,等级为Exception
        Trigger::getInstance()->throwable($throwable);
        //记录错误信息,等级为FatalError
        Trigger::getInstance()->error($throwable->getMessage() . '666');
        //直接给前端响应500并输出系统繁忙
        $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
        $this->response()->write('系统繁忙,请稍后再试 ');
    }
}
````
> Trigger依赖了logger组件进行记录日志

