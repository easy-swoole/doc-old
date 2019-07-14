<head>
     <title>EasySwoole controller|swoole controller|swoole Api service</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Parse URL |EasySwoole Http Doc|swoole Api service"/>
     <meta name="description" content="EasySwoole: URL parser and routers"/>
</head>
---<head>---

# URL parsing rules

Only `PATHINFO` mode URL parsing is supported and consistent with the controller name (method). 
The controller search rule is preferred to complete matching mode.

> More detail of `PATHINFO`, please refer to <a target="_blank" href="https://www.php.net/manual/en/function.pathinfo.php">PHP: pathinfo</a>

## Rules

Without routing intervention, the built-in parsing rules support infinitely nested directories, as shown in the following two examples:

> <http://serverName/api/auth/login>
>
> The corresponding execution method is `\App\HttpController\Api\Auth::login()`
>
> <http://serverName/a/b/c/d/f>
>
> If `f` was referred to a controller, the method of execution is `\App\HttpController\A\B\C\D\F::index()`
>
> If f was referred to a method, the method to execute is `\App\HttpControllers\A\B\C\D::f()`
>
> If the final path was `index`, then it would be ignored and the default method of the controller `index()` would be called directly.

Implementation code:
```php
<?php 
    // Refer to: EasySwoole\Http\Dispatcher::controllerHandler()
    
    //If the request is /index/index, or /abc/index
    //The last index character will be automatically deleted, $path has been processed as /index or /abc
    $pathInfo = ltrim($path,"/");
    $list = explode("/",$pathInfo);
    $actionName = null;
    $finalClass = null;
    $controlMaxDepth = $this->maxDepth;
    $currentDepth = count($list);
    $maxDepth = $currentDepth < $controlMaxDepth ? $currentDepth : $controlMaxDepth;
    while ($maxDepth >= 0){//Analytical Hierarchy
        $className = '';
        //According to the requested path, the string is parsed layer by layer to capitalize the initial letter, and the validity of the string is judged. If the string is invalid, the default is Index.
        for ($i=0 ;$i<$maxDepth;$i++){
            $className = $className."\\".ucfirst($list[$i] ?: 'Index');//Serve Index for primary controller
        }
        //If the controller is found, the loop exits
        if(class_exists($this->controllerNameSpacePrefix.$className)){
            //ActionName after trying to get the class
            $actionName = empty($list[$i]) ? 'index' : $list[$i];
            $finalClass = $this->controllerNameSpacePrefix.$className;
            break;
        }else{
            //Attempt to Search Index Controller
            $temp = $className."\\Index";
            if(class_exists($this->controllerNameSpacePrefix.$temp)){
                $finalClass = $this->controllerNameSpacePrefix.$temp;
                //ActionName after trying to get the class
                $actionName = empty($list[$i]) ? 'index' : $list[$i];
                break;
            }
        }
        $maxDepth--;
    }
```

## Analytical Hierarchy

In theory, `EasySwoole` supports infinite levels of URL to controller mapping, but for the efficiency reason and malicious URL access prevention, the max levels of URI is set to 3 by default. 
If you need more than 3 levels URL in your application, please inject a constant `SysConst:: HTTP_CONTROLLER_MAX_DEPTH` into DI in the framework initialization event, which is the maximum level of URL parsing. The following code allows Maximum parsing of URLs to 5 levels
```php
public static function initialize()
{
	Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);
}
```

## Special cases
When the controller and method are `index`, they could be omitted.

If the `action` is `index()`, you can simple set the URL as <http://serverName/api/User>
> The corresponding execution method is `\App\HttpController\Api\User::index()`

If both the controller and the method are `Index`, they could be omitted from URL:
> The corresponding execution method is `\App\HttpController\Index::index()`
> URL can be written directly <http://serverName/>   

Index ignores the rule theory and supports infinite hierarchy, searching layer by layer according to the maximum of analytic hierarchy:
> Target URL: <http://serverName>
>
> Step 1: Checking `\App\HttpController\Index.php`, if it does not exist, `EasySwoole` will keep looking deeper, layer by layer, until it gets the maximum depth.
>
> Step 2: \App\HttpController\Index\Index::index()
>
> Step 3: \App\HttpController\Index\Index\Index::index()
>
> Reach the maximum depth, which is 3.


> Note that EasySwoole's URL path is case-sensitive, and the controller initials support lowercase conversion