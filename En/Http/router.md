<head>
     <title>EasySwoole route|swoole route|swoole Api service|swoole custom route</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole route|swoole route|swoole Api service|swoole custom route"/>
     <meta name="description" content="EasySwoole route|swoole route|swoole Api service|swoole custom route"/>
</head>
---<head>---

## Custom routes

> Reference demo: [Router.php](https://github.com/easy-swoole/demo/blob/3.x/App/HttpController/Router.php)

`EasySwoole` supports custom routes using [fastRoute](https://github.com/nikic/FastRoute), 
so its routing rules are consistent with it. Refer to the [GitHub document](https://github.com/nikic/FastRoute/blob/master/README.md) for detailed documentation of the component.

### Sample code:  
Create a new `App\HttpController\Router.php` in your application:  
```php
<?php
namespace App\HttpController;

use EasySwoole\Http\AbstractInterface\AbstractRouter;
use FastRoute\RouteCollector;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;

class Router extends AbstractRouter
{
  function initialize(RouteCollector $routeCollector)
      {
          // Implement initialize() method.
          $routeCollector->get('/user', '/index.html');
          $routeCollector->get('/rpc', '/Rpc/index');
  
          $routeCollector->get('/', function (Request $request, Response $response) {
              $response->write('this router index');
          });
          $routeCollector->get('/test', function (Request $request, Response $response) {
              $response->write('this router test');
              return '/a'; // Redirect to /a action
          });
          $routeCollector->get('/user/{id:\d+}', function (Request $request, Response $response) {
              $response->write("this is router user ,your id is {$request->getQueryParam('id')}"); // Get the id of the routing match
              return false; // End point cause return false
          });
  
      }
}
```
Visit `http://your-domain-or-ip:9501/rpc`, Corresponding to `App\HttpController\Rpc.php::index()` 
> If a callback function is used to handle routing, return a `false` at the end of the callback function means to inform `EasySwoole`
> to stop any further actions, including `afterAction`, `gc`, and etc.

Source code:

```php
<?php
/**
 * @file EasySwoole\Http\Dispatcher
 * 
 * Make an initialization decision
 */
if($this->router === null){
    $class = $this->controllerNameSpacePrefix.'\\Router';
    try{
        if(class_exists($class)){//If there is a router class
            $ref = new \ReflectionClass($class);
            if($ref->isSubclassOf(AbstractRouter::class)){
                $this->routerRegister =  $ref->newInstance();
                $this->router = new GroupCountBased($this->routerRegister->getRouteCollector()->getData());//The configuration data of router class is extracted after fastroute processing
            }else{
                $this->router = false;
                throw new RouterError("class : {$class} not AbstractRouter class");
            }
        }else{
            $this->router = false;
        }
    }catch (\Throwable $throwable){
        $this->router = false;
        throw new RouterError($throwable->getMessage());
    }
}
$path = UrlParser::pathInfo($request->getUri()->getPath());
if($this->router instanceof GroupCountBased){
    $handler = null;
    $routeInfo = $this->router->dispatch($request->getMethod(),$path);
    if($routeInfo !== false){
        switch ($routeInfo[0]) {//No routing match was found
            case \FastRoute\Dispatcher::NOT_FOUND:{
                $handler = $this->routerRegister->getRouterNotFoundCallBack();
                break;
            }
            case \FastRoute\Dispatcher::METHOD_NOT_ALLOWED:{//No disposal method found
                $handler = $this->routerRegister->getMethodNotAllowCallBack();
                break;
            }
            case \FastRoute\Dispatcher::FOUND:{
                $handler = $routeInfo[1];
                //Merge parsed data
                $vars = $routeInfo[2];
                $data = $request->getQueryParams();
                $request->withQueryParams($vars+$data);//Insert data into get data
                break;
            }
            default:{
                $handler = $this->routerRegister->getRouterNotFoundCallBack();
                break;
            }
        }
    }
    //If handler is not null, then it is not \FastRoute\Dispatcher::FOUND, so execute
    if(is_callable($handler)){
        try{
            //If you return a URL path directly
            $ret = call_user_func($handler,$request,$response);
            if(is_string($ret)){
                $path = UrlParser::pathInfo($ret);
            }else if($ret == false){
                return;
            }else{
                //It is possible to override the URL PATH in the callback
                $path = UrlParser::pathInfo($request->getUri()->getPath());
            }
            $request->getUri()->withPath($path);
        }catch (\Throwable $throwable){
            $this->hookThrowable($throwable,$request,$response);
            //When an exception occurs, do not dispatch down
            return;
        }
    }else if(is_string($handler)){
        $path = UrlParser::pathInfo($handler);
        $request->getUri()->withPath($path);
        goto response;
    }
    /*
        * When in global mode, intercept. Non-global mode, otherwise continue
    */
    if($this->routerRegister->isGlobalMode()){
        return;
    }
}
```

### Global mode interception
Add the following code to `App\HttpController\Router.php` to turn on global mode interception
```php
$this->setGlobalMode(true);
```
When the global mode interception is on, the routing will only match the response of the controller method in Router.php, and the default parsing of the framework will not be performed.

### Exception error handling
The following 2 examples show how to set callback function for the `MethodNotAllow` and the `RouterNotFound` in `App\HttpController\Router.php`:
```php
<?php
$this->setMethodNotAllowCallBack(function (Request $request,Response $response){
    $response->write('No disposal method found');
    return false;//End this response
});
$this->setRouterNotFoundCallBack(function (Request $request,Response $response){
    $response->write('No routing match was found');
    return 'index';//Redirect to index routing
});
```
>The callback function is only for the fastRoute mismatch. If the response to the request is not terminated in the callback, the request will be continuously dispatched until the corresponded controller was located.  



### The usage of FastRoute

addRoute
------

The prototype of the `addRoute` method:

```php
$routeCollector->addRoute($httpMethod, $routePattern, $handler)
```

#### $httpMethod parameter
------
An uppercase string or an array, specifying which HTTP method/s that shall be intercepted.

```
// Intercepting GET Method
$routeCollector->addRoute('GET', '/router', '/Index');

// Intercepting POST Method
$routeCollector->addRoute('POST', '/router', '/Index');

// Intercepting GET and POST method
$routeCollector->addRoute(['GET', 'POST'], '/router', '/Index');
```

#### $routePattern parameter
------
When a routing matching expression is passed in, the routing that meets the requirement of the expression will be intercepted and processed. The expression supports placeholder matching such as {parameter name: matching rule} for defining routing parameters.

#### Basic Matching

The following definitions will match `http://localhost:9501/users/info`

```
$routeCollector->addRoute('GET', '/users/info', 'handler');
```

#### Binding parameters
The following definition takes the following part of `/users/` as a parameter, and the qualified parameter format is constrained with `[0-9]'.`

```
// Matching: http://localhost:9501/users/12667
// Unmatchable: http://localhost:9501/users/abcde

$routeCollector->addRoute('GET', '/users/{id:\d+}', 'handler');

```

The following definition does not restrict anything but takes the matched URL part as a parameter

```
// Matching: http://localhost:9501/users/12667
// Unmatchable: http://localhost:9501/users/abcde

$routeCollector->addRoute('GET', '/users/{name}', 'handler');
```

Sometimes part of the routing location is optional and can be defined as follows

```
// Matching: http://localhost:9501/users/to
// Unmatchable: http://localhost:9501/users/to/username

$routeCollector->addRoute('GET', '/users/to[/{name}]', 'handler');
```
> Binding parameters will be assembled from within the framework into query parameter, for example:
````php
<?php
$routeCollector->get('/user/{id:\d+}', function (Request $request, Response $response) {
    $response->write("this is router user ,your id is {$request->getQueryParam('id')}");
    return false;
});
````


#### $handler parameter
------
To specify the method to be processed after successful routing matching, a closure can be passed in. 
When a closure is passed in, you must ** return a `false` at the end to terminate any further actions **, 
otherwise the `Dispatcher` is going to keep looking other corresponding controller except you want it to.
```php
<?php
    // The case of incoming closure
    $routeCollector->addRoute('GET', '/router/{id:\d+}', function (Request $request, Response $response) {
        $id = $request->getQueryParam('id');
        $response->write('Userid : ' . $id);
        
        // Terminate any further actions
        return false;
    });
```

You may pass in a controller path as well:
```
$routeCollector->addRoute('GET', '/router2/{id:\d+}', '/Index');
```

> For more details, please check `FastRouter` directly.
