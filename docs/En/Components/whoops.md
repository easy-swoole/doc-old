---
title: Whoops
meta:
  - name: description
    content: Easyswoole provides the Whoops driver for the development phase, friendly troubleshooting of HTTP business errors and exceptions.
  - name: keywords
    content: easyswoole|Whoops
---

# Whoops

Easyswoole provides the Whoops driver for the development phase, friendly troubleshooting of HTTP business errors and exceptions.

![](/resources/easyWhoops.png)


::: warning 
 Do not use it in the production phase, otherwise the code leaks EasySwoole is not responsible for it! ! !
:::

## Installation
```
composer require easyswoole/easy-whoops=3.x
```
## Use
Register directly in the event of EasySwoole global
```php
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
        $whoops->pushHandler(new PrettyPageHandler);  // Output a nice page
        $whoops->pushHandler(new CallbackHandler(function ($exception, $inspector, $run, $handle) {
            // Can push multiple Handle support callbacks for more follow-up
        }));
        $whoops->register();
    }

    public static function mainServerCreate(EventRegister $register)
    {

        Run::attachTemplateRender(ServerManager::getInstance()->getSwooleServer());
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        //Intercept request
        Run::attachRequest($request, $response);
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```