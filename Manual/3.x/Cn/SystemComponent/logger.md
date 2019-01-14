# 日志处理
在easyswoole中,已经默认了一个日志处理类`EasySwoole\Trace\Logger`:
```php
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

    public function log(string $str, $logCategory,int $timestamp = null)
    {
        // TODO: Implement log() method.
        if($timestamp == null){
            $timestamp = time();
        }
        $date = date('Y-m-d h:i:s',$timestamp);
        $filePrefix = $logCategory.'-'.date('Y-m-d',$timestamp);
        $filePath = $this->logDir."/{$filePrefix}.log";
        file_put_contents($filePath,"[$date][{$logCategory}]{$str}\n",FILE_APPEND|LOCK_EX);
    }

    public function console(string $str, $category = null, $saveLog = true)
    {
        // TODO: Implement console() method.
        if(empty($category)){
            $category = 'console';
        }
        $time = time();
        $date = date('Y-m-d h:i:s',$time);
        echo "[{$date}][{$category}]{$str}\n";
        if($saveLog){
            $this->log($str,$category,$time);
        }
    }
}

```
在默认情况下,所有的异常/错误都会经过该日志处理,输出到控制台/写入文件.也可以通过`EasySwoole\EasySwoole\Logger`去自行操作日志:
```php
<?php
Logger::getInstance()->log('这是自定义写入的日志','notice');
Logger::getInstance()->console('这是自定义输出的日志','类别',false);//默认输出之后还会写入,第三个参数false则不写入
```

## 自定义日志存储

自定义日志处理类

```php
<?php
/**
 * Created by PhpStorm.
 * User: tioncico
 * Date: 19-1-12
 * Time: 上午9:43
 */
namespace App\Log;
use EasySwoole\Trace\AbstractInterface\LoggerInterface;

class MyLogHandle implements LoggerInterface{
    public function console(string $str, $category = null, $saveLog = true)
    {
        echo "这是自定义的log处理,输出:$str\n";
        // TODO: Implement console() method.
    }

    public function log(string $str, $logCategory, int $timestamp = null)
    {
        echo "这是自定义的log处理,模拟写入:[$logCategory]$str\n";
        // TODO: Implement log() method.
    }

}
```

在框架初始化事件里注入日志存储处理

```php
function static initialize()
{
    // TODO: Implement frameInitialize() method.
    // 注入日志处理类
    Di::getInstance()->set(SysConst::LOGGER_HANDLER,new MyLogHandle());}
```

打印日志信息

```php
Logger::getInstance()->log('这是自定义写入的日志','notice');
Logger::getInstance()->console('这是自定义输出的日志','类别',false);//默认输出之后还会写入,第三个参数false则不写入
```
>框架全局的错误/异常处理都是使用Logger类来处理的


附上demo地址: <https://github.com/easy-swoole/demo/blob/3.x/App/HttpController/Log/Index.php>


>logger是框架全局的异常错误日志处理类,在默认情况异常错误将不会输出到终端,如果需要输出,请增加配置`DISPLAY_ERROR`=>true