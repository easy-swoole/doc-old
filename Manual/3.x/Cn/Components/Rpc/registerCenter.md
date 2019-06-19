# EasySwoole RPC 自定义注册中心

EasySwoole 默认为通过UDP广播的方式来实现无主化的服务发现。但有些情况，不方便用UDP广播的情况下，那么EasySwoole支持你自定义一个节点管理器，来变更服务发现方式。

## 例如用Redis来实现
```php
<?php

namespace EasySwoole\Rpc\NodeManager;

use EasySwoole\Component\Pool\PoolConf;
use EasySwoole\Component\Pool\PoolManager;
use EasySwoole\Rpc\ServiceNode;
use EasySwoole\Utility\Random;
use Swoole\Coroutine\Channel;
use Swoole\Coroutine\Redis;

class RedisManager implements NodeManagerInterface
{
    protected $redisKey;
    /** @var Channel */
    protected $channel;

    function __construct(string $host, $port = 6379, $auth = null, string $hashKey = '__rpcNodes', int $maxRedisNum = 10)
    {
        $this->redisKey = $hashKey;
        //注册匿名连接池
        PoolManager::getInstance()->registerAnonymous('__rpcRedis', function (PoolConf $conf) use ($host, $port, $auth, $maxRedisNum) {
            $conf->setMaxObjectNum($maxRedisNum);
            $redis = new Redis();
            $redis->connect($host, $port);
            if ($auth) {
                $redis->auth($auth);
            }
            $redis->setOptions(['serialize' => true, 'compatibility_mode' => true]);
            return $redis;
        });
    }
    
    /**
    *  获取某个服务的所有可用节点 
    */
    function getServiceNodes(string $serviceName, ?string $version = null): array
    {
        /** @var \Redis $redis */
        $redis = PoolManager::getInstance()->getPool('__rpcRedis')->getObj(15);//连接池取redis对象
        try {
            $nodes = $redis->hGetAll($this->redisKey . md5($serviceName));
            $nodes = $nodes ?: [];
            $ret = [];
            foreach ($nodes as $nodeId => $node) {
                /**
                 * @var  $nodeId
                 * @var  ServiceNode $node
                 */
                if (time() - $node->getLastHeartBeat() > 30) {//检查节点最近一次的心跳时间
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
            PoolManager::getInstance()->getPool('__rpcRedis')->unsetObj($redis);
        } finally {
            //这边需要测试一个对象被unset后是否还能被回收
            PoolManager::getInstance()->getPool('__rpcRedis')->recycleObj($redis);
        }
        return [];
    }
    
    /**
    *  获取某个服务可用随机节点 
    */
    function getServiceNode(string $serviceName, ?string $version = null): ?ServiceNode
    {
        $list = $this->getServiceNodes($serviceName, $version);
        if (empty($list)) {
            return null;
        }
        return Random::arrayRandOne($list);
    }
    
    /**
    *  删除节点 
    */
    function deleteServiceNode(ServiceNode $serviceNode): bool
    {
        /** @var \Redis $redis */
        $redis = PoolManager::getInstance()->getPool('__rpcRedis')->getObj(15);
        try {
            $redis->hDel($this->redisKey . md5($serviceNode->getServiceName()), $serviceNode->getNodeId());
            return true;
        } catch (\Throwable $throwable) {
            PoolManager::getInstance()->getPool('__rpcRedis')->unsetObj($redis);
        } finally {
            PoolManager::getInstance()->getPool('__rpcRedis')->recycleObj($redis);
        }
        return false;
    }
    
    /**
    *  刷新节点(
    *  ps:由tick process进程定时器刷新(本节点)|监听广播消息(其他节点)来刷新节点信息，redis 节点管理器可以)
    */
    function serviceNodeHeartBeat(ServiceNode $serviceNode): bool
    {
        if (empty($serviceNode->getLastHeartBeat())) {
            $serviceNode->setLastHeartBeat(time());
        }
        /** @var \Redis $redis */
        $redis = PoolManager::getInstance()->getPool('__rpcRedis')->getObj(15);
        try {
            $redis->hSet($this->redisKey . md5($serviceNode->getServiceName()), $serviceNode->getNodeId(), $serviceNode);
            return true;
        } catch (\Throwable $throwable) {
            //如果该redis断线则销毁
            PoolManager::getInstance()->getPool('__rpcRedis')->unsetObj($redis);
        } finally {
            //这边需要测试一个对象被unset后是否还能被回收
            PoolManager::getInstance()->getPool('__rpcRedis')->recycleObj($redis);
        }
        return false;
    }
}

```
> 注意，设置自定义节点管理器后，就不再需要启用UDP定时广播进程了。请在创建RPC实例后，自己创建一个ServiceNode对象，刷新到注册中心。节点下线也是同理，在你服务关闭的时候，向节点管理器下线该节点。
