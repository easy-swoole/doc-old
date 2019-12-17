---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## 配置

### redis配置
redis在实例化时,需要传入`\EasySwoole\Redis\Config\RedisConfig`实例:

```php
$config = new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'db'        => null,
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]);
```

配置项如下:

| 配置名         | 默认参数           | 说明             | 备注                                               |
|:---------------|:-------------------|:-----------------|:---------------------------------------------------|
| host           | 127.0.0.1          | redis ip         |                                                    |
| port           | 6379               | redis端口        |                                                    |
| auth           |                    | auth密码         |                                                    |
| db             | null               | redis数据库      | 当db配置不等于null时,在connect的时候会自动select该配置 |
| timeout        | 3.0                | 超时时间         |                                                    |
| reconnectTimes | 3                  | 客户端异常重连次数 |                                                    |
| serialize      | SERIALIZE_NONE     | 数据是否序列化    |                                                    |


::: warning
序列化参数有:SERIALIZE_NONE,SERIALIZE_PHP,SERIALIZE_JSON
:::


### redis集群配置
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

