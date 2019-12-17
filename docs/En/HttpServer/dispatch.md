---
title: URL parsing rules
meta:
  - name: description
    content: Easyswoole,URL parsing rules
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole|URL parsing rules
---
# URL parsing rules

Only the URL resolution of the `PATHINFO` mode is supported, and it is consistent with the controller name (method), and the controller search rule is the priority complete matching mode.

## Resolution rules

In the absence of routing intervention, the built-in parsing rules support infinite nested directories, as shown in the two examples below.

- <http://serverName/api/auth/login>

    The corresponding execution method is \App\HttpController\Api\Auth::login()

- <http://serverName/a/b/c/d/f>

    - If f is the controller name, the method executed is \App\HttpController\A\B\C\D\F::index()
    
    - If f is a method name, the method executed is \App\HttpControllers\A\B\C\D::f()
    
    - If the last path is `index`, the underlying will be automatically ignored and the controller's default method (ie index) will be called directly.
    
Implementation code:
```php
<?php
//If the request is /Index/index, or /abc/index
// will automatically delete the last index character, $path has been processed as /Index or /abc
$pathInfo = ltrim($path,"/");
$list = explode("/",$pathInfo);
$actionName = null;
$finalClass = null;
$controlMaxDepth = $this->maxDepth;
$currentDepth = count($list);
$maxDepth = $currentDepth < $controlMaxDepth ? $currentDepth : $controlMaxDepth;
while ($maxDepth >= 0){//Resolution level
    $className = '';
    //According to the requested path, the layer-by-layer parsing string is converted to the first letter uppercase, and it is judged whether the string is valid. If it is invalid, the default is Index.
    for ($i=0 ;$i<$maxDepth;$i++){
        $className = $className."\\".ucfirst($list[$i] ?: 'Index');//Service for Level 1 Controller Index
    }
    //Exit the loop if the controller is found
    if(class_exists($this->controllerNameSpacePrefix.$className)){
        //Try to get the actionName after the class
        $actionName = empty($list[$i]) ? 'index' : $list[$i];
        $finalClass = $this->controllerNameSpacePrefix.$className;
        break;
    }else{
        //Try to search index controller
        $temp = $className."\\Index";
        if(class_exists($this->controllerNameSpacePrefix.$temp)){
            $finalClass = $this->controllerNameSpacePrefix.$temp;
            //Try to get the actionName after the class
            $actionName = empty($list[$i]) ? 'index' : $list[$i];
            break;
        }
    }
    $maxDepth--;
}
```

## Analytic hierarchy

In theory, EasySwoole supports infinite-level URL->controller mapping, but for system efficiency and to prevent malicious URL access, the system defaults to level 3. If more levels of URL mapping match are required due to business requirements, please refer to the framework initialization event. Injects the constant `SysConst::HTTP_CONTROLLER_MAX_DEPTH` to the DI, which is the maximum level of URL parsing. The following code allows the URL to be parsed up to 5 levels.

```php
public static function initialize()
{
	Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);
}
```

## Special cases
When the controller and method are both index, you can directly ignore it.

- If the method is index, you can ignore it:
     If the corresponding execution method is named \App\HttpController\Api\User::index()
     Url can be written directly <http://serverName/api/User>

- If the controller and method are both Index, they can be ignored
     If the corresponding execution method is named \App\HttpController\Index::index()
     Url can be written directly <http://serverName/>

- The index ignore rule theory supports an infinite level, and the layer-by-layer lookup is based on the maximum resolution level:
     <http://serverName>
     When \App\HttpController\Index.php does not exist, it will search for Index.php layer by layer.
     Such as \App\HttpController\Index\Index\Index::index();
     Until the maximum depth;


::: warning
  Note that the URL path of EasySwoole is case-sensitive, and the first letter of the controller supports lowercase conversion.
:::

