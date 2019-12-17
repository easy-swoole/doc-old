---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## Configuration

### redis configuration
When redis is instantiated, you need to pass in the `\EasySwoole\Redis\Config\RedisConfig` instance:

```php
$config = new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'db'        => null,
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]);
```

The configuration items are as follows:

| Configuration name         | Default parameter           | Description             | Notes                                               |
|:---------------|:-------------------|:-----------------|:---------------------------------------------------|
| host           | 127.0.0.1          | Redis ip        |                                                    |
| port           | 6379               | Redis port      |                                                    |
| auth           |                    | Auth password      |                                                    |
| db             | null               | Redis database     | When the db configuration is not equal to null, the configuration will be automatically selected when connected |
| timeout        | 3.0                | overtime time         |                                                    |
| reconnectTimes | 3                  | Client abnormal reconnection times |                                                    |
| serialize      | SERIALIZE_NONE     | Whether the data is serialized  |                                                    |


::: warning
Serialization parameters are: SERIALIZE_NONE, SERIALIZE_PHP, SERIALIZE_JSON
:::


### redis cluster configuration
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

