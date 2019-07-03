<head>
     <title>EasySwoole route|swoole route|swoole Api service|swoole custom route</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole route|swoole route|swoole Api service|swoole custom route"/>
     <meta name="description" content="EasySwoole route|swoole route|swoole Api service|swoole custom route"/>
</head>
---<head>---

##Custom routing

> Reference demo: [Router.php](https://github.com/easy-swoole/demo/blob/3.x/App/HttpController/Router.php)

EasySwoole supports custom routing, and its routing is implemented using [fastRoute](https://github.com/nikic/FastRoute), so its routing rules are consistent with it. Refer to the [GitHub document](https://github.com/nikic/FastRoute/blob/master/README.md) for detailed documentation of the component.
### Sample code:  
New create App\HttpController\Router.php:  
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/8/15
 * Time: 上午10:39
 */

namespace App\HttpController;


use EasySwoole\Http\AbstractInterface\AbstractRouter;
use FastRoute\RouteCollector;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;

class Router extends AbstractRouter
{
  function initialize(RouteCollector $routeCollector)
      {
  // TODO: Implement initialize() method.
          $routeCollector->get('/user', '/index.html');
          $routeCollector->get('/rpc', '/Rpc/index');
  
          $routeCollector->get('/', function (Request $request, Response $response) {
              $response->write('this router index');
          });
          $routeCollector->get('/test', function (Request $request, Response $response) {
              $response->write('this router test');
              return '/a';//Repositioning to /a method
          });
          $routeCollector->get('/user/{id:\d+}', function (Request $request, Response $response) {
              $response->write("this is router user ,your id is {$request->getQueryParam('id')}");//Get the id of the routing match
              return false;//End the response without further requests
          });
  
      }
}
```
Visit 127.0.0.1:9501/rpc,Corresponding toApp\HttpController\Rpc.php->index()  
> If a callback function is used to handle routing, return false represents no further requests and cannot trigger methods such as `afterAction', `gc', etc.

Implementation code:

````php
<?php
/*
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
````

### Global mode interception
Add the following code to Router. PHP to turn on global mode interception
```php
$this->setGlobalMode(true);
```
Under global mode interception, the routing will only match the response of the controller method in Router.php, and the default parsing of the framework will not be performed.

### Exception error handling  
By using the following two methods, routing matching errors and callbacks that have not been found can be set up:
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
>The callback function is only for the fastRoute mismatch. If the response to the request is not terminated in the callback, the request will continue to Dispatch and try to find the corresponding controller for response processing.  



### FastRoute uses

addRoute
------

The prototype of the `addRoute'method for defining routing is as follows. This method requires three parameters. Here we have a deeper understanding of the routing components around these three parameters.

```
$routeCollector->addRoute($httpMethod, $routePattern, $handler)
```

#### httpMethod
------
This parameter needs to be passed in an uppercase HTTP method string, specifying the method that routing can intercept, and a single method directly into the string. It needs to intercept multiple methods that can be passed into a one-dimensional array, as follows:

```
// Intercepting GET Method
$routeCollector->addRoute('GET', '/router', '/Index');

// Intercepting POST Method
$routeCollector->addRoute('POST', '/router', '/Index');

// Intercepting multiple methods
$routeCollector->addRoute(['GET', 'POST'], '/router', '/Index');

```

#### routePattern
------
When a routing matching expression is passed in, the routing that meets the requirement of the expression will be intercepted and processed. The expression supports placeholder matching such as {parameter name: matching rule} for defining routing parameters.

#### Basic Matching

The following definitions will match `http://localhost:9501/users/info`

```
$routeCollector->addRoute('GET', '/users/info', 'handler');
```

#### Binding parameters
The following definition takes the following part of `/users/` as a parameter, and the qualified parameter can only be the number `[0-9]'.`

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
> Binding parameters will be assembled from within the framework into get data, calling methods:
````php
<?php
$routeCollector->get('/user/{id:\d+}', function (Request $request, Response $response) {
    $response->write("this is router user ,your id is {$request->getQueryParam('id')}");
    return false;
});
````


#### handler
------
To specify the method to be processed after successful routing matching, a closure can be passed in. When the incoming closure is passed in, we must ** pay attention to the end of the response after processing is completed ** otherwise the request will continue to be processed by Dispatch to find the corresponding controller. Of course, if this is used, some requests can also be processed and handed over. Controller Execution Logic
```php
// The case of incoming closure
$routeCollector->addRoute('GET', '/router/{id:\d+}', function (Request $request, Response $response) {
    $id = $request->getQueryParam('id');
	$response->write('Userid : ' . $id);
	return false;
});

```

It can also be passed directly into the controller path.

```
$routeCollector->addRoute('GET', '/router2/{id:\d+}', '/Index');
```

> For more details, please check FastRouter directly.
