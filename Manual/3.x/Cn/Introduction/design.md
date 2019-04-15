# 核心解读

## 入口文件
`EasySwoole\Core\Core`
### 实例化
Core类是一个单例对象，在整个EasySwoole生命周期中，Core对象只会被实例化一次，实例化后初始化了几个框架常量:
````php
function __construct()
{
    defined('SWOOLE_VERSION') or define('SWOOLE_VERSION',intval(phpversion('swoole')));
    defined('EASYSWOOLE_ROOT') or define('EASYSWOOLE_ROOT',realpath(getcwd()));
    defined('EASYSWOOLE_SERVER') or define('EASYSWOOLE_SERVER',1);
    defined('EASYSWOOLE_WEB_SERVER') or define('EASYSWOOLE_WEB_SERVER',2);
    defined('EASYSWOOLE_WEB_SOCKET_SERVER') or define('EASYSWOOLE_WEB_SOCKET_SERVER',3);
}
````

### initialize
初始化方法  
在`initialize`方法中,主要做了以下事情:
 * 引入`EasySwooleEvent.php`配置文件,进行框架事件注册
 * 加载配置文件
 * 执行`EasySwooleEvent.php`的初始化`initialize`事件(可进行配置的修改,log目录等的修改,以及 类的注册)
 * 初始化临时目录和log目录
 * 注册错误回调,实现捕捉框架错误
 
### createServer
创建swoole主服务  
在`createServer`方法中,主要做了以下事情:
 * 创建swoole主服务
 * 注册主服务回调事件(根据配置的`SERVER_TYPE` 不同注册不同的事件)
 * 执行`EasySwooleEvent.php`的`mainServerCreate`事件(可新增回调事件,新增子服务监听等)
 * 执行额外的组件初始化(`Console`,`Crontab`,`fastCache`,`Actor`)
 
### start
开启服务  
在`start`方法中,主要做了以下事情:  
 * 获取已经注册好的服务回调事件,进行事件注册
 * 获取可能在`mainServerCreate`新增的子服务监听回调等事件,进行子服务注册
 * 调用swoole服务`start`方法,服务正式启动

> 在这些调用方法之中,core只作为调度方法,swoole服务创建,子服务管理,以及启动服务,都是通过`EasySwoole\EasySwoole\ServerManager`类进行操作  
> 可查看 [Swoole实例](../BaseUsage/ServerManager.md)进行详细了解

## http调度
框架默认 为 `EASYSWOOLE_WEB_SERVER`类型启动,在注册主服务回调事件中,将注册`onRequest`事件,每次当用户使用http请求时,都将触发该事件.  
该事件主要做了以下事情
 * 把\swoole_http_request、swoole_http_response转化为PSR7的Request与response对象。
 * 执行全局事件容器中的onRequest事件
 * 对请求执行dispatch。
 * 执行全局事件容器中的afterAction事件。
 * 执行内容响应（Swoole http server write 与end)
> 关于dispatch调度逻辑,可查看[Http服务](../Http/Introduction.md)的`URL解析规则`和`路由`章节