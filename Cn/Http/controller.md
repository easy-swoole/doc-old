<head>
     <title>EasySwoole 控制器|swoole 控制器|swoole Api服务</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole 控制器|swoole 控制器|swoole Api服务"/>
     <meta name="description" content="EasySwoole 控制器|swoole 控制器|swoole Api服务"/>
</head>
---<head>---

# 控制器对象
控制器对象是http组件中方便客户端与服务端交互的对象,它使用了对象池对象复用模式,以及注入`request`和`response`对象进行数据交互

## 对象池模式

http的控制器对象都采用了对象池模式进行获取创建对象.  
例如:

 * 用户A请求`/Index`经过url解析以及路由转发,定位到了`App\HttpController\Index.php`控制器
 * 由于是第一次请求,`new App\HttpController\Index.php`并将该对象存入到对象池中
 * 对象池出列,获取该对象,并进行调用index方法进行处理请求
 * 处理完毕,将对象的属性重置为默认值,对象回收对象池
 * 用户B请求`/Index`经过url解析以及路由转发,定位到了`App\HttpController\Index.php`控制器
 * 由于是二次请求,对象池直接获取到第一次的对象,不需要new,直接调用`index`方法进行处理
 
> 对象池模式实现了不同请求复用同一个对象,降低了创建/销毁对象的开销,只有第一次请求创建对象才会调用构造函数,在第二次请求获取对象时将不会再次调用,对象池模式不会重置静态属性和private私有属性,这2种属性将会复用,对象池模式是针对单一进程的,多个work进程的对象池不共享.  


    
## 对象方法   
### 调度类方法 

* action 

 `action`是控制器最终执行的方法,根据路由的匹配不同,从而执行不同的控制器方法,例如默认执行的`index`方法,例如访问`ip/Index/test`最终解析的`test`方法,都可以称作`action`执行方法.   

> action方法可以返回一个字符串,从而让框架再次进行控制器方法调度,例如:    

 
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
        return '/test2';//当执行完test方法之后,返回/test2,让框架继续调度/test2方法
    }

    function test2()
    {
        $this->response()->write('this is test2');
        return true;
    }
}
````   
> 返回的字符串将会被`url解析规则`以及`route路由`规则解析,但是需要注意,千万不能A方法返回B方法,B方法再返回A方法的字符串,否则会出现无限死循环调用
    
 

* onRequest    

 
````php
<?php 
protected function onRequest(?string $action): ?bool  
{
    return true;   
}

````  


在准备调用控制器方法处理请求时的事件,如果该方法返回false则不继续往下执行.    
可用于做控制器基类权限验证等,例如:    
````php
function onRequest(?string $action): ?bool
{
    if (parent::onRequest($action)) {
        //判断是否登录
        if (1/*伪代码*/) {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', '登入已过期');
            return false;
        }
        return true;
    }
    return false;
}
````

* afterAction   
当控制器方法执行结束之后将调用该方法,可自定义数据回收等逻辑    

* index  
index是一个抽象方法,代表着继承控制器对象的都需要实现该方法,index 将成为默认的控制器方法.

* actionNotFound  
当请求方法未找到时,自动调用该方法,可自行覆盖该方法实现自己的逻辑   
> 该方法可以理解成 `默认方法`,类似于`index`方法,所以调用完之后也会触发`afterAction`,`gc`等方法

* onException  
当控制器逻辑抛出异常时将调用该方法进行处理异常(框架默认已经处理了异常)      
可覆盖该方法,进行自定义的异常处理,例如:
````php
function onException(\Throwable $throwable): void
{
    //直接给前端响应500并输出系统繁忙
    $this->response()->withStatus(Status::CODE_INTERNAL_SERVER_ERROR);
    $this->response()->write('系统繁忙,请稍后再试 ');
}
````
> 更多控制器异常相关可查看[错误与异常拦截](exception.md)

* gc  
````php
protected function gc()
{
    // TODO: Implement gc() method.
    if ($this->session instanceof SessionDriver) {
        $this->session->writeClose();
        $this->session = null;
    }
    //恢复默认值
    foreach ($this->defaultProperties as $property => $value) {
        $this->$property = $value;
    }
}
````
gc 方法将在执行`方法`,`afterAction`完之后自动调用  
将控制器属性重置为默认值,关闭`session`  
可自行覆盖实现其他的gc回收逻辑.  

### 请求响应类方法
* request   
request方法调用之后,将返回`EasySwoole\Http\Request`对象    
该对象附带了用户请求的所有数据,例如:
````php
function index()
{
    $request = $this->request();
    $request->getRequestParam();//获取post/get数据,get覆盖post
    $request->getMethod();//获取请求方式(post/get/)
    $request->getCookieParams();//获取cookie参数
}
````
> 更多request相关可查看[request对象](request.md)

* response  
response方法将返回`EasySwoole\Http\Response`,用于向客户端响应数据,例如:
````php
function index()
{
    $response = $this->response();
    $response->withStatus(200);//设置响应状态码,必须设置
    $response->setCookie('name','仙士可',time()+86400,'/');//设置一个cookie
    $response->write('hello world');//向客户端发送一条数据(类似于常规web模式的 echo )
}
````  
> 更多response相关可查看[response对象](response.md)

* writeJson  
 writeJson方法直接封装了设置响应状态码,设置响应头,数组转为json输出.
````php
function index()
{
 $this->writeJson(200,['xsk'=>'仙士可'],'success');
}
````
网页输出:
````
{"code":200,"result":{"xsk":"仙士可"},"msg":"success"}
````

### 反序列化方法
* json  
 使用json_decode 解析json字符串
* xml  
 使用simplexml_load_string解析xml字符串
 
### session相关
* sessionDriver  
  设置session的驱动类,默认为`EasySwoole\Http\Session\SessionDriver`
* session  
 返回session的驱动类,进行管理session 
 
### 验证相关
* validate
 validate方法可直接调用`EasySwoole\Validate\Validate`对象的验证,返回验证成功/失败的结果,实现代码:
````php
protected function validate(Validate $validate)
{
    return $validate->validate($this->request()->getRequestParam());
}
````
我们可使用该方法进行验证客户端发送的数据:
````php
function index()
{
    $validate = new Validate();
    $validate->addColumn('name','姓名')->required()->lengthMax(50);
    //限制name必填并且不能大于50个字符串
    if (!$this->validate($validate)){
        $this->writeJson(400, [], $validate->getError()->__toString());
        return false;
    }
    $this->writeJson(200, [], 'success');
}
````
> 更多validate 相关可查看[验证器](../Components/validate.md)
 
