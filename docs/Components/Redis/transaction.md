---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端
---
## redis事务方法列表

| 方法名称 | 参数           | 说明                           | 备注                         |
|:--------|:---------------|:------------------------------|:----------------------------|
| discard |                | 取消事务(回滚)                  |                             |
| exec    |                | 执行事务(获取事务结果)           |                             |
| multi   |                | 开始事务                       |  |
| unWatch |                | 取消 WATCH 命令对所有 key 的监视 |                             |
| watch   | $key, ...$keys | 监视key                        |                             |

::: warning
开始事务之后,操作命令都将返回"QUEUED",直到取消事务或者执行事务,执行exec之后,将返回所有命令结果
:::

::: warning
在集群中事务并不可靠
:::

## 实例
```php
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));
    $data = $redis->multi();
    var_dump($data);
    $redis->del('ha');
    $data = $redis->hset('ha', 'a', 1);
    var_dump($data);
    $data = $redis->hset('ha', 'b', '2');
    var_dump($data);
    $data = $redis->hset('ha', 'c', '3');
    var_dump($data);
    $data = $redis->hGetAll('ha');
    var_dump($data);
    $data = $redis->exec();
    var_dump($data);

    $redis->multi();
    $data = $redis->discard();
    var_dump($data);
    $data = $redis->watch('a', 'b', 'c');
    var_dump($data);
    $data = $redis->unwatch();
    var_dump($data);

});
```
