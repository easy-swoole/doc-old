---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端
---
## redis集群配置
redis集群在实例化时,需要传入`\EasySwoole\Redis\Config\RedisConfig`实例:

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
集群配置先传入一个ip,port的多维数组,再传入其他配置项,其他配置项和redis配置一致
:::

::: warning
需要注意,auth密码需要集群所有节点相同,只支持一个密码
:::


## 调用示例:
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


## 集群兼容方法
在正常情况下,有些方法是不能直接被集群客户端调用成功的,比如mSet方法,它涉及了多个键名的操作,而多个键名是会分配给其他节点的  
目前redis集群客户端,实现了部分多键名操作方法的兼容,实现原理如下:  
对多键名操作方法,进行拆分成单键名,然后通过键名去获取槽节点,再通过槽节点分配的client去执行,每次只会执行一个键名

已经实现了兼容的方法:

| 方法名称 | 参数  | 说明           | 备注                                               |
|:--------|:------|:---------------|:--------------------------------------------------|
| mSet    | $data | 设置多个键值对  |                                                   |
| mGet    | $keys | 获取多个键名的值 |                                                   |
| mSetNx  | $data | 设置多个键值对  | 该方法将不能准确的判断"当所有key不存在时,设置多个key值" |


## 集群客户端调度逻辑
### 客户端默认调度
集群客户端在调用redis方法的时候,自动默认一个客户端进行发送接收命令:
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
当get,或者set的key值槽位不一致时,会自动切换客户端进行发送接收命令:
```php
 //节点转移客户端处理
if ($result->getErrorType() == 'MOVED') {
    $nodeId = $this->getMoveNodeId($result);
    $client = $this->getClient($nodeId);
    $this->clientConnect($client);
    //只处理一次moved,如果出错则不再处理
    $client->sendCommand($command);
    $result = $client->recv($timeout ?? $this->config->getTimeout());
}
```
::: warning
切换完成之后,下一次命令,依旧是默认客户端.
::: warning

### 获取集群的客户端
集群操作方法列表:

| 方法名称             | 参数                             | 说明                                   | 备注                            |
|:---------------------|:---------------------------------|:--------------------------------------|:-------------------------------|
| getNodeClientList    |                                  | 获取集群客户端列表                      |                                |
| getNodeList          |                                  | 获取集群节点信息数组                    |                                |
| clientAuth           | ClusterClient $client, $password | 集群客户端auth验证                      |                                |
| setDefaultClient     | ClusterClient $defaultClient     | 设置一个默认的客户端                    |                                |
| getDefaultClient     |                                  | 获取一个默认的客户端(初始化会自动默认一个) |                                |
| tryConnectServerList |                                  | 尝试重新获取客户端列表                   | 当调用命令返回false,可尝试重新获取 |
| getClient            | $nodeKey = null                  | 根据nodeKey获取一个客户端               |                                |
| getMoveNodeId        | Response $response               | 根据recv返回的Move消息获取一个nodeKey    |                                |
| getSlotNodeId        | $slotId                          | 根据槽id获取 nodeKey                   |                                |

::: warning
这些方法用于用户自定义发送命令给redis服务端,或者是自己定义默认客户端进行发送
::: warning


## 集群兼容管道方法
由于管道的特性,开启管道后,之后执行的命令将会保存不会直接发送,直到最后执行execPipe才会一次性发送  
在集群中,只能选择一个客户端,进行一次性发送命令:

| 方法名称    | 参数                          | 说明                    | 备注                                         |
|:------------|:------------------------------|:------------------------|:--------------------------------------------|
| execPipe    | ?ClusterClient $client = null | 一次性执行管道中保存的方法 | 可通过获取客户端列表,自定义选择一个客户端进行发送 |
| discardPipe |                               | 取消管道                 |                                             |
| startPipe   |                               | 管道开始记录             |                                             |


## 集群禁用方法

由于集群的特性,不同的key分配到了不同的槽位,当你调用sUnion,sUnIonStore等涉及多个key操作的命令时,将会返回false,同时错误信息会在$redis->getErrorMsg()中显示:
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
将输出:
```
bool(false)
string(53) "CROSSSLOT Keys in request don't hash to the same slot"
```
