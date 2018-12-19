# EasySwoole RPC 自定义注册中心

EasySwoole 默认为通过UDP广播的方式来实现无主化的服务发现。但有些情况，不方便用UDP广播的情况下，那么EasySwoole支持你自定义一个节点管理器，来变更服务发现方式。

## 例如用Redis来实现
```php

class RedisRegisterCenter implements \EasySwoole\Rpc\NodeManagerInterface
{

    private $redis;

    function __construct()
    {
        $this->redis = new \Redis();
        $this->redis->connect('127.0.0.1');
    }

    /*
     * 以下方法，请都在redis中操作读取节点信息
     */
    function getServiceNodes(string $serviceName, ?string $version = null): array
    {
        // TODO: Implement getServiceNodes() method.
    }

    function getServiceNode(string $serviceName, ?string $version = null): ?\EasySwoole\Rpc\ServiceNode
    {
        // TODO: Implement getServiceNode() method.
    }

    function refreshServiceNode(\EasySwoole\Rpc\ServiceNode $serviceNode)
    {
        // TODO: Implement refreshServiceNode() method.
    }

    function allServiceNodes(): array
    {
        // TODO: Implement allServiceNodes() method.
    }

    function offlineServiceNode(\EasySwoole\Rpc\ServiceNode $serviceNode)
    {
        // TODO: Implement offlineServiceNode() method.
    }
}

use EasySwoole\Rpc\Config;
$conf = new Config();
$conf->setNodeManager(RedisRegisterCenter::class);

```
注意，设置自定义节点管理器后，就不再需要启用UDP定时广播进程了。请在创建RPC实例后，自己创建一个ServiceNode对象，刷新到注册中心。节点下线也是同理，在你服务关闭的时候，向节点管理器下线该节点。
