---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client, implemented by swoole coroutine client, covering redis 99% method
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole redis coroutine client|swoole Redis|redis coroutine
---
## redis cluster configuration
When the redis cluster is instantiated, you need to pass in the `\EasySwoole\Redis\Config\RedisConfig` instance:

```php
$config = new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ], [
        'auth' => '',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_PHP
    ]);
```
::: warning
The cluster configuration first passes a multi-dimensional array of ip and port, and then passes other configuration items. Other configuration items are consistent with redis configuration.
:::

::: warning
Note that the auth password needs to be the same for all nodes in the cluster, only one password is supported.
:::


## Call example:
```php
go(function () {
    $redis = new \EasySwoole\Redis\RedisCluster(new \EasySwoole\Redis\Config\RedisClusterConfig([
        ['172.16.253.156', 9001],
        ['172.16.253.156', 9002],
        ['172.16.253.156', 9003],
        ['172.16.253.156', 9004],
    ], [
        'auth' => '',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_PHP
    ]));
    var_dump($redis->set('a',1));
    var_dump($redis->get('a'));
    var_dump($redis->clusterKeySlot('a'));
});

```


## Cluster Compatibility Method
Under normal circumstances, some methods cannot be directly called by the cluster client, such as the mSet method, which involves multiple key name operations, and multiple key names are assigned to other nodes.
At present, the redis cluster client implements compatibility of some multi-key name operation methods, and the implementation principle is as follows:
For the multi-key name operation method, split into a single-key name, and then obtain the slot node by the key name, and then execute it through the client assigned by the slot node, and only execute one key name at a time.

A compatible method has been implemented:

| Method Name | Parameters | Description                            | Notes         |
|:------------|:-----------|:---------------------------------------|:--------------|
| mSet        | $data      | Setting multiple key-value pairs       |               |
| mGet        | $keys      | Get the value of multiple key names    |               |
| mSetNx      | $data      | Setting multiple key-value pairs       | This method will not accurately determine "set multiple key values when all keys do not exist" |


## Cluster Client Scheduling Logic
### Client default scheduling
When the cluster client calls the redis method, it automatically defaults to a client to send and receive commands:
```php
function sendCommand(array $com, ?ClusterClient $client = null): bool
{
    $client = $client ?? $this->getDefaultClient();
    $this->setDefaultClient($client);
    return $this->sendCommandByClient($com, $client);
}

function recv($timeout = null, ?ClusterClient $client = null): ?Response
{
    $client = $client ?? $this->getDefaultClient();
    $this->setDefaultClient($client);
    return $this->recvByClient($client, $timeout);
}
```
When the get or set key value slots are inconsistent, the client will automatically switch the send and receive commands:
```php
// Node transfer client processing
if ($result->getErrorType() == 'MOVED') {
    $nodeId = $this->getMoveNodeId($result);
    $client = $this->getClient($nodeId);
    $this->clientConnect($client);
    //Only processed once, if it is wrong, it will not be processed
    $client->sendCommand($command);
    $result = $client->recv($timeout ?? $this->config->getTimeout());
}
```
::: warning
After the switch is completed, the next command is still the default client. 
:::

### Get the client of the cluster
List of cluster operation methods:

| Method name         | Parameter                       | Description                            | Notes  |
|:--------------------|:--------------------------------|:---------------------------------------|:------------|
| getNodeClientList    |                                  | Get the cluster client list                      |             |
| getNodeList          |                                  | Get cluster node information array                    |              |
| clientAuth           | ClusterClient $client, $password | Cluster client auth verification                      |             |
| setDefaultClient     | ClusterClient $defaultClient     | Set a default client                    |             |
| getDefaultClient     |                                  | Get a default client (initialization will automatically default to one) |            |
| tryConnectServerList |                                  | Try to get the client list again                   | When the call command returns false, try to retrieve it again. |
| getClient            | $nodeKey = null                  | Get a client based on nodeKey               |            |
| getMoveNodeId        | Response $response               | Get a nodeKey according to the Move message returned by recv   |             |
| getSlotNodeId        | $slotId                          | Get nodeKey based on slot id                   |             |

::: warning
These methods are used by the user to send commands to the redis server, or to define the default client to send.
:::


## Cluster compatible pipeline method
Due to the characteristics of the pipeline, after the pipeline is opened, the commands executed later will not be sent directly until the last execution of execPipe will be sent once.
In a cluster, you can only select one client and send a one-time command:

| Method name    | Parameter                          | Description                    | Notes                                         |
|:------------|:------------------------------|:------------------------|:--------------------------------------------|
| execPipe    | ?ClusterClient $client = null | One-time execution of methods saved in the pipeline | You can customize a client to send by obtaining a client list. |
| discardPipe |                               | Cancel the pipeline                 |                                             |
| startPipe   |                               | Pipeline starts recording             |                                             |


## Cluster disable method

::: warning  
Due to the characteristics of the cluster, different keys are assigned to different slots. When you call sUnion, sUnIonStore and other commands involving multiple key operations, it will return false, and the error message will be displayed in $redis->getErrorMsg():
:::
```php
$redis = new \EasySwoole\Redis\RedisCluster(new \EasySwoole\Redis\Config\RedisClusterConfig([
    ['172.16.253.156', 9001],
    ['172.16.253.156', 9002],
    ['172.16.253.156', 9003],
    ['172.16.253.156', 9004],
], [
    'auth'      => '',
    'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_PHP
]));

$data = $redis->sUnIonStore('a','v','c');
var_dump($data,$redis->getErrorMsg());
```
Will output:
```
bool(false)
string(53) "CROSSSLOT Keys in request don't hash to the same slot"
```
