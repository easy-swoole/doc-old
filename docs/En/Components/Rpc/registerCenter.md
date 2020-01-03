---
title: EasySwoole RPC Custom Registration Center
meta:
  - name: description
    content: Implementing RPC Custom Registration Center in EasySwoole
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Rpc Service Registration Center|swoole RPC|RPC
---

# EasySwoole RPC Custom Registration Center

EasySwoole defaults to unaware service discovery through UDP broadcast. However, in some cases, it is not convenient to use UDP broadcast, then EasySwoole supports you to customize a node manager to change the service discovery mode.

## For example, using Redis to achieve
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
        //Register anonymous connection pool
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
    *  Get all available nodes of a service 
    */
    function getServiceNodes(string $serviceName, ?string $version = null): array
    {
        /** @var \Redis $redis */
        $redis = PoolManager::getInstance()->getPool('__rpcRedis')->getObj(15);//Connection pool to take redis object
        try {
            $nodes = $redis->hGetAll($this->redisKey . md5($serviceName));
            $nodes = $nodes ?: [];
            $ret = [];
            foreach ($nodes as $nodeId => $node) {
                /**
                 * @var  $nodeId
                 * @var  ServiceNode $node
                 */
                if (time() - $node->getLastHeartBeat() > 30) {//Check the node's last heartbeat time
                    $this->deleteServiceNode($node);
                }
                if ($version && $version != $node->getServiceVersion()) {
                    continue;
                }
                $ret[$nodeId] = $node;
            }
            return $ret;
        } catch (\Throwable $throwable) {
            //If the redis is disconnected, it is destroyed.
            PoolManager::getInstance()->getPool('__rpcRedis')->unsetObj($redis);
        } finally {
            //Here you need to test whether an object can be recycled after it is unset.
            PoolManager::getInstance()->getPool('__rpcRedis')->recycleObj($redis);
        }
        return [];
    }
    
    /**
    *  Get a random node available for a service 
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
    *  Delete node 
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
    *  Refresh node(
    *  Ps: refreshed by the tick process process timer (this node) | listen for broadcast messages (other nodes) to refresh node information, redis node manager can)
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
            //If the redis is disconnected, it is destroyed.
            PoolManager::getInstance()->getPool('__rpcRedis')->unsetObj($redis);
        } finally {
            //Here you need to test whether an object can be recycled after it is unset.
            PoolManager::getInstance()->getPool('__rpcRedis')->recycleObj($redis);
        }
        return false;
    }
}

```

::: warning 
 Note that once the custom node manager is set, it is no longer necessary to enable the UDP scheduled broadcast process. After creating an RPC instance, create a ServiceNode object and refresh it to the registry. The same is true for the node offline. When your service is closed, the node manager is taken offline.
:::
