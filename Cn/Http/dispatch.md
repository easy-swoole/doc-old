# URL解析规则

仅支持`PATHINFO`模式的 URL 解析，且与控制器名称(方法)保持一致，控制器搜索规则为优先完整匹配模式

## 解析规则

在没有路由干预的情况下，内置的解析规则支持无限级嵌套目录，如下方两个例子所示

> <http://serverName/api/auth/login>
>
> 对应执行的方法为 \App\HttpController\Api\Auth::login()
>
> <http://serverName/a/b/c/d/f>
>
> 如果 f 为控制器名，则执行的方法为 \App\HttpController\A\B\C\D\F::index()
>
> 如果 f 为方法名，则执行的方法为 \App\HttpControllers\A\B\C\D::f()

> 如果最后的路径为`index`时,底层会自动忽略,并直接调用控制器的默认方法(也就是index)

实现代码:
````php
//如果请求为/Index/index,或/abc/index
//将自动删除最后面的index字符,$path已经被处理为/Index或/abc
$pathInfo = ltrim($path,"/");
$list = explode("/",$pathInfo);
$actionName = null;
$finalClass = null;
$controlMaxDepth = $this->maxDepth;
$currentDepth = count($list);
$maxDepth = $currentDepth < $controlMaxDepth ? $currentDepth : $controlMaxDepth;
while ($maxDepth >= 0){//解析层级
    $className = '';
    //根据请求的路径,逐层解析字符串转为首字母大写,并判断字符串是否有效,无效则默认为Index
    for ($i=0 ;$i<$maxDepth;$i++){
        $className = $className."\\".ucfirst($list[$i] ?: 'Index');//为一级控制器Index服务
    }
    //如果找到了该控制器,则退出循环
    if(class_exists($this->controllerNameSpacePrefix.$className)){
        //尝试获取该class后的actionName
        $actionName = empty($list[$i]) ? 'index' : $list[$i];
        $finalClass = $this->controllerNameSpacePrefix.$className;
        break;
    }else{
        //尝试搜搜index控制器
        $temp = $className."\\Index";
        if(class_exists($this->controllerNameSpacePrefix.$temp)){
            $finalClass = $this->controllerNameSpacePrefix.$temp;
            //尝试获取该class后的actionName
            $actionName = empty($list[$i]) ? 'index' : $list[$i];
            break;
        }
    }
    $maxDepth--;
}
````

## 解析层级

理论上 EasySwoole 支持无限层级的URL -> 控制器映射，但出于系统效率和防止恶意 URL 访问， 系统默认为3级，若由于业务需求，需要更多层级的URL映射匹配，请于框架初始化事件中向 DI 注入常量`SysConst::HTTP_CONTROLLER_MAX_DEPTH` ，值为 URL 解析的最大层级，如下代码，允许 URL 最大解析至5层

```php
public static function initialize()
{
	Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);
}
```

## 特殊情况
当控制器和方法都为index时,可直接忽略不写

如果方法为index,则可以忽略:  
> 如果对应执行方法名为 \App\HttpController\Api\User::index()
> url可直接写 <http://serverName/api/User>  

如果控制器和方法都为Index,则可以忽略
> 如果对应执行方法名为 \App\HttpController\Index::index()
> url可直接写 <http://serverName/>   

index忽略规则理论支持无限层级,根据解析层级最大进行逐层查找:
> <http://serverName>
> 当 \App\HttpController\Index.php不存在时,将逐层查找Index.php
> 如 \App\HttpController\Index\Index\Index::index();
> 直到最大深度;


> 注意，EasySwoole的URL路径区分大小写,控制器首字母支持小写转换

