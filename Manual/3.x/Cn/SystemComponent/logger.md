# 日志处理
在easyswoole中,已经默认了一个日志处理类`EasySwoole\Trace\Logger`:
````php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/8/14
 * Time: 下午12:46
 */

namespace EasySwoole\Trace;


use EasySwoole\Trace\AbstractInterface\LoggerInterface;

class Logger implements LoggerInterface
{
    private $logDir;

    function __construct(string $logDir = null)
    {
        if(empty($logDir)){
            $logDir = getcwd();
        }
        $this->logDir = $logDir;
    }


    /**
     * 记录日志
     * log
     * @param string   $str//日志信息
     * @param null     $logCategory//日志分类
     * @param int|null $timestamp//时间
     * @return string|null
     * @author Tioncico
     * Time: 14:50
     */
    public function log(string $str, $logCategory = null,int $timestamp = null):?string
    {
        // TODO: Implement log() method.
        if($timestamp == null){
            $timestamp = time();
        }
        $date = date('Y-m-d h:i:s',$timestamp);
        $filePrefix = $logCategory.'-'.date('Y-m',$timestamp);
        $filePath = $this->logDir."/{$filePrefix}.log";
        $str = "[$date][{$logCategory}]{$str}";
        file_put_contents($filePath,"{$str}\n",FILE_APPEND|LOCK_EX);
        return $str;
    }

    /**
     * 输出到控制台并记录日志
     * console
     * @param string $str
     * @param null   $category
     * @param bool   $saveLog
     * @return string|null
     * @author Tioncico
     * Time: 14:51
     */
    public function console(string $str, $category = null, $saveLog = true):?string
    {
        // TODO: Implement console() method.
        $time = time();
        $date = date('Y-m-d h:i:s',$time);
        $final = "[{$date}][{$category}]{$str}";
        if($saveLog){
            $this->log($str,$category,$time);
        }
        echo $final."\n";
        return $final;
    }
}
````

使用:
````php
<?php
\EasySwoole\EasySwoole\Logger::getInstance()->log('日志内容');
\EasySwoole\EasySwoole\Logger::getInstance()->console('控制器输出内容');
````

## 自定义处理日志类
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
     * 打印到控制台并记录日志
     * console
     * @param string $str
     * @param null   $category
     * @param bool   $saveLog
     * @return string|null
     * @author Tioncico
     * Time: 14:57
     */
    public function console(string $str, $category = null, $saveLog = true): ?string
    {
        // TODO: Implement console() method.
        echo $str;
    }

    /**
     * 自定义进行日志存储,比如存到数据库,存到文件,或者请求其他地方存储
     * log
     * @param string   $str
     * @param null     $logCategory
     * @param int|null $timestamp
     * @return string|null
     * @author Tioncico
     * Time: 14:56
     */
    public function log(string $str, $logCategory = null, int $timestamp = null): ?string
    {
        // TODO: Implement log() method.
        file_put_contents(getcwd()."/test.log",$str.PHP_EOL,FILE_APPEND);
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
使用:
````php
<?php
\EasySwoole\EasySwoole\Logger::getInstance()->log('日志内容');
\EasySwoole\EasySwoole\Logger::getInstance()->console('控制器输出内容');
````