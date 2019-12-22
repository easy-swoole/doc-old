---
title: routing
meta:
  - name: description
    content: easyswoole,routing,Swoole routing component,swoole api,Swoole custom routing,restful
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|routing|Swoole routing component|swoole api|Swoole custom routing|restful
---

## Custom routing


::: warning 
 Reference Demo: [Router.php](https://github.com/easy-swoole/demo/blob/3.x/App/HttpController/Router.php)
:::

EasySwoole supports custom routing, and its routing is implemented by [fastRoute] (https://github.com/nikic/FastRoute), so its routing rules are consistent with it. For detailed documentation of this component, please refer to [GitHub documentation] (https://github.com/nikic/FastRoute/blob/master/README.md)

### Sample Code:
Create a new file App\HttpController\Router.php:
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
        $routeCollector->get('/user', '/index.html');
        $routeCollector->get('/rpc', '/Rpc/index');

        $routeCollector->get('/', function (Request $request, Response $response) {
            $response->write('this router index');
        });
        $routeCollector->get('/test', function (Request $request, Response $response) {
            $response->write('this router test');
            return '/a';//Relocate to the /a method
        });
        $routeCollector->get('/user/{id:\d+}', function (Request $request, Response $response) {
            $response->write("this is router user ,your id is {$request->getQueryParam('id')}");//Get the id of the route match
            return false;//No longer request, end this response
        });

    }
}
```
Visit 127.0.0.1:9501/rpc, corresponding to App\HttpController\Rpc.php->index()

::: warning
  If the callback function is used to process the route, return false means that the request is not continued, and the method `afterAction`, `gc` cannot be triggered.
:::

> Implementation principle can be viewed in the source code

### Routing Group
```php
class Router extends AbstractRouter
{
    function initialize(RouteCollector $routeCollector)
    {
        $routeCollector->addGroup('/admin',function (RouteCollector $collector){
            $collector->addRoute('GET','/index.html',function (Request $request,Response $response){
                $version = $request->getQueryParam('version');
                // Here you can return the path according to the version parameter
                if($version == 1){
                    $path = '/V1'.$request->getUri()->getPath();
                }else{
                    $path = '/V2'.$request->getUri()->getPath();
                }
                //New path
                return $path;
            });
        });
    }
}
```

### Global Mode Intercept
Add the following code in Router.php to enable global mode interception
```php
$this->setGlobalMode(true);
```
Under global mode interception, the route will only match the controller method response in Router.php, and the default parsing of the framework will not be performed.

### Exception error handling
The following two methods can be used to set the route matching error and the callback of the method not found:
```php
<?php
$this->setMethodNotAllowCallBack(function (Request $request,Response $response){
    $response->write('No processing method found');
    return false;//End this response
});
$this->setRouterNotFoundCallBack(function (Request $request,Response $response){
    $response->write('Route matching not found');
    return 'index';//Redirect to index route
});
```

::: warning 
The callback function is only for the fastRoute unmatched condition. If the callback does not end the request response, the request will continue to Dispatch and try to find the corresponding controller for response processing.
:::


### fastRoute use

addRoute method
------

The prototype of the `addRoute` method that defines the route is as follows. This method requires three parameters. Below we have a deeper understanding of the routing components.

```php
$routeCollector->addRoute($httpMethod, $routePattern, $handler)
```

#### httpMethod
------
This parameter needs to pass in an uppercase HTTP method string, specifying the method that the route can intercept. A single method directly passes the string. You need to intercept multiple methods to pass in a one-dimensional array, as in the following example:

```php
// Intercept GET method
$routeCollector->addRoute('GET', '/router', '/Index');

// Intercept POST method
$routeCollector->addRoute('POST', '/router', '/Index');

// Intercept multiple methods
$routeCollector->addRoute(['GET', 'POST'], '/router', '/Index');

```

#### routePattern
------
Passing a route matching expression, the route that meets the expression requirements will be intercepted and processed. The expression supports placeholder matching such as {parameter name: matching rule}, which is used to qualify routing parameters.

#### Basic match

The following definition will match `http://localhost:9501/users/info`

```php
$routeCollector->addRoute('GET', '/users/info', 'handler');
```
#### Binding parameters
The following definition takes the part after `/users/` as a parameter, and the qualified parameter can only be the number `[0-9]`

```php
// can match: http://localhost:9501/users/12667
// Can't match: http://localhost:9501/users/abcde

$routeCollector->addRoute('GET', '/users/{id:\d+}', 'handler');

```

The following definitions are not restricted, only the matching URL part is taken as a parameter.

```php
// can match: http://localhost:9501/users/12667
// can match: http://localhost:9501/users/abcde

$routeCollector->addRoute('GET', '/users/{name}', 'handler');
```

Sometimes the partial location of the route is optional and can be defined as follows

```php
// can match: http://localhost:9501/users/to
// can match: http://localhost:9501/users/to/username

$routeCollector->addRoute('GET', '/users/to[/{name}]', 'handler');
```

::: warning
The bound parameters will be assembled into the get data by the inside of the framework.
:::

````php
<?php
$routeCollector->get('/user/{id:\d+}', function (Request $request, Response $response) {
    $response->write("this is router user ,your id is {$request->getQueryParam('id')}");
    return false;
});
````


#### handler
------
Specify the method that needs to be processed after the route is successfully matched. You can pass in a closure. When passing in the closure, you must pay attention to the end of the response after processing. Otherwise, the request will continue to Dispatch to find the corresponding controller to handle. Of course, if you take advantage of this, you can also process some requests and then pass them to the controller execution logic.

```php
// Incoming closures
$routeCollector->addRoute('GET', '/router/{id:\d+}', function (Request $request, Response $response) {
     $id = $request->getQueryParam('id');
$response->write('Userid : ' . $id);
Return false;
});

```

Can also be directly passed to the controller path

```php
$routeCollector->addRoute('GET', '/router2/{id:\d+}', '/Index');
```


::: warning
  For more details on usage, please check the FastRouter directly.
:::
