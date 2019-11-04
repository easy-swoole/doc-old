---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---

## 列表操作方法

方法列表

| 方法名称   | 参数                            | 说明                                                                                                          | 备注                           |
|:-----------|:--------------------------------|:--------------------------------------------------------------------------------------------------------------|:------------------------------|
| lPush      | $key, ...$data                  | 将一个或多个值插入到列表头部                                                                                     |                               |
| bLPop      | $keys,$timeout                  | 移出并获取$keys列表的第一个元素， 如果$keys列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止                       | $keys可为string,也可以为一个数组 |
| bRPop      | $keys,$timeout                  | 移出并获取$keys列表的最后一个元素， 如果$keys列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。                   | $keys可为string,也可以为一个数组 |
| bRPopLPush | $source, $destination, $timeout | 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |                               |
| rPopLPush  | $source, $destination           | 移除列表的最后一个元素，并将该元素添加到另一个列表并返回                                                            |                               |
| lIndex     | $key,$index                     | 通过索引获取列表中的元素                                                                                         |                               |
| lLen       | $key                            | 获取列表长度                                                                                                   |                               |
| lInsert    | $key,$bool,$pivot,$value        | 在列表的元素前或者后插入元素                                                                                     |                               |
| rPush      | $key, ...$data                  | 在列表中添加一个或多个值                                                                                         |                               |
| lRange     | $key,$start,$stop               | 获取列表指定范围内的元素                                                                                         |                               |
| lPop       | $key                            | 移出并获取列表的第一个元素                                                                                       |                               |
| rPop       | $key                            | 移出并获取列表的最后一个元素                                                                                     |                               |
| lPuShx     | $key,$value                     | 将一个值插入到已存在的列表头部                                                                                   |                               |
| rPuShx     | $key,$value                     | 为已存在的列表添加值                                                                                            |                               |
| lRem       | $key,$count,$value              | 移除列表元素                                                                                                   |                               |
| lSet       | $key,$index,$value              | 通过索引设置列表元素的值                                                                                         |                               |
| lTrim      | $key,$start,$stop               | 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。                      |                               |

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
        'listKey1',
        'listKey2',
        'listKey3',
    ];
    $value = [
        'a', 'b', 'c', 'd'
    ];



    $redis->flushAll();

    //测试null的时候
    $data = $redis->bLPop([$key[0],$key[1]], 1);
    var_dump($data);
    $data = $redis->lPush($key[0], $value[0], $value[1]);
    var_dump($data);

    //测试null的时候
    $data = $redis->bLPop([$key[1]], 1);
    var_dump($data);
    $data = $redis->bRPop([$key[1]], 1);
    var_dump($data);

    $data = $redis->bLPop([$key[0],$key[1]], 1);
    var_dump($data);

    $data = $redis->bRPop([$key[0],$key[1]], 1);
    var_dump($data);


    $redis->del($key[0]);
    $redis->lPush($key[0], $value[0], $value[1]);
    $data = $redis->bRPopLPush($key[0], $key[1], 1);
    var_dump($data);

    $redis->del($key[0]);
    $redis->lPush($key[0], $value[0], $value[1]);
    $data = $redis->rPopLPush($key[0], $key[1]);
    var_dump($data);

    $redis->del($key[0]);
    $redis->lPush($key[0], $value[0], $value[1]);
    $data = $redis->lIndex($key[0], 1);
    var_dump($data);
    $data = $redis->lLen($key[0]);
    var_dump($data);

    $data = $redis->lInsert($key[0], true, 'b', 'c');
    var_dump($data);
    $data = $redis->lInsert($key[0], true, 'd', 'c');
    var_dump($data);


    $redis->del($key[1]);
    $data = $redis->rPush($key[1], $value[0], $value[2], $value[1]);
    var_dump($data);


    $data = $redis->lRange($key[1], 0, 3);
    var_dump($data);

    $data = $redis->lPop($key[1]);
    var_dump($data);

    $data = $redis->rPop($key[1]);
    var_dump($data);

    $data = $redis->lPuShx($key[1], 'x');
    var_dump($data);

    $data = $redis->rPuShx($key[1], 'z');
    var_dump($data);

    $redis->del($key[1]);
    $redis->rPush($key[1], $value[0], $value[0], $value[0]);
    $data = $redis->lRem($key[1], 1, $value[0]);
    var_dump($data);

    $data = $redis->lSet($key[1], 0, 'xx');
    var_dump($data);

    $data = $redis->lTrim($key[1], 0, 2);
    var_dump($data);
});

```