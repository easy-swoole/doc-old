# EasySwoole RPC 自定义注册中心

EasySwoole 默认为通过UDP广播的方式来实现无主化的服务发现。但有些情况，不方便用UDP广播的情况下，那么EasySwoole支持你自定义一个节点管理器，来变更服务发现方式。

## 例如用Redis来实现
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
     * 初始化服务节点管理器
     * RedisManager constructor.
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $config = $config->getExtra();
        //获取redis连接
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
     * 获取所有服务
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
        $nodeList = $this->allServiceNodes();//获取所有服务
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
     * 获取某个服务节点的详情
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
     * 取所有节点的列表数据
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
                    $this->deleteServiceNode($serviceNode);//超时删除
                    continue;
                }
                $list[] = $serviceNode->toArray();
            }
        }
        return $list;
    }

    /**
     * 删除某个节点
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
     * 注册服务节点
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
> 注意，设置自定义节点管理器后，就不再需要启用UDP定时广播进程了。请在创建RPC实例后，自己创建一个ServiceNode对象，刷新到注册中心。节点下线也是同理，在你服务关闭的时候，向节点管理器下线该节点。
