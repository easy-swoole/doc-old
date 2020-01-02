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

| Method name    | Parameter                                 | Description                                       | Notes                                                                        |
|:------------|:-------------------------------------|:-------------------------------------------|:----------------------------------------------------------------------------|
| set         | $key, $val, $timeout = 0             | Set a key and set the expiration time in seconds | The $timeout value can be int (expiration time seconds), can be string("NX","XX"), or array['NX', 'EX'=>10] |
| get         | $key                                 | Get a key          |                                                                             |
| getRange    | $key, $start, $end                   | Return substring         |                                                                             |
| getSet      | $key, $value                         | Return the old value of the key and set the new value       |                                                                             |
| getBit      | $key, $offset                        | Get the bit value on the specified offset      |                                                                             |
| mGet        | $keys                                | Get the value of multiple keys (parameters can be string or array)   | In the cluster, it will be handled separately                                                        |
| setBit      | $key, $offset, $value                | Set the bit value of the offset        |                                                                             |
| setEx       | $key, $expireTime, $value            | Set value and expiration time (seconds)      |                                                                             |
| setNx       | $key, $value                         | Set the value of key when the key does not exist.       |                                                                             |
| setRange    | $key, $offset, $value                | Set the value of the offset        |                                                                             |
| strLen      | $key                                 | Returns the length of the string value stored by key    |                                                                             |
| mSet        | $data                                | Set the value of multiple keys, the parameter is an associative array    |                                                                             |
| mSetNx      | $data                                | When all keys do not exist, set multiple key values, the parameters are the same as mSet | In the cluster, the keys will be processed separately                                                      |
| pSetEx      | $key, $expireTime, $value            | Same as setEx, the expiration time is milliseconds        |                                                                             |
| incr        | $key                                 | Self-increase 1            |                                                                             |
| incrBy      | $key, $value                         | Increase the value of $value           |                                                                             |
| incrByFloat | $key, $value                         | Increase $value floating point value          |                                                                             |
| decr        | $key                                 | Self-reduction 1            |                                                                             |
| decrBy      | $key, $value                         | Self-decrementing $value           |                                                                             |
| appEnd      | $key, $value                         | Append string          |                                                                             |
| scan        | &$cursor, $pattern=null, $count=null | Iterate string key name                              | Cluster mode cannot be used                                                             |

::: warning
  If the serialization configuration is enabled, getRange, setRange, getBit, setBit, strLen, self-incrementing and decrementing commands, append, etc. will be invalidated.
:::

::: warning
  In the cluster, batch settings, batch acquisition are all processed by splitting arrays, so the characteristics of mSetNx will be invalid.
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
    
    
    
    //Iterative test
    $cursor = 0;//Iteration initial value 0
    $redis->flushAll();
    $redis->set('xxxa', 'Alan');
    $redis->set('xxxb', 'Alan');
    $redis->set('xxxc', 'Alan');
    $redis->set('xxxd', 'Alan');
    $data = [];
    do {
        //$cursor is set once for each iteration, and 0 means iterative completion
        $keys = $redis->scan($cursor, 'xxx*', 1);
        $data = array_merge($data,$keys);
    } while ($cursor);
    var_dump($data);
});
```
