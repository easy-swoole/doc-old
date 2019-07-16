<head>
     <title>EasySwoole controller|swoole controller|swoole Api service</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole controller|swoole controller|swoole Api service"/>
     <meta name="description" content="EasySwoole controller|swoole controller|swoole Api service"/>
</head>
---<head>---

# The Controller Object
A controller is a PHP object you create that reads information from the `request` object and creates and returns a `response` object.
`EasySwoole` has implemented the `object pool pattern` to allow you access the `controller` object, the `request` object and the `response` object.

## Object pool pattern
The object pool pattern is a software creational design pattern that uses a set of initialized objects kept ready to use – a `pool` – rather than allocating and destroying them on demand.
For example:
* The first client requests the `Index` resource, after the URL parsing and the route forwarding, the request is dispatched to the controller: `App\HttpController\Index.php`.
* Since this is the first request, an instance of `App\HttpController\Index` will be initialised then stored in the object pool.
* The controller object is fetched from the pool, then the `index()` method is called to handle the request.
* After processing, the properties of the object will be reset to the default value, and the object pool is reclaimed.
* The next client requests `Index` resource, it will be dispatched to the controller: `App\HttpController\Index.php` as the before.
* Instead of creating a new object, at this time, the object pool will get the existed `App\HttpController\Index` object from the pool straight away and invoke the `index()` method.
 
> Object pool pattern enables different requests to reuse the same object and reduces the overhead of creating/destroying objects.
> The constructor is only called ONCE on the first request to create a new object.
> Object pool schema does not reset the static and private attributes, their states are remained.
> Object pool pattern is attached to its own worker process, but NOT shared by multiple worker processes.
    
## The Controller Object's methods  
### Scheduling class method   
 * action    
 "Action" is the method that the controller finally executes. According to the matching of routes, different controller methods can be executed, 
 such as `index()` method which is executed by default; Or the `test()` method which is finally resolved by requesting `ip/index/test`. They all can be called `action` execution method.
> The action method can return a string value to chain another controller's method, for example: 

```php
<?php
    namespace App\HttpController;
    
    use EasySwoole\EasySwoole\Trigger;
    use EasySwoole\Http\AbstractInterface\Controller;
    use EasySwoole\Http\Message\Status;
    class Index extends Controller
    {
        // Demo: actions chaining
        // The request comes to here first
        function index()
        {
            $this->writeJson(200, [], 'success');
            return '/test'; // Which will call test() method
        }
    
        function test()
        {
            $this->response()->write('this is test');
            return '/test2'; // Which wil cause the framework to call test2() method.
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
    
 
 * onRequest method (hook)

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

 * afterAction method (hook)
When the controller's `action` method is executed, this `afterAction` method will be called. You may put your customize logic code here such as data recovery.

 * index function (default action)
The `index()` is an abstract method which is defined in the parent abstract `EasySwoole\Http\AbstractInterface\Controller` class, 
you have to implement this method in your own controllers as the controller's default `action`.

 * actionNotFound method (hook) 
When the requested `action` method is not exist, the `actionNotFound` method will be called automatically. Please feel free to override this method on your own purpose.

> This method can be considered as the `default` action of your plan B. The `afterAction`, `gc`, and other methods will be triggered after the call is completed.
> The difference between the `index` and the `actionNotFound` is: 
> * In case of the `action` is not provided in the url, `index` will be called. For instance: http://my-domain-or-ip:9501/MyController
> * In case of the `action` is provided in the url but not exist in the controller, `actionNotFound` will be called. For instance: http://my-domain-or-ip:9501/MyController/missing_action

 * onException function
 
When the controller logic throws an exception, the `onException` method will be called to handle the exception.
The `EasySwoole` framework has handled the exception by default, but you may feel free to do it with your way by overriding this function, for example:
```php
<?php

function onException(\Throwable $throwable): void
{
    // Direct response a status code: 500 to inform the client that the system is busy
    $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
    $this->response()->write('The system is busy. Please try again later. ');
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

### Request and Response
 * request method
After the `request()` method is called, the `EasySwoole\HttpRequest'object is returned.
This object comes with all the data from the client, such as:
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

 * response method 
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
 
