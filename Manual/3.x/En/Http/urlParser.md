# URL parsing rules

Only `PATHINFO'mode URL parsing is supported and consistent with the controller name (method). The controller search rule is preferred to complete matching mode.
## Analytical Rules

Without routing intervention, the built-in parsing rules support infinitely nested directories, as shown in the following two examples

> <http://serverName/api/auth/login>
>
> The corresponding execution method is\App\HttpController\Api\Auth::login()
>
> <http://serverName/a/b/c/d/f>
>
> If f is the name of the controller, the method of execution is \App\HttpController\A\B\C\D\F::index()
>
> If f is the method name, the method to execute is \App\HttpControllers\A\B\C\D::f()

> If the final path is `index', the underlying layer automatically ignores it and directly calls the default method of the controller (that is, index).

Implementation code:
````php
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
````

## Analytical Hierarchy

In theory, EasySwoole supports infinite levels of URL - > controller mapping, but for system efficiency and malicious URL access prevention, the system defaults to level 3. If more levels of URL mapping matching are required due to business requirements, please inject a constant `SysConst:: HTTP_CONTROLLER_MAX_DEPTH`into DI in the framework initialization event, which is the maximum level of URL parsing. The following code allows Maximum parsing of URLs to 5 levels
```php
public static function initialize()
{
	Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);
}
```

## Exceptional case
When the controller and method are index, it can be ignored and not written directly.

If the method is index, you can ignore:
> If the corresponding execution method is named \App\HttpController\Api\User::index()
> URL can be written directly <http://serverName/api/User>  

If both the controller and the method are Index, they can be ignored
> If the corresponding execution method is named \App\HttpController\Index::index()
> URL can be written directly <http://serverName/>   

Index ignores the rule theory and supports infinite hierarchy, searching layer by layer according to the maximum of analytic hierarchy:
> <http://serverName>
> When \App\HttpController\Index.php does not exist, index. PHP is looked up layer by layer.
> As \App\HttpController\Index\Index\Index::index();
> Up to the maximum depth;


> Note that EasySwoole's URL path is case-sensitive, and the controller initials support lowercase conversion

