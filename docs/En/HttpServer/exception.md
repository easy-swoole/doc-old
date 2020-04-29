---
title: Error and exception interception
meta:
  - name: description
    content: Easyswoole,Error and exception interception
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole|Error and exception interception|Swoole error exception
---
## Error and exception interception

### Http controller error exception

An error occurs in the http controller, the system will use the default exception handling to output to the client, the code is as follows:
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
Can override the onException method directly on the controller:
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
        // TODO: Implement index() method.
        $this->actionNotFound('index');
    }

    function onException(\Throwable $throwable): void
    {
        var_dump($throwable->getMessage());
    }

    protected function actionNotFound(?string $action): void
    {
        $this->response()->withStatus(Status::CODE_NOT_FOUND);
        $this->response()->write('action not found');
    }
}

```

Can also customize exception handling files:
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
DI registration exception handling in the initialize event:

```php
public static function initialize()
{
    Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,[ExceptionHandler::class,'handle']);
}

```
