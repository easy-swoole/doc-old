---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## 集群相关方法
方法列表

| 方法名称                   | 参数                               | 说明                                               | 备注 |
|:---------------------------|:-----------------------------------|:--------------------------------------------------|:----|
| clusterNodes               |                                    | 获取集群节点                                        |     |
| clusterAddSlots            | $slots                             | 集群槽位变更,$slots可以为字符串,可以为数组            |     |
| clusterCountFailureReports | $nodeId                            | 集群计数失败报告                                    |     |
| clusterCountKeySinSlot     | $slot                              | 返回指定的 Redis Cluster 哈希槽中的键的数量。         |     |
| clusterDelSlots            | $slot                              | 删除一个哈希槽                                      |     |
| clusterFailOver            | $option = null                     | 手动故障转移                                        |     |
| clusterForget              | $nodeId                            | 删除指定的节点。                                    |     |
| clusterGetKeySinSlot       | $slot, $count                      | 返回存储节点中的密钥名称数组，并哈希到指定的哈希槽。    |     |
| clusterInfo                |                                    | 集群信息                                           |     |
| clusterKeySlot             | $key                               | 返回key的集群槽                                     |     |
| clusterMeet                | $ip, $port                         | 节点连接到工作群集。                                |     |
| clusterReplicate           | $nodeId                            | 集群复制                                           |     |
| clusterReset               | $option = null                     | 集群重置                                           |     |
| clusterSaveConfig          |                                    | 强制节点将nodes.conf配置保存到磁盘上。               |     |
| clusterSetConfigEpoch      | $configEpoch                       | 在新节点中设置特定的配置时期                         |     |
| clusterSetSlot             | $slot, $subCommand, $nodeId = null | 更改接收节点中散列槽的状态                           |     |
| clusterSlaves              | $nodeId                            | 获取从指定主节点复制的从节点列表。                    |     |
| clusterSlots               |                                    | 返回有关哪些集群插槽映射到哪些 Redis 实例的详细信息。。 |     |
| readonly                   |                                    | 启用读取查询以连接到 Redis 群集从属节点。             |     |
| readwrite                  |                                    | 禁用与 Redis 集群从属节点的连接的读取查询。                                                  |     |




## 实例
```php
go(function () {
    $redis = new \EasySwoole\Redis\RedisCluster(new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ], [
        'auth'      => '',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_PHP
    ]));

    $data = $redis->clusterNodes();
    var_dump($data);

    $data = $redis->clusterKeySlot('key1');
    var_dump($data);

    $data = $redis->clusterCountFailureReports(current($redis->getNodeList())['name']);
    var_dump($data);

    $data = $redis->clusterCountKeySinSlot(1);
    var_dump($data);

    $data = $redis->clusterFailOver('FORCE');
    var_dump($data);

    $redis->tryConnectServerList();
    $data = $redis->clusterForget(array_column(($redis->getNodeList()), 'name')[0]);
    var_dump($data);

    $redis->set('a', 1);
    $data = $redis->clusterKeySlot('a');
    var_dump($data);
    $data = $redis->clusterGetKeySinSlot($data, 1);
    var_dump($data);

    $data = $redis->clusterInfo();
    var_dump($data);

    $data = $redis->clusterKeySlot('b');
    var_dump($data);

    $data = $redis->clusterMeet('172.16.253.156', '9005');
    var_dump($data);
});

```

::: warning
 由于集群方法运行较为复杂,需要操作不同的客户端实现某种方法的实例,所以本示例只提供了部分代码,没有全部,可自行调用测试
:::