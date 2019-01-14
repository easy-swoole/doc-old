# 触发器
触发器是用来主动触发错误或者异常而不中断程序继续执行。  
命名空间:`\EasySwoole\EasySwoole\Trigger`.

### 实现原理 
#### 链追踪器`\EasySwoole\Trace\Trigger`
链追踪器通过实现`EasySwoole\Trace\AbstractInterface\TriggerInterface`接口处理错误以及异常,传入一个实现`EasySwoole\Trace\AbstractInterface\LoggerInterface`接口的类进行信息的报错或保存.例如:
```php
<?php
$display=true;//是否输出到控制台
$trigger = new \EasySwoole\Trace\Trigger(Logger::getInstance()/*easyswoole默认实现的logger类*/, $display);
```

#### 触发器 `EasySwoole\EasySwoole\Trigger`
触发器也是实现了TriggerInterface接口,传入上面所说的链追踪器进行初始化,触发器是框架默认用于处理全局错误异常的类,在`EasySwoole\EasySwoole\Core`的`registerErrorHandler`方法中:
```php
<?php
  //初始化追追踪器
$trigger = Di::getInstance()->get(SysConst::TRIGGER_HANDLER);
if (!$trigger instanceof TriggerInterface) {
    /*
     * DISPLAY_ERROR
     */
    $display = Config::getInstance()->getConf('DISPLAY_ERROR');
    $trigger = new \EasySwoole\Trace\Trigger(Logger::getInstance(), $display);
}
Trigger::getInstance($trigger);

//在没有配置自定义错误处理器的情况下，转化为trigger处理
$errorHandler = Di::getInstance()->get(SysConst::ERROR_HANDLER);
if (!is_callable($errorHandler)) {
    $errorHandler = function ($errorCode, $description, $file = null, $line = null) {
        $l = new Location();
        $l->setFile($file);
        $l->setLine($line);
        Trigger::getInstance()->error($description, $errorCode, $l);
    };
}
set_error_handler($errorHandler);

$func = Di::getInstance()->get(SysConst::SHUTDOWN_FUNCTION);
if (!is_callable($func)) {
    $func = function () {
        $error = error_get_last();
        if (!empty($error)) {
            $l = new Location();
            $l->setFile($error['file']);
            $l->setLine($error['line']);
            Trigger::getInstance()->error($error['message'], $error['type'], $l);
        }
    };
}
register_shutdown_function($func);
```
> 可通过Di::getInstance()->set()进行修改系统默认的错误异常处理回调


### 主动触发

```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/1/14 0014
 * Time: 11:08
 */
require_once "./vendor/autoload.php";
\EasySwoole\EasySwoole\Core::getInstance()->initialize();//框架初始化,已经注册了错误异常回调

$fruit = ['apple', 'orange', 'banana'];
\EasySwoole\EasySwoole\Trigger::getInstance()->error('测试错误');
\EasySwoole\EasySwoole\Trigger::getInstance()->throwable(new Exception('测试异常'));

var_dump($fruit['a']);
```