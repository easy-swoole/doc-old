---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端
---
## pipe管道方法

| 方法名称    | 参数 | 说明         | 备注 |
|:------------|:----|:-------------|:----|
| discardPipe |     | 取消管道      |     |
| execPipe    |     | 一次性发送命令 |     |
| startPipe   |     | 管道开始记录  |     |

::: warning
开始管道之后,操作命令都将返回"PIPE",直到取消管道或者执行,执行exec之后,将返回所有命令结果
:::
::: warning
管道开始后,所有命令调用之后并不会执行,而是会记录起来,然后等待exec的时候一次性发送给redis服务端
所以需要注意内存,一次管道不要执行过多的命令
:::

::: warning
在集群中,只有execPipe命令会选中一个client发送数据,其他时候不管怎么调用都和client无关
:::

## 实例
```php
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));;

    $redis->get('a');
    $data = $redis->startPipe();
    var_dump($data);
    $redis->del('ha');
    $data = $redis->hset('ha', "a", "a\r\nb\r\nc");
    var_dump($data);
    $data = $redis->hset('ha', 'b', '2');
    var_dump($data);
    $data = $redis->hset('ha', 'c', '3');
    var_dump($data);
    $data = $redis->hGetAll('ha');
    var_dump($data);
    $data = $redis->execPipe();

    var_dump($data);

    $redis->startPipe();
    $data = $redis->set("a", '1');
    var_dump($data);
    $data = $redis->discardPipe();
    var_dump($data);

});
```
