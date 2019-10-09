---
title: Swoole Tracker
meta:
  - name: description
    content: easyswoole,Swoole Tracker
  - name: keywords
    content: easyswoole,Swoole Tracker
---

## Swoole Tracker

[Swoole Tracker](https://www.swoole-cloud.com/tracker.html)是Swoole官方出品的一整套企业级PHP和Swoole分析调试工具，全面支持协程/非协程环境，数据实时可视化，并全面分析报告服务状况，快速发现及精准定位问题和性能瓶颈。
在安装好swoole_tracker扩展后，我们可以在EasySwoole中提供的各个事件当中埋点，进行应用监控。

> 安装swoole_tracker扩展的方法见安装文档 https://www.kancloud.cn/swoole-inc/ee-base-wiki/1214079#_24 ，并且可以在 https://www.swoole-cloud.com/ 得到支持，若需要进行定制化本地部署，请联系框架作者或者是Swoole官方客服。

## 效果图

### 应用监控
![](/resources/img3.png)

### 调试器-进程列表
![](/resources/img1.png)

> 以下为企业版中的调试工具链功能，通过PID远程开启调试，支持检测阻塞IO、内存泄漏和代码性能分析

### 调试器-阻塞检测
![](/resources/img4.png)

### 调试器-内存泄漏检测
![](/resources/img6.png)

### 调试器-性能分析
![](/resources/img5.png)

### 接口监控
![](/resources/img2.png)


## 启动

在安装好swoole_tracker扩展后，我们执行：
```php
/opt/swoole/script/php/swoole_php /opt/swoole/node-agent/src/node.php & php easyswoole start
```
即可对EasySwoole进行监控。

## 使用

### 无需修改代码

Swoole Tracker的`v2.5.0`版本支持自动生成应用名称并创建应用，无需修改任何代码，生成的应用名称格式为：

`Swoole`的`HttpServer`：`ip:prot`

其他的`Server`：`ip(hostname):prot`

### 修改代码

当你需要自定义应用名称时则需要修改代码：

### Http服务监控

#### 全局监控

`EasySwooleEvent.php`中，分别对`onRequest`，`afterResponse`两个事件进行注册

- onRequest事件
```php
public static function onRequest(Request $request, Response $response): bool
{
    $tick = \SwooleTracker\Stats::beforeExecRpc($request->getUri()->getPath(), 'serviceName', "192.168.0.1");
    /*
        把该次请求生成的tick托管给上下文管理器
    */
    ContextManager::getInstance()->set("SWOOLE_TRACKER_TICK",$tick);
    return true;
}
```
- afterRequest事件
```php
public static function afterRequest(Request $request, Response $response): void
{
    $tick = ContextManager::getInstance()->get('SWOOLE_TRACKER_TICK');
    if($response->getStatusCode() != 200){
        $ret = false;
    }else{
       $ret = true;
    }
    \SwooleTracker\Stats::afterExecRpc($tick, $ret, $response->getStatusCode());
}
```
注册完以上事件后，即可自动的把`Http`服务的全部链路信息自动上报至Swoole Tracker服务端。

#### Http分组监控

若需要对Http服务做细化的分组监控，我们可以定义一个Base控制器。
```php
class Base extends Controller
{
    public $tick;
    
    function onRequest(?string $action): ?bool
    {
        $this->tick = \SwooleTracker\Stats::beforeExecRpc($request->getUri()->getPath(), 'myGroupName', "192.168.0.1");
        return true;
    }
    
    function afterAction(?string $actionName): void
    {
        \SwooleTracker\Stats::afterExecRpc($tick, true, 200);
        $this->tick = null;
    }
}
```

例如全部的Api控制器需要监控，那么对于的控制器继承对应的Base控制器即可。


### Rpc、Tcp、WebSocket服务监控

Easyswoole的Rpc、Tcp、WebSocket服务也同理提供了onRequest，afterAction方法，对两个方法进行埋点，即可实现对应的监控。
