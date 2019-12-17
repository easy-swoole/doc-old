---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## HyperLog method


| Method name | Parameter                        | Description                                    | Notes           |
|:--------|:----------------------------|:----------------------------------------|:---------------|
| pfAdd   | $key, $elements             | Add the specified element to the HyperLogLog.| Pass in an indexed array |
| pfCount | $key                        | Returns the cardinality estimate for a given HyperLogLog. |               |
| pfMerge | $deStKey, array $sourceKeys | Combine multiple HyperLogLogs into one HyperLogLog | Pass in an indexed array |


## Instance
```php

go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));;


    $key = [
        'hp1',
        'hp2',
        'hp3',
        'hp4',
        'hp5',
    ];
    $redis->del($key[0]);
    $redis->del($key[1]);
    $data = $redis->pfAdd($key[0], [1, 2, 2, 3, 3]);
    var_dump($data);

    $redis->pfAdd($key[1], [1, 2, 2, 3, 3]);
    $data = $redis->pfCount([$key[0], $key[1]]);
    var_dump($data);

    $data = $redis->pfMerge($key[2], [$key[0], $key[1]]);
    var_dump($data);
});

```
