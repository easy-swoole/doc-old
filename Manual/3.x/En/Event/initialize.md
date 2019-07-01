# Framework initialized event

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
- Define global variables EASYSWOOLE_ROOT
- Define system default Log/Temp directory

## What to do here
In this hook, you may want to manage some system constants and global configuration values, eg：
- Modify and create the system default Log/Temp directory
- Introducing user-defined configuration
- Register database or redis connection pool
- Register trace chain tracker