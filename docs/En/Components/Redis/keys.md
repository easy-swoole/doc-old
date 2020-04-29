---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## key operation method
Method list

| Method name  | Parameter                   | Description                      | Notes           |
|:----------|:-----------------------|:--------------------------|:---------------|
| del       | $key                   | Delete a key    |                |
| dump      | $key                   | Serialization                    |                |
| exists    | $key                   | Whether the query exists   |                |
| expire    | $key, $expireTime = 60 | Set the expiration time (in seconds) for the key |                |
| expireAt  | $key, $expireTime      | Set the expiration time (in milliseconds) for the key |                |
| keys      | $pattern               | Match key      |                |
| move      | $key, $db              | Move key      | Cluster mode cannot be used |
| persist   | $key                   | Remove the expiration time of the key  |                |
| pTTL      | $key                   | Return millisecond expiration time |                |
| ttl       | $key                   | Return expired time   |                |
| randomKey |                        | Randomly return a key   |                 |
| rename    | $key, $new_key         | Modify the name of the key    |    Cluster mode cannot be used|
| renameNx  | $key, $new_key         | Modify the key name when newkey does not exist |    Cluster mode cannot be used  |
| type      | $key                   | Returns the data type stored by the key  |                 |


## Instance
```php
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));
    $key = 'test123213Key';
    $redis->select(0);
    $redis->set($key, 123);
    $data = $redis->dump($key);
    var_dump($data);
    $data = $redis->dump($key . 'x');
    var_dump($data);

    $data = $redis->exists($key);
    var_dump($data);

    $data = $redis->expire($key, 1);
    var_dump($data);
    \Swoole\Coroutine::sleep(2);
    var_dump($redis->exists($key));

    $redis->expireAt($key, 1 * 100);
    \Swoole\Coroutine::sleep(0.1);
    var_dump($redis->exists($key));

    $redis->set($key, 123);
    $data = $redis->keys("{$key}");
    var_dump($data);

    $redis->select(1);
    $redis->del($key);
    $redis->select(0);
    $data = $redis->move($key, 1);
    var_dump($data);
    $data = $redis->exists($key);
    var_dump($data);
    $redis->select(0);

    $redis->set($key, 123);
    $data = $redis->expire($key, 1);
    var_dump($data);
    $data = $redis->persist($key);
    var_dump($data);

    $redis->expire($key, 1);
    $data = $redis->pTTL($key);
    var_dump($data);

    $data = $redis->ttl($key);
    var_dump($data);

    $data = $redis->randomKey();
    var_dump($data);
    $data = $redis->rename($key, $key . 'new');
    var_dump($data);
    var_dump($redis->expire($key . 'new'));
    var_dump($redis->expire($key));

    $data = $redis->renameNx($key, $key . 'new');
    var_dump($data);
    $redis->renameNx($key . 'new', $key);
    $data = $redis->renameNx($key, $key . 'new');
    var_dump($data);
    $data = $redis->type($key);
    var_dump($data);
    $data = $redis->type($key . 'new');
    var_dump($data);
});
```
