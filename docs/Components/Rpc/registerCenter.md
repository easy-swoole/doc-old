---
title: EasySwoole RPC 自定义注册中心
meta:
  - name: description
    content: EasySwoole中实现RPC 自定义注册中心
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|Rpc服务注册中心|swoole RPC|RPC
---

# EasySwoole RPC 自定义注册中心

EasySwoole 默认为通过UDP广播+自定义进程定时刷新自身节点信息的方式来实现无主化/注册中心的服务发现。在服务正常关闭的时候，自定义定时进程的onShutdown方法会执行deleteServiceNode
方法来实现节点下线。在非正常关闭的时候，心跳超时也会被节点管理器踢出，
有些情况，不方便用UDP广播的情况下，那么EasySwoole支持你自定义一个节点管理器，来变更服务发现方式。

## 例如用Redis来实现
```php
namespace EasySwoole\Rpc\NodeManager;

use EasySwoole\RedisPool\RedisPool;
use EasySwoole\Rpc\ServiceNode;
use EasySwoole\Utility\Random;

class RedisManager implements NodeManagerInterface
{
    protected $redisKey;

    protected $pool;

    function __construct(RedisPool $pool, string $hashKey = 'rpc')
    {
        $this->redisKey = $hashKey;
        $this->pool = $pool;
    }

    function getServiceNodes(string $serviceName, ?string $version = null): array
    {
        $redis = $this->pool->getObj(15);
        try {
            $nodes = $redis->hGetAll("{$this->redisKey}_{$serviceName}");
            $nodes = $nodes ?: [];
            $ret = [];
            foreach ($nodes as $nodeId => $node) {
                $node = new ServiceNode(json_decode($node,true));
                /**
                 * @var  $nodeId
                 * @var  ServiceNode $node
                 */
                if (time() - $node->getLastHeartBeat() > 30) {
                    $this->deleteServiceNode($node);
                }
                if ($version && $version != $node->getServiceVersion()) {
                    continue;
                }
                $ret[$nodeId] = $node;
            }
            return $ret;
        } catch (\Throwable $throwable) {
            //如果该redis断线则销毁
            $this->pool->unsetObj($redis);
        } finally {
            $this->pool->recycleObj($redis);
        }
        return [];
    }

    function getServiceNode(string $serviceName, ?string $version = null): ?ServiceNode
    {
        $list = $this->getServiceNodes($serviceName, $version);
        if (empty($list)) {
            return null;
        }
        return Random::arrayRandOne($list);
    }

    function deleteServiceNode(ServiceNode $serviceNode): bool
    {
        $redis = $this->pool->getObj(15);
        try {
            $redis->hDel($this->generateNodeKey($serviceNode), $serviceNode->getNodeId());
            return true;
        } catch (\Throwable $throwable) {
            $this->pool->unsetObj($redis);
        } finally {
            $this->pool->recycleObj($redis);
        }
        return false;
    }

    function serviceNodeHeartBeat(ServiceNode $serviceNode): bool
    {
        if (empty($serviceNode->getLastHeartBeat())) {
            $serviceNode->setLastHeartBeat(time());
        }
        $redis = $this->pool->getObj(15);
        try {
            $redis->hSet($this->generateNodeKey($serviceNode), $serviceNode->getNodeId(), $serviceNode->__toString());
            return true;
        } catch (\Throwable $throwable) {
            $this->pool->unsetObj($redis);
        } finally {
            //这边需要测试一个对象被unset后是否还能被回收
            $this->pool->recycleObj($redis);
        }
        return false;
    }

    protected function generateNodeKey(ServiceNode $node)
    {
        return "{$this->redisKey}_{$node->getServiceName()}";
    }
}
```

::: warning 
即使关闭了UDP定时广,EasySwoole Rpc的tick进程依旧会每3秒执行一次serviceNodeHeartBeat用于更新自身的节点心跳信息。
:::
