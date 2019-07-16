<head>
     <title>EasySwoole日志处理</title>
     <meta name="keywords" content="EasySwoole日志处理|swoole日志处理|swoole日志"/>
     <meta name="description" content="如何在php的swoole拓展中进行自定义的日志处理和异常捕获"/>
</head>
---<head>---

# 日志处理
## Logger
在easyswoole3.2.3版本之后，easyswoole的默认日志处理类分离成了组件形式，组件地址：https://github.com/easy-swoole/log


### logger调用方法
```php
use use EasySwoole\EasySwoole\Logger;
Logger::getInstance()->log('log level info',Logger::LOG_LEVEL_INFO,'DEBUG');//记录info级别日志//例子后面2个参数默认值
Logger::getInstance()->log('log level notice',Logger::LOG_LEVEL_NOTICE,'DEBUG2');//记录notice级别日志//例子后面2个参数默认值
Logger::getInstance()->console('console',Logger::LOG_LEVEL_INFO,'DEBUG');//记录info级别日志并输出到控制台
Logger::getInstance()->info('log level info');//记录info级别日志并输出到控制台
Logger::getInstance()->notice('log level notice');//记录notice级别日志并输出到控制台
Logger::getInstance()->waring('log level waring');//记录waring级别日志并输出到控制台
Logger::getInstance()->error('log level error');//记录error级别日志并输出到控制台
Logger::getInstance()->onLog()->set('myHook',function ($msg,$logLevel,$category){
    //增加日志写入之后的回调函数
});
```
> 注意，在非框架中使用，例如是单元测试脚本，请执行 EasySwoole\EasySwoole\Core::getInstance()->initialize(); 用于初始化日志 

将输出/记录以下内容:
````text
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
use EasySwoole\EasySwoole\Trigger;
//记录错误异常日志,等级为Exception
Trigger::getInstance()->throwable($throwable);
//记录错误信息,等级为FatalError
Trigger::getInstance()->error($throwable->getMessage().'666');

Trigger::getInstance()->onError()->set('myHook',function (){
    //当发生error时新增回调函数
});
Trigger::getInstance()->onException()->set('myHook',function (){
    
});
````

## 日志中心

比如，会有想把数据往日志中心推送，或者是最TCP日志推送，那么，可以新增onLog回调，然后把日志信息，推送到日志中心。
