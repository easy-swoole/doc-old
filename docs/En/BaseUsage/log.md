---
title: Easyswoole custom log processing
meta:
  - name: description
    content: How to do custom log processing and exception capture in easyswoole
  - name: keywords
    content: swoole|swoole Expand|Easysoole log processing|Swoole log processing|Swoole log|swoole
---

# Log processing
## Logger
After easyswoole 3.2.3, the default log processing class of easyswoole is separated into component form and component address：https://github.com/easy-swoole/log


### Custom log

First, define a log template, which needs to be inherited and implemented\EasySwoole\Log\LoggerInterface，as follows：

```php

<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-11-13
 * Time: 上午11:00
 */

namespace App\Logger;


use EasySwoole\Log\LoggerInterface;

class Logger implements LoggerInterface
{

    function log(?string $msg, int $logLevel = self::LOG_LEVEL_INFO, string $category = 'DEBUG'): string
    {
        // TODO: Implement log() method.
        $date = date('Y-m-d H:i:s');
        $levelStr = $this->levelMap($logLevel);
        $filePath = EASYSWOOLE_LOG_DIR."/".date('Y-m-d').".log";
        $str = "[{$date}][{$category}][{$levelStr}] : [{$msg}]\n";
        file_put_contents($filePath,"{$str}",FILE_APPEND|LOCK_EX);
        return $str;
    }

    function console(?string $msg, int $logLevel = self::LOG_LEVEL_INFO, string $category = 'DEBUG')
    {
        // TODO: Implement console() method.
        $date = date('Y-m-d H:i:s');
        $levelStr = $this->levelMap($logLevel);
        $temp =  $this->colorString("[{$date}][{$category}][{$levelStr}] : [{$msg}]",$logLevel)."\n";
        fwrite(STDOUT,$temp);
    }

    private function colorString(string $str,int $logLevel)
    {
        switch($logLevel) {
            case self::LOG_LEVEL_INFO:
                $out = "[42m";
                break;
            case self::LOG_LEVEL_NOTICE:
                $out = "[43m";
                break;
            case self::LOG_LEVEL_WARNING:
                $out = "[45m";
                break;
            case self::LOG_LEVEL_ERROR:
                $out = "[41m";
                break;
            default:
                $out = "[42m";
                break;
        }
        return chr(27) . "$out" . "{$str}" . chr(27) . "[0m";
    }

    private function levelMap(int $level)
    {
        switch ($level)
        {
            case self::LOG_LEVEL_INFO:
                return 'INFO';
            case self::LOG_LEVEL_NOTICE:
                return 'NOTICE';
            case self::LOG_LEVEL_WARNING:
                return 'WARNING';
            case self::LOG_LEVEL_ERROR:
                return 'ERROR';
            default:
                return 'UNKNOWN';
        }
    }
}

```

In the``` EasySwooleEvent ``` ``` initialize ``` into the user-defined log processing， as follows：

```php 

public static function initialize()
{
    // TODO: Implement initialize() method.
   
    Di::getInstance()->set(SysConst::LOGGER_HANDLER, new \App\Logger\Logger());

}

```

### Logger call method
```php
use use EasySwoole\EasySwoole\Logger;
Logger::getInstance()->log('log level info',Logger::LOG_LEVEL_INFO,'DEBUG');//Record the info level log the default values of the next two parameters in the example
Logger::getInstance()->log('log level notice',Logger::LOG_LEVEL_NOTICE,'DEBUG2');//Record the notice level log the default values of the next two parameters in the example
Logger::getInstance()->console('console',Logger::LOG_LEVEL_INFO,'DEBUG');//Log info level and output to console
Logger::getInstance()->info('log level info');//Log info level and output to console
Logger::getInstance()->notice('log level notice');//Log notice level and output to console
Logger::getInstance()->waring('log level waring');//Log warning level and output to console
Logger::getInstance()->error('log level error');//Log error level and output to console
Logger::getInstance()->onLog()->set('myHook',function ($msg,$logLevel,$category){
    //Add callback function after log writing
});
```

::: warning 
 Note that for non framework use, such as unit test scripts, execute EasySwoole\EasySwoole\Core::getInstance()->initialize(); Used to initialize logs 
:::

The following will be output / recorded:
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

::: warning 
 In the new logger processing scheme, new `LOG_LEVEL_INFO = 1`，`LOG_LEVEL_NOTICE = 2`，`LOG_LEVEL_WARNING = 3`，`LOG_LEVEL_ERROR = 4`，4 log levels to help distinguish logs better
:::

## Trigger

`\EasySwoole\EasySwoole\Trigger`Trigger, which is used to actively trigger an error or exception without interrupting the program execution.

After easyswoole version 3.2.3, the default trigger class of easyswoole is separated into component form. The component address is:：https://github.com/easy-swoole/trigger

  
For example, in the onexception of the controller, we can record the error exception, and then output other contents to prevent the system terminal from running and the user from discovering the real error
````php
use EasySwoole\EasySwoole\Trigger;
//Record the error exception log with the level of exception
Trigger::getInstance()->throwable($throwable);
//Record the error information with the level of fatalerror
Trigger::getInstance()->error($throwable->getMessage().'666');

Trigger::getInstance()->onError()->set('myHook',function (){
    //Add callback function when error occurs
});
Trigger::getInstance()->onException()->set('myHook',function (){
    
});
````

## Log Center

For example, if you want to push data to the log center or the most TCP log, you can add an OnLog callback, and then push the log information to the log center.
