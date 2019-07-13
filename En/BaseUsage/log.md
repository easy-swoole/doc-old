<head>
     <title>EasySwoole log processing</title>
     <meta name="keywords" content="EasySwoole log processing|swoole log processing|swoole log"/>
     <meta name="description" content="EasySwoole log processing"/>
</head>
---<head>---

# Handling Log
## Logger

After easy swoole version 3.2.3, easyswoole's default log processing classes were separated into components with the component address: [log](https://github.com/easy-swoole/log).

````php
use use EasySwoole\EasySwoole\Logger;
Logger::getInstance()->log('log level info',Logger::LOG_LEVEL_INFO,'DEBUG');//Record info level logs, default values for the latter two parameters of the example
Logger::getInstance()->log('log level notice',Logger::LOG_LEVEL_NOTICE,'DEBUG2');//Record notice level logs, default values for the last two parameters of the example
Logger::getInstance()->console('console',Logger::LOG_LEVEL_INFO,'DEBUG');//Record info level logs and output them to the console
Logger::getInstance()->info('log level info');//Record info level logs and output them to the console
Logger::getInstance()->notice('log level notice');//Log the notice level log and output it to the console
Logger::getInstance()->waring('log level waring');//Record Waring level logs and output them to the console
Logger::getInstance()->error('log level error');//Record error level logs and output them to the console
Logger::getInstance()->onLog()->set('myHook',function ($msg,$logLevel,$category){
    //Increase callback function after log writing
});
````
> Note that for use in non-frameworks, such as unit test scripts, execute EasySwoole\EasySwool\eCore::getInstance()->initialize(); for initializing logs
The following contents will be output and recorded::
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

> In the new logger processing scheme, `LOG_LEVEL_INFO = 1', `LOG_LEVEL_NOTICE = 2', `LOG_LEVEL_WARNING = 3', `LOG_LEVEL_ERROR = 4', four log levels have been added to help better distinguish logs.

## Trigger

`\EasySwoole\EasySwoole\Trigger`Triggers are used to actively trigger errors or exceptions without interrupting program execution. 

After easyswoole version 3.2.3, easyswoole's default Trigger class was separated into component form and component address.：[trigger](https://github.com/easy-swoole/trigger)

  
For example, in onException of the controller, we can record error exceptions, and then output other content, so that the system terminal does not run and users do not find real errors.
````php
use EasySwoole\EasySwoole\Trigger;
//Record error exception logs at Exception level
Trigger::getInstance()->throwable($throwable);
//Record error information at FatalError level
Trigger::getInstance()->error($throwable->getMessage().'666');

Trigger::getInstance()->onError()->set('myHook',function (){
    //Add callback function when error occurs
});
Trigger::getInstance()->onException()->set('myHook',function (){
    
});
````

## Log Center

For example, if you want to push data to the log center or the most TCP log, you can add onLog callbacks and then push log information to the log center.
