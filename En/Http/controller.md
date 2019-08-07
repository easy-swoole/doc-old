<head>
     <title>EasySwoole controller|swoole controller|swoole Api service</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole controller|swoole controller|swoole Api service"/>
     <meta name="description" content="EasySwoole controller|swoole controller|swoole Api service"/>
</head>
---<head>---

# The Controller Object
Controller object is an object in HTTP component that facilitates interaction between client and server. It uses object pool object reuse mode and injects `request`and `response` objects for data interaction.

## Object pool pattern
The object pool mode is adopted to acquire and create the object in the control object of http.
For example:
* The first client requests the `Index` resource, after the URL parsing and the route forwarding, the request is dispatched to the controller: `App\HttpController\Index.php`.
* Since this is the first request, an instance of `App\HttpController\Index` will be initialised then stored in the object pool.
* The controller object is fetched from the pool, then the `index()` method is called to handle the request.
* After processing, the properties of the object will be reset to the default value, and the object pool is reclaimed.
* User B requests `Index`through URL parsing and routing forwarding, and locates the  `App\HttpController\Index.php` controller.
* Because it's a second request, the object pool gets the first object directly, and it doesn't need new. It calls the `index` method directly for processing.

> Object pool pattern realizes the reuse of the same object by different requests, which reduces the overhead of creating/destroying objects. Only the first request creates the object will call the constructor. When the second request obtains the object, the constructor will not be called again. Object pool pattern will not reset the static and private attributes. These two attributes will be reused. Object pool pattern is for a single process, and object pools of multiple work processes are not shared.
    
## Agreed norms
- In the project, the class name and class file (folder) name are all big humps, and the variables and class methods are small humps.
- In the HTTP response, echo $var in the business logic code does not output the $var content to the corresponding content. Call the wirte() method implementation in the Response instance.

## The Controller Object's methods  
### Scheduling class method   
 * action    
 `Action` is the method that the controller finally executes. According to the matching of routes, different controller methods can be executed, 
 such as `index()` method which is executed by default; Or the `test()` method which is finally resolved by requesting `ip/index/test`. They all can be called `action` execution method.
> The action method can return a string value to chain another controller's method, for example: 

```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/4/11 0011
 * Time: 14:40
 */

namespace App\HttpController;

use EasySwoole\EasySwoole\Trigger;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Http\Message\Status;
class Index extends Controller
{
    function index()
    {
        $this->writeJson(200, [], 'success');
        return '/test';
    }

    function test()
    {
        $this->response()->write('this is test');
        return '/test2';//当执行完test方法之后,返回/test2,让框架继续调度/test2方法
    }

    function test2()
    {
        $this->response()->write('this is test2');
        return true;
    }
}
```

> The returned string will be parsed by `url parsing` and `route routing` rules.
> However, you should always keep in mind to avoid recursively calling among methods such as `method_a() -> method_b() -> method_a() ...`, it causes the infinite dead-loop calls apparently.
    
 
* onRequest

```php
<?php
protected function onRequest(?string $action): ?bool  
{
    return true;   
}
```

This is a point during the whole request being handled by `EasySwoole` framework. The `onRequest` method will be called right before your `action` method.
If the `onRequest` method returns `FALSE`, your `action` method will be ignored, and the program is going to the `afterAction()` straight away.

For example, you could put your authentication logic in this hook:
```php
<?php

function onRequest(?string $action): ?bool
{
    if (parent::onRequest($action)) {
        // Determine whether the authorised action
        if (1/*Pseudo-code*/) {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'Logon has expired');
            return false;
        }
        return true;
    }
    return false;
}
```

 * afterAction
When the controller method is executed, the method will be called to customize logic such as data recovery.

 * index
Index is an abstract method, representing the need to implement this method for inheriting controller objects. Index will become the default controller method.

 * actionNotFound
When the request method is not found, the method is called automatically, and the method can be overwritten to realize its own logic.

> > This method can be understood as the `default method`, similar to the `index` method, so the `afterAction`, `gc`, and other methods will be triggered after the call is completed.

* onException

When the controller logic throws an exception, this method is called to handle the exception (the framework has handled the exception by default).
This method can be overridden for custom exception handling, such as:
```php
function onException(\Throwable $throwable): void
{
    //直接给前端响应500并输出系统繁忙
    $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
    $this->response()->write('系统繁忙,请稍后再试 ');
}
```
> More details about `Exception`, please go to [Error and exception interception](exception.md)

* gc
 
```php
<?php

protected function gc()
{
    // TODO: Implement gc() method.
    if ($this->session instanceof SessionDriver) {
        $this->session->writeClose();
        $this->session = null;
    }
    //Restore default values
    foreach ($this->defaultProperties as $property => $value) {
        $this->$property = $value;
    }
}
```
The `gc` method will be called automatically after execution of `action` and `afterAction`.
You shall reset the controller properties to the default values and close `session`, 
or other `garbage collection` logic could be implemented as you wish.

### Request Response Class Method
* request
After the `request()` method is called, the `EasySwoole\Http\Request` object is returned.
This object comes with all the data requested by the user, such as:
```php
<?php

function index()
{
    $request = $this->request();    // Retrieve the request object
    $request->getRequestParam();    // Get post/get data, get overrides post
    $request->getMethod();          // Get the request mode (post/get/)
    $request->getCookieParams();    // Get cookie parameters
}
```
> More details about `Request`, please go to [request object](request.md)

 * response
  
The `response()` method returns an instance of `EasySwoole\Http\Response` class for sending response data to the client, such as:

```php
<?php 

function index()
{
    $response = $this->response();  // Retrieve the response object
    $response->withStatus(200);    // Mandatory field: the response status code
    $response->setCookie('name','value',time()+86400,'/'); // Setting up a cookie
    $response->write('hello world');    // Send a piece of data to the client (echo similar to regular web mode)
}
```
> More details about `Response`, please go to [response object](response.md)

 * writeJson  
The `writeJson()` method directly encapsulates the status code, the header and the conversion of array to JSON output.
```php
<?php
function index()
{
 $this->writeJson(200,['xsk'=>'test data'],'success');
}
```
The Output:
```json
{"code":200,"result":{"xsk":"test data"},"msg":"success"}
```

### Deserialization method
 * json  
Resolving JSON strings using `json_decode`
 * xml  
 Parsing XML strings using simplexml_load_string

 
### Session
 * sessionDriver  
Set the session driver class. The default handler is `EasySwoole\Http\Session\SessionDriver`
 * session  
Return the session driver class to manage the session.

> Since `3.2.x`, the session component needs to be installed separately with composer, please run:
```bash
composer require easyswoole/session
```
> More details about `Session`, please go to [Session](../Components/session.md)

### Validation
 * validate
 The `validate()` method can directly invoke the validation of `EasySwoole\Validate\Validate` object, return the result of success/failed validation, and implement the code:
````php
protected function validate(Validate $validate)
{
    return $validate->validate($this->request()->getRequestParam());
}
````

You can use this method to verify the data sent by the client:
````php
function index()
{
    $validate = new Validate();
    $validate->addColumn('name','name')->required()->lengthMax(50);
    // Limit name mandatory and not more than 50 strings
    if (!$this->validate($validate)){
        $this->writeJson(400, [], $validate->getError()->__toString());
        return false;
    }
    $this->writeJson(200, [], 'success');
}
````
> More details about `Validate`, please go to [validate](../Components/validate.md)
 
