---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## HyperLog方法


| 方法名称 | 参数                        | 说明                                    | 备注           |
|:--------|:----------------------------|:----------------------------------------|:---------------|
| pfAdd   | $key, $elements             | 添加指定元素到 HyperLogLog 中。           | 传入一个索引数组 |
| pfCount | $key                        | 返回给定 HyperLogLog 的基数估算值。       |                |
| pfMerge | $deStKey, array $sourceKeys | 将多个 HyperLogLog 合并为一个 HyperLogLog | 传入一个索引数组 |


## 实例
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
