---
title: Rpc服务端
meta:
  - name: description
    content: EasySwoole中用RPC实现分布式微服务架构
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|Rpc服务端|swoole RPC|swoole微服务|swoole分布式|PHP 分布式
---

# 控制器聚合调用
```php
namespace App\HttpController;


use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Rpc\Response;
use EasySwoole\Rpc\Rpc;

class Index extends Controller
{

    function index()
    {
        $ret = [];
        $client = Rpc::getInstance()->client();
        /*
         * 调用商品列表
         */
        $client->addCall('goods','list',['page'=>1])
            ->setOnSuccess(function (Response $response)use(&$ret){
                $ret['goods'] = $response->toArray();
            })->setOnFail(function (Response $response)use(&$ret){
                $ret['goods'] = $response->toArray();
            });
        /*
         * 调用信箱公共
         */
        $client->addCall('common','mailBox')
            ->setOnSuccess(function (Response $response)use(&$ret){
                $ret['mailBox'] = $response->toArray();
            })->setOnFail(function (Response $response)use(&$ret){
                $ret['mailBox'] = $response->toArray();
            });
        /*
        * 获取系统时间
        */
        $client->addCall('common','serverTime')
            ->setOnSuccess(function (Response $response)use(&$ret){
                $ret['serverTime'] = $response->toArray();
            });

        $client->exec(2.0);

        $this->writeJson(200,$ret);
    }
}
```

> 注意，控制器中可以这样调用，是因为服务端章节中，在EasySwoole的全局启动事件已经对当前的Rpc实例定义注册了节点管理器。因此在控制器中调用的时候
> 该Rpc实例可以找到对应的节点。一般来说，在做聚合网关的节点，是不需要注册服务进去的，仅需注册节点管理器即可。
