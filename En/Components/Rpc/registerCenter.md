# EasySwoole RPC Custom Registry

By default, EasySwoole implements service discovery without ownership through UDP broadcasting. But in some cases where UDP broadcasting is not convenient, EasySwoole supports you to customize a node manager to change service discovery.

## For example, with Redis
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2019-02-25
 * Time: 14:46
 */

namespace EasySwoole\Rpc\NodeManager;

use EasySwoole\Component\Pool\PoolManager;
use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\ServiceNode;
use EasySwoole\Utility\Random;

class RedisManager implements NodeManagerInterface
{
    const KEY = '__rpcRedisKey';
    private $pool;

    /**
     * Initialization of Service Node Manager
     * RedisManager constructor.
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $config = $config->getExtra();
        //Get redis connection
        PoolManager::getInstance()->registerAnonymous('__rpcRedis', function () use ($config) {
            $redis = new \Redis();
            $redis->connect($config['host'], $config['port']);
            if (!empty($config['auth'])) {
                $redis->auth($config['auth']);
            }
            $redis->setOption(\Redis::OPT_SERIALIZER, \Redis::SERIALIZER_PHP);
            return $redis;
        });
        $this->pool = PoolManager::getInstance()->getPool('__rpcRedis');
    }

    /**
     * Access to all services
     * getServiceNodes
     * @param string      $serviceName
     * @param string|null $version
     * @return array
     * @author Tioncico
     * Time: 9:38
     */
    function getServiceNodes(string $serviceName, ?string $version = null): array
    {
        $list = [];
        $nodeList = $this->allServiceNodes();//Access to all services
        foreach ($nodeList as $item) {
            $serviceNode = new ServiceNode($item);
            if ($serviceNode->getServiceName() == $serviceName) {
                if ($version !== null && $serviceNode->getServiceVersion() != $version) {
                    continue;
                }
                $list[$serviceNode->getNodeId()] = $serviceNode->toArray();
            }
        }
        return $list;
    }

    /**
     * Get details of a service node
     * getServiceNode
     * @param string      $serviceName
     * @param string|null $version
     * @return ServiceNode|null
     * @author Tioncico
     * Time: 9:39
     */
    function getServiceNode(string $serviceName, ?string $version = null): ?ServiceNode
    {
        $list = $this->getServiceNodes($serviceName, $version);
        $num = count($list);
        if ($num == 0) {
            return null;
        }
        return new ServiceNode(Random::arrayRandOne($list));
    }

    /**
     * Get the list data of all nodes
     * allServiceNodes
     * @return array
     * @author Tioncico
     * Time: 9:39
     */
    function allServiceNodes(): array
    {
        $list = [];
        if ($obj = $this->pool->getObj()) {
            $nodeList = $obj->hGetAll(self::KEY);
            $this->pool->recycleObj($obj);
            foreach ($nodeList as $key => $serviceNode) {
                if ($serviceNode->getNodeExpire() !== null && time() > $serviceNode->getNodeExpire()) {
                    $this->deleteServiceNode($serviceNode);//Overtime deletion
                    continue;
                }
                $list[] = $serviceNode->toArray();
            }
        }
        return $list;
    }

    /**
     * Delete a node
     * deleteServiceNode
     * @param ServiceNode $serviceNode
     * @return bool
     * @author Tioncico
     * Time: 9:39
     */
    function deleteServiceNode(ServiceNode $serviceNode): bool
    {
        if ($obj = $this->pool->getObj()) {
            $obj->hDel(self::KEY, $serviceNode->getNodeId());
            $this->pool->recycleObj($obj);
            return true;
        }
        return false;
    }

    /**
     * Register Service Node
     * registerServiceNode
     * @param ServiceNode $serviceNode
     * @return bool
     * @author Tioncico
     * Time: 9:39
     */
    function registerServiceNode(ServiceNode $serviceNode): bool
    {
        if ($obj = $this->pool->getObj()) {
            $obj->hSet(self::KEY, $serviceNode->getNodeId(), $serviceNode);
            $this->pool->recycleObj($obj);
            return true;
        }
        return false;
    }
}

```
> Note that when you set up a custom node manager, you no longer need to enable UDP timing broadcasting processes. After creating the RPC instance, create a ServiceNode object and refresh it to the registry. Node offline is the same. When your service is closed, offline the node to the node manager.
