<head>
     <title>EasySwoole route|swoole route|swoole Api service|swoole custom route</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Http Exception/Error|swoole http|swoole Api document"/>
     <meta name="description" content="EasySwoole Http Exception/Error|swoole http|swoole Api document"/>
</head>
---<head>---

## Errors and exceptions interception

### HTTP controller error exception

When an error occurs in the HTTP controller, `EasySwoole` will use the default exception handling to output to the client. For example:

```php
<?php
protected function hookThrowable(\Throwable $throwable,Request $request,Response $response)
{
    if(is_callable($this->httpExceptionHandler)){
        call_user_func($this->httpExceptionHandler,$throwable,$request,$response);
    }else{
        $response->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
        $response->write(nl2br($throwable->getMessage()."\n".$throwable->getTraceAsString()));
    }
}
```
The onException method can be rewritten directly in the controller:

```php
<?php
namespace App\HttpController;


use App\ViewController;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Http\Message\Status;

class Base extends ViewController
{
    function index()
    {
        // Implement index() method.
        $this->actionNotFound('index');
    }

    /**
     * @override
     * @param \Throwable $throwable
     */
    function onException(\Throwable $throwable): void
    {
        var_dump($throwable->getMessage());
    }
/**
 * @override
 * @param null|string $action
 */
    protected function actionNotFound(?string $action): void
    {
        $this->response()->withStatus(Status::CODE_NOT_FOUND);
        $this->response()->write('action not found');
    }
}

```

You can also customize exception handling files:
```php
<?php
namespace App;

use EasySwoole\Http\Request;
use EasySwoole\Http\Response;

class ExceptionHandler
{
    public static function handle( \Throwable $exception, Request $request, Response $response )
    {
        var_dump($exception->getTraceAsString());
    }
}
```
Register your own exception handler in the `initialize` hook:

````php
public static function initialize()
{
    Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,[ExceptionHandler::class,'handle']);
}

````