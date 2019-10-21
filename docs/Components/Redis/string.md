---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---

## 键操作方法
方法列表

| 方法名称    | 参数                                 | 说明                                       | 备注                                                                        |
|:------------|:-------------------------------------|:-------------------------------------------|:----------------------------------------------------------------------------|
| set         | $key, $val, $timeout = 0             | 设置一个键,以及设置过期时间,单位秒            | $timeout值可为int(过期时间秒),可为string("NX","XX"),也可为array['NX','EX'=>10] |
| get         | $key                                 | 获取一个键                                  |                                                                             |
| getRange    | $key, $start, $end                   | 返回子字符串                                |                                                                             |
| getSet      | $key, $value                         | 返回key旧值并设置新值                        |                                                                             |
| getBit      | $key, $offset                        | 获取指定偏移量上的bit值                      |                                                                             |
| mGet        | $keys                                | 获取多个key的值(参数可为string或者数组)       | 在集群中,将会分开处理                                                         |
| setBit      | $key, $offset, $value                | 设置偏移量的bit值                           |                                                                             |
| setEx       | $key, $expireTime, $value            | 设置值以及过期时间(秒)                       |                                                                             |
| setNx       | $key, $value                         | key不存在时设置 key 的值。                   |                                                                             |
| setRange    | $key, $offset, $value                | 设置偏移量的值                              |                                                                             |
| strLen      | $key                                 | 返回 key 所储存的字符串值的长度               |                                                                             |
| mSet        | $data                                | 设置多个key的值,参数为关联数组                |                                                                             |
| mSetNx      | $data                                | 当所有key不存在时,设置多个key值,参数和mSet一样 | 在集群中,key将会分开处理                                                      |
| pSetEx      | $key, $expireTime, $value            | 同setEx,过期时间为毫秒                       |                                                                             |
| incr        | $key                                 | 自增1                                      |                                                                             |
| incrBy      | $key, $value                         | 自增$value数值                              |                                                                             |
| incrByFloat | $key, $value                         | 自增$value浮点值                            |                                                                             |
| decr        | $key                                 | 自减1                                      |                                                                             |
| decrBy      | $key, $value                         | 自减$value数值                              |                                                                             |
| appEnd      | $key, $value                         | 追加字符串                                  |                                                                             |
| scan        | &$cursor, $pattern=null, $count=null | 迭代string键名                              | 集群模式不能使用                                                             |

::: warning
  如果开启序列化配置,getRange,setRange,getBit,setBit,strLen,自增自减命令,append等都会失效
:::

::: warning
  在集群中,批量设置,批量获取都是拆数组一个个处理的,所以mSetNx 的特性将失效
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
    $key = 'test';
    $value = 1;
    $data = $redis->del($key);
    var_dump($data);
    $data = $redis->set($key, $value);
    var_dump($data);
    $data = $redis->set($key, $value,'XX');
    var_dump($data);
    $data = $redis->set($key, $value,'NX');
    var_dump($data);
    $data = $redis->set($key, $value,['NX','EX'=>20]);
    var_dump($data);
    $data = $redis->set($key, $value,['NX','PX'=>20000]);
    var_dump($data);

    $data = $redis->get($key);
    var_dump($data);

    $data = $redis->exists($key);
    var_dump($data);

    $data = $redis->set($key, $value);
    var_dump($data);
    $value += 1;
    $data = $redis->incr($key);
    var_dump($data);

    $value += 10;
    $data = $redis->incrBy($key, 10);
    var_dump($data);

    $value -= 1;
    $data = $redis->decr($key);
    var_dump($data);

    $value -= 10;
    $data = $redis->decrBy($key, 10);
    var_dump($data);

    $key = 'stringTest';
    $value = 'tioncico';
    $redis->set($key, $value);
    $data = $redis->getRange($key, 1, 2);
    var_dump($data);

    $data = $redis->getSet($key, $value . 'a');
    var_dump($data);
    $redis->set($key, $value);

    $bitKey = 'testBit';
    $bitValue = 10000;
    $redis->set($bitKey, $bitValue);
    $data = $redis->setBit($bitKey, 1, 0);
    var_dump($data);
    $data = $redis->getBit($key, 1);
    var_dump($data);


    $field = [
        'stringField1',
        'stringField2',
        'stringField3',
        'stringField4',
        'stringField5',
    ];
    $value = [
        1,
        2,
        3,
        4,
        5,
    ];
    $data = $redis->mSet([
        "{$field[0]}" => $value[0],
        "{$field[1]}" => $value[1],
        "{$field[2]}" => $value[2],
        "{$field[3]}" => $value[3],
        "{$field[4]}" => $value[4],
    ]);
    var_dump($data);
    $data = $redis->mGet([$field[3], $field[2], $field[1]]);
    var_dump($data);


    $data = $redis->setEx($key, 1, $value[0] . $value[0]);
    var_dump($data);
    var_dump($redis->get($key));

    $data = $redis->pSetEx($key, 1, $value[0]);
    var_dump($data);
    var_dump($redis->get($key));


    $redis->del($key);
    $data = $redis->setNx($key, 1);
    var_dump($data);


    $redis->del($field[0]);
    $data = $redis->mSetNx([
        "{$field[0]}" => $value[0],
        "{$field[1]}" => $value[1],
    ]);
    var_dump($data);
    var_dump( $redis->get($field[1]));
    $redis->del($field[1]);
    $data = $redis->mSetNx([
        "{$field[0]}" => $value[0] + 1,
        "{$field[1]}" => $value[1] + 1,
    ]);
    var_dump($data);
    var_dump($redis->get($field[0]));

    $data = $redis->setRange($field[0], 1, 1);
    var_dump($data);
    var_dump($redis->get($field[0]));

    $data = $redis->strLen($field[0]);
    var_dump($data);

    $redis->set($key, 1);
    $data = $redis->incrByFloat($key, 0.1);
    var_dump($data);
    $data = $redis->appEnd($field[0], '1');
    var_dump($data);
    var_dump($redis->get($field[0]));
    
    
    
    //迭代测试
    $cursor = 0;//迭代初始值0
    $redis->flushAll();
    $redis->set('xxxa', '仙士可');
    $redis->set('xxxb', '仙士可');
    $redis->set('xxxc', '仙士可');
    $redis->set('xxxd', '仙士可');
    $data = [];
    do {
        //每次迭代都会设置一次$cursor,为0代表迭代完成
        $keys = $redis->scan($cursor, 'xxx*', 1);
        $data = array_merge($data,$keys);
    } while ($cursor);
    var_dump($data);
});
```