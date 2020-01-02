---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client, implemented by swoole coroutine client, covering redis 99% method
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole redis coroutine client|swoole Redis|redis coroutine
---
## Cluster related methods
Method list

| Method name                   | Parameter                               | Description                                               | Notes |
|:---------------------------|:-----------------------------------|:--------------------------------------------------|:----|
| clusterNodes               |                                    | Get cluster nodes                |     |
| clusterAddSlots            | $slots                             | The cluster slot is changed. $slots can be a string and can be an array.       |     |
| clusterCountFailureReports | $nodeId                            | Cluster count failure report              |     |
| clusterCountKeySinSlot     | $slot                              | Returns the number of keys in the specified Redis Cluster hash slot.         |     |
| clusterDelSlots            | $slot                              | Delete a hash slot               |     |
| clusterFailOver            | $option = null                     | Manual failover                |     |
| clusterForget              | $nodeId                            | Delete the specified node.              |     |
| clusterGetKeySinSlot       | $slot, $count                      | Returns an array of key names in the storage node and hashes to the specified hash slot.|     |
| clusterInfo                |                                    | Cluster information                 |     |
| clusterKeySlot             | $key                               | Return the cluster slot of the key                |     |
| clusterMeet                | $ip, $port                         | The node is connected to a working cluster.            |     |
| clusterReplicate           | $nodeId                            | Cluster replication                 |     |
| clusterReset               | $option = null                     | Cluster reset                 |     |
| clusterSaveConfig          |                                    | Force the node to save the nodes.conf configuration to disk.         |     |
| clusterSetConfigEpoch      | $configEpoch                       | Set a specific configuration period in the new node         |     |
| clusterSetSlot             | $slot, $subCommand, $nodeId = null | Change the state of the hash slot in the receiving node          |     |
| clusterSlaves              | $nodeId                            | Gets a list of slave nodes copied from the specified master node.       |     |
| clusterSlots               |                                    | Returns details about which cluster slots are mapped to which Redis instances.。 |     |
| readonly                   |                                    | Enable read queries to connect to Redis cluster slave nodes.       |     |
| readwrite                  |                                    | A read query that disables connections to Redis cluster slave nodes.                                             |     |




## Instance
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
 Because the cluster method is more complicated and needs to operate different clients to implement an instance of a certain method, this example only provides some code, not all, you can call the test yourself.
:::
