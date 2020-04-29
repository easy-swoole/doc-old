---
title: Controller
meta:
  - name: description
    content: Easyswoole controller description
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Controller|Swoole api service|Swoole controller pool
---

# Controller object
The controller object is an object in the http component that facilitates interaction between the client and the server. It uses the object pool object reuse pattern and injects `request` and `response` objects for data interaction.

## Object pool mode

The http controller object uses the object pool mode to get the created object.
E.g:

 * User A requests `/Index` through url parsing and routing forwarding, and locates the `App\HttpController\Index.php` controller.
 * Since it is the first request, `new App\HttpController\Index.php` and save the object in the object pool
 * The object pool is dequeued, the object is obtained, and the index method is called to process the request.
 * After processing, reset the object's properties to the default value, the object recycles the object pool
 * User B requests `/Index` through url parsing and routing forwarding, and locates the `App\HttpController\Index.php` controller
 * Because it is a secondary request, the object pool directly obtains the first object, does not need new, directly calls the `index` method for processing
 

::: warning 
 The object pool mode implements different requests to reuse the same object, reducing the overhead of creating/destroying objects. The constructor is called only when the object is requested for the first time, and will not be called again when the object is acquired for the second time. The pool mode does not reset the static attribute and the private private attribute. These two attributes will be reused. The object pool mode is for a single process, and the object pools of multiple work processes are not shared.
 :::
 
 ## Convention specification
 
 - The class name and class file (folder) in the project are named, both are big hump, and the variable and class method are small hump.
 - In the HTTP response, echo $var in the business logic code does not output the $var content to the corresponding content. Please call the wirte() method in the Response instance.
 
     
 ## object method
 
 ### Scheduling class method
 
 * action
 
  `action` is the final method executed by the controller. According to the matching of the routes, different controller methods are executed, such as the default `index` method, such as the `test` method that accesses the final parsing of `ip/Index/test`. , can be called `action` execution method.
 
 
 ::: warning
  The action method can return a string, allowing the framework to schedule controller methods again, for example:
:::

 
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
        return '/test2';//After executing the test method, return /test2 to let the framework continue to dispatch the /test2 method.
    }

    function test2()
    {
        $this->response()->write('this is test2');
        return true;
    }
}
```

::: warning 
The returned string will be parsed by the `url parsing rule` and the `route route` rule, but it should be noted that the A method must not return the B method, and the B method returns the string of the A method, otherwise an infinite loop call will occur.
:::

    
 

* onRequest    

 
```php

protected function onRequest(?string $action): ?bool  
{
    return true;   
}

```


The event when the controller method is ready to process the request. If the method returns false, it will not continue to execute.
Can be used to do controller base class permission verification, etc., for example:  
```php
function onRequest(?string $action): ?bool
{
    if (parent::onRequest($action)) {
        //Determine whether to log in
        if (1/*Fake code*/) {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'Login has expired');
            return false;
        }
        return true;
    }
    return false;
}
```

* afterAction   
This method will be called when the controller method finishes executing, and the logic such as data recovery can be customized.

* index
Index is an abstract method that represents the inheritance of the controller object and needs to implement the method. index will become the default controller method.

* actionNotFound
When the request method is not found, the method is called automatically, and the method can be overridden to implement its own logic.

::: warning
  This method can be understood as `default method`, similar to the `index` method, so after the call, it will also trigger `afterAction`, `gc` and other methods.
:::

* onException
This method is called when the controller logic throws an exception (the framework has already handled the exception by default)
You can override this method to perform custom exception handling, for example:
```php
function onException(\Throwable $throwable): void
{
    // Directly respond to the front end 500 and output the system busy
    $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
    $this->response()->write('The system is busy, please try again later');
}
```

::: warning 
 More controller exceptions can be found in [Error and Exception Interception] (exception.md)
:::

* gc  
```php
protected function gc()
{
    // TODO: Implement gc() method.
    if ($this->session instanceof SessionDriver) {
        $this->session->writeClose();
        $this->session = null;
    }
    //Restore Defaults
    foreach ($this->defaultProperties as $property => $value) {
        $this->$property = $value;
    }
}
```
The gc method will be called automatically after executing `method`, `afterAction`
Reset controller properties to default values, turn off `session`
Can be covered by the implementation of other gc recycling logic.

### Request response class method
* request
After the request method is called, the `EasySwoole\Http\Request` object will be returned.
This object comes with all the data requested by the user, for example:
```php
function index()
{
    $request = $this->request();
    $request->getRequestParam();//Get post/get data, get overwrite post
    $request->getMethod();//Get request method (post/get/)
    $request->getCookieParams();//Get the cookie parameter
}
```

::: warning 
 More request related can view [request object] (request.md)
:::

* response  
The response method will return `EasySwoole\Http\Response` to respond to the client with data, for example:
```php
function index()
{
    $response = $this->response();
    $response->withStatus(200);//Set response status code, must be set
    $response->setCookie('name','Alan',time()+86400,'/');//Set a cookie
    $response->write('hello world');//Send a piece of data to the client (similar to the echo of the regular web mode)
}
```

::: warning 
 For more information about response, see [response object] (response.md)
:::

* writeJson  
 The writeJson method directly encapsulates the set response status code, sets the response header, and the array is converted to json output.
```php
function index()
{
 $this->writeJson(200,['xsk'=>'Alan'],'success');
}
```
Web page output:
```
{"code":200,"result":{"xsk":"仙士可"},"msg":"success"}
```

### Deserialization method
* json
  Parse a json string with json_decode
* xml
  Parse xml string using simpleml_load_string
 
### session related
* sessionDriver
   Set the session driver class, the default is `EasySwoole\Http\Session\SessionDriver`
* session
  Return the session driver class to manage the session
 
### Verify related
* validate
  The validate method can directly call the validation of the `EasySwoole\Validate\Validate` object, returning the result of the validation success/failure, and implementing the code:
```php
protected function validate(Validate $validate)
{
    return $validate->validate($this->request()->getRequestParam());
}
```
We can use this method to verify the data sent by the client:
```php
function index()
{
    $validate = new Validate();
    $validate->addColumn('name','Name')->required()->lengthMax(50);
    // Restricted name is required and cannot be greater than 50 strings
    if (!$this->validate($validate)){
        $this->writeJson(400, [], $validate->getError()->__toString());
        return false;
    }
    $this->writeJson(200, [], 'success');
}
```

::: warning 
More validate related can be found [verifier] (./validate.md)
:::

 
