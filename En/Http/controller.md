<head>
     <title>EasySwoole controller|swoole controller|swoole Api service</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole controller|swoole controller|swoole Api service"/>
     <meta name="description" content="EasySwoole controller|swoole controller|swoole Api service"/>
</head>
---<head>---

# Controller object
Controller object is an object in HTTP component that facilitates interaction between client and server. It uses object pool object reuse mode and injects `request'and `response' objects for data interaction.

## Object Pool mode/
The object pool mode is adopted to acquire the created objects for the control objects of http.
For example:
* User A requests `Index`, after URL parsing and routing forwarding, locates `App HttpController Index. php', the controller
* Since this is the first request, `new \App\HttpController\Index. php', and store the object in the object pool
* The object pool is listed, the object is fetched, and the index method is called to process the request.
* After processing, the property of the object is reset to the default value, and the object pool is reclaimed.
* User B requests `Index`, after URL parsing and routing forwarding, locates `App\HttpController\Index.php', the controller
* Because it's a second request, the object pool gets the first object directly without requiring new, and calls the index method directly for processing.
 
> Object pool pattern enables different requests to reuse the same object and reduces the overhead of creating/destroying objects.
> The constructor is called only on the first request to create an object, and will not be called again on the second request to obtain an object.
> Object pool schema does not reset static and private attributes, which will be reused
> Object pool pattern is for a single process, and object pools of multiple work processes are not shared.


    
## Object method   
### Scheduling class method   
 * "action"     
 "Action" is the method that the controller finally executes. According to the matching of routes, different controller methods can be executed, such as `index'method which is executed by default, and `test' method which is finally resolved by accessing `ip/index/test', which can be called `action'execution method.
> The action method can return a string so that the framework can schedule the controller method again, for example: 

 
````php  
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
        return '/test2';//When the test method has been executed, return to /test2 and let the framework continue scheduling /test2 methods.
    }

    function test2()
    {
        $this->response()->write('this is test2');
        return true;
    }
}
````   
> The returned string will be parsed by `url parsing Rules'and `route routing' rules
> However, it should be noted that method A should not return method B, method B should return the string of method A, otherwise infinite dead-loop calls will occur.
    
 

 * onRequest    

 
````php
<?php 
protected function onRequest(?string $action): ?bool  
{
    return true;   
}

````  


Events when preparing to call the controller method to process the request, if the method returns false, it will not continue to execute.
It can be used to verify the privileges of the base class of the controller, for example:
````php
function onRequest(?string $action): ?bool
{
    if (parent::onRequest($action)) {
        //Determine whether to log in or not
        if (1/*Pseudo-code*/) {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'Logon has expired');
            return false;
        }
        return true;
    }
    return false;
}
````

 * afterAction   
When the controller method is executed, the method will be called to customize logic such as data recovery.

 * index  
Index is an abstract method, representing the need to implement this method for inheriting controller objects. Index will become the default controller method.

 * actionNotFound  
When the request method is not found, the method is called automatically, and the method can be overwritten to realize its own logic.
This method can be understood as the `default method', similar to the `index'method, so the `afterAction', `gc', and other methods will be triggered after the call is completed.
 * onException  
When the controller logic throws an exception, this method is called to handle the exception (the framework has handled the exception by default).
This method can be overridden for custom exception handling, such as:
````php
function onException(\Throwable $throwable): void
{
    //Direct response to front-end 500 and busy output system
    $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
    $this->response()->write('The system is busy. Please try again later. ');
}
````
> More Controller Abnormalities can be seen[Error and exception interception](exception.md)
 * gc  
````php
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
````
The gc method will be called automatically after execution of `method', `afterAction'.
Reset the controller property to the default value and close `session'.`
Other gc recovery logic can be implemented by self-coverage.

### Request Response Class Method
 * request   
After the request method is called, the `EasySwoole\HttpRequest'object is returned.
This object comes with all the data requested by the user, such as:
````php
function index()
{
    $request = $this->request();
    $request->getRequestParam();//Get post/get data, get overrides post
    $request->getMethod();//Get the request mode (post/get/)
    $request->getCookieParams();//Get cookie parameters
}
````
> More requests are available[request object](request.md)
 * response  
The response method returns `easywoole\http\response`for responding to data to the client, such as:
````php
function index()
{
    $response = $this->response();
    $response->withStatus(200);//To set the response status code, you must set it
    $response->setCookie('name','仙士可',time()+86400,'/');//Setting up a cookie
    $response->write('hello world');//Send a piece of data to the client (echo similar to regular web mode)
}
````  
> More responses are available[response object](response.md)
 * writeJson  
The writeJson method directly encapsulates the setting of response status code, the setting of response header and the conversion of array to JSON output.
````php
function index()
{
 $this->writeJson(200,['xsk'=>'test data'],'success');
}
````
Page Output:
````
{"code":200,"result":{"xsk":"test data"},"msg":"success"}
````

### Deserialization method
 * json  
Resolving JSON strings using json_decode
 * xml  
 Parsing XML strings using simplexml_load_string

 
### Session correlation
 * sessionDriver  
  Set the session driver class by default`EasySwoole\Http\Session\SessionDriver`
 * session  
Return the session driver class to manage the session 
### Verification correlation
 * validate
 The validate method can directly invoke the validation of `EasySwoole\Validate\Validate'object, return the result of successful/failed validation, and implement the code:
````php
protected function validate(Validate $validate)
{
    return $validate->validate($this->request()->getRequestParam());
}
````
We can use this method to verify the data sent by the client:
````php
function index()
{
    $validate = new Validate();
    $validate->addColumn('name','name')->required()->lengthMax(50);
    //Limit name mandatory and not more than 50 strings
    if (!$this->validate($validate)){
        $this->writeJson(400, [], $validate->getError()->__toString());
        return false;
    }
    $this->writeJson(200, [], 'success');
}
````
> More validate related can be seen[validate](../Components/validate.md)
 
