---
title: Rpc服务端
meta:
  - name: description
    content: EasySwoole中用RPC实现分布式微服务架构
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|Rpc服务端|swoole RPC|swoole微服务|swoole分布式|PHP 分布式
---

# 场景
例如在一个商场系统中，我们将商品库和系统公告两个服务切分开到不同的服务器当中。当用户打开商场首页的时候，
我们希望App向某个网关发起请求，该网关可以自动的帮我们请求商品列表和系统公共等数据，合并返回。

# 服务定义

每一个Rpc服务其实就一个EasySwoole\Rpc\AbstractService类。 如下：

## 定义商品服务

```php
namespace App\RpcService;


use EasySwoole\Rpc\AbstractService;

class Goods extends AbstractService
{

    public function serviceName(): string
    {
        return 'goods';
    }

    public function list()
    {
        $this->response()->setResult([
            [
                'goodsId'=>'100001',
                'goodsName'=>'商品1',
                'prices'=>1124
            ],
            [
                'goodsId'=>'100002',
                'goodsName'=>'商品2',
                'prices'=>599
            ]
        ]);
        $this->response()->setMsg('get goods list success');
    }
}
```

## 定义公共服务

```php
namespace App\RpcService;


use EasySwoole\Rpc\AbstractService;

class Common extends AbstractService
{
    public function serviceName(): string
    {
        return 'common';
    }

    public function mailBox()
    {
        $this->response()->setResult([
            [
                'mailId'=>'100001',
                'mailTitle'=>'系统消息1',
            ],
            [
                'mailId'=>'100001',
                'mailTitle'=>'系统消息1',
            ],
        ]);
        $this->response()->setMsg('get mail list success');
    }

    public function serverTime()
    {
        $this->response()->setResult(time());
        $this->response()->setMsg('get server time success');
    }
}
```

# 服务注册

在Easyswoole全局的Event文件中，进行服务注册。至于节点管理、服务类定义等具体用法请看对应章节。
```php
namespace EasySwoole\EasySwoole;

use App\RpcService\Common;
use App\RpcService\Goods;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\Redis\Config\RedisConfig;
use EasySwoole\RedisPool\RedisPool;
use EasySwoole\Rpc\NodeManager\RedisManager;
use EasySwoole\Rpc\Config as RpcConfig;
use EasySwoole\Rpc\Rpc;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        /*
         * 定义节点Redis管理器
         */
        $redisPool = new RedisPool(new RedisConfig([
            'host'=>'127.0.0.1'
        ]));
        $manager = new RedisManager($redisPool);
        //配置Rpc实例
        $config = new RpcConfig();
        //这边用于指定当前服务节点ip，如果不指定，则默认用UDP广播得到的地址
        $config->setServerIp('127.0.0.1');
        $config->setNodeManager($manager);
        /*
         * 配置初始化
         */
        Rpc::getInstance($config);
        //添加服务
        Rpc::getInstance()->add(new Goods());
        Rpc::getInstance()->add(new Common());
        Rpc::getInstance()->attachToServer(ServerManager::getInstance()->getSwooleServer());
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```

> 为了方便测试，我把两个服务放在同一台机器中注册。实际生产场景应该是N台机注册商品服务，N台机器注册公告服务，把服务分开。

