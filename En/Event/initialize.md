# Framework initialized event
Refer to `EasySwoole\EasySwoole\Core.php`.

## The function prototype
```php
<?php
// ./EasySwooleEvent.php
// ...
class EasySwooleEvent implements Event
{
    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    
        // Register the default exception handler
        Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,[
            BaseExceptionHandler::class,'handle'
        ]);
    }
    
    // ...
}
```

## Framework initialization states
Before the framework initialization event is executed, `EasySwoole` has completed the following tasks：
* The environment variables are loaded
    * Which you defined in `dev.php` or `produce.php`

* Some global variables are defined:
    * `EASYSWOOLE_ROOT`: The current working directory of `EasySwoole` framework
    * `EASYSWOOLE_SERVER`: Your application is running as a Swoole Server
    * `EASYSWOOLE_WEB_SERVER`: Your application is running as a Web Server
    * `EASYSWOOLE_WEB_SOCKET_SERVER`: Your application is running as a Web Socket Server
    * `EASYSWOOLE_REDIS_SERVER`: Your application is running as a Redis Server
    
## What to do in this stage
In this hook, you may want to manage some system constants and global configuration values, eg：
- Modify and create the system default Log/Temp directories
- Introducing the user-defined configurations
- Register the database or/and redis connections pool
- Register the trace chain tracker

## What will happen after this
* The system default Log/Temp directories are defined:
    * The configuration value of Log and Temp directory must be the absolute path.
    * Default Log/Trigger/Error handlers will be registered