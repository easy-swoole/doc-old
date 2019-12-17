---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---

## Redis transaction method list

| Method name | Parameter           | Description                           | Notes                         |
|:--------|:---------------|:------------------------------|:----------------------------|
| discard |                | Cancel transaction (rollback)    |                             |
| exec    |                | Execute transaction (get transaction result) |                             |
| multi   |                | Start transaction     |  |
| unWatch |                | Cancel the monitoring of all keys by the WATCH command |             |
| watch   | $key,...$keys | Monitoring key       |                             |

::: warning
After starting the transaction, the operation command will return "QUEUED" until the transaction is canceled or the transaction is executed. After executing exec, all command results will be returned.
:::

::: warning
Transactions in the cluster are not reliable
:::

## Instance
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
