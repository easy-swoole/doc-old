# Whoops

Easyswoole provides Whoops drivers for the development phase to friendly eliminate errors and exceptions in HTTP business.
![](./../Resource/easyWhoops.png)

> Don't use it in production phase, otherwise EasySwoole will not be responsible for code leakage!!!

## Install

```
composer require easyswoole/easy-whoops=3.x
```

## Use

Register directly in EasySwoole global events

```
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\Whoops\Handler\CallbackHandler;
use EasySwoole\Whoops\Handler\PrettyPageHandler;
use EasySwoole\Whoops\Run;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
        $whoops = new Run();
        $whoops->pushHandler(new PrettyPageHandler);  // Output a beautiful page
        $whoops->pushHandler(new CallbackHandler(function ($exception, $inspector, $run, $handle) {
            // Multiple Handles can be pushed forward to support callbacks for more follow-up processing
        }));
        $whoops->register();
    }

    public static function mainServerCreate(EventRegister $register)
    {

        Run::attachTemplateRender(ServerManager::getInstance()->getSwooleServer());
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        //Interception request
        Run::attachRequest($request, $response);
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```