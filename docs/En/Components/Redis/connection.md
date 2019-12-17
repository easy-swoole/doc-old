---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## connection method
The connection method includes some auth, echo, ping, and similar methods. The list is as follows:   



| Method name   | Parameter      | Description       | Notes |
|:-----------|:----------|:----------|:----|
| connect    | $timeout  | Connection   |     |
| disconnect |           | Disconnect   |     |
| auth       | $password | Auth certification   |     |
| echo       | $str      | Echo    |     |
| ping       |           | Ping    |     |
| select     | $db       | Select database|     |


## Instance
```php
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));
    $data = $redis->connect();
    var_dump($data);
    $data = $redis->auth('easyswoole');
    var_dump($data);
    $data = $redis->echo('test echo');
    var_dump($data);
    $data = $redis->ping();
    var_dump($data);
    $data = $redis->select(1);
    var_dump($data);
    $redis->disconnect();
});
```
