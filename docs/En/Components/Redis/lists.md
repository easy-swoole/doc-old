---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---

## List operation method

Method list

| Method name   | Parameter                            | Description                                                                                                          | Notes                           |
|:-----------|:--------------------------------|:--------------------------------------------------------------------------------------------------------------|:------------------------------|
| lPush      | $key, ...$data                  | Insert one or more values ​​into the list header                                     |                               |
| bLPop      | $keys,$timeout                  | Move out and get the first element of the $keys list. If there are no elements in the $keys list, it will block the list until it waits for a timeout or finds that the element can be popped up.               | $keys can be either string or an array |
| bRPop      | $keys,$timeout                  | Move out and get the last element of the $keys list. If there are no elements in the $keys list, it will block the list until it waits for a timeout or finds that the element can be popped up.             | $keys can be either string or an array |
| bRPopLPush | $source, $destination, $timeout | Pops a value from the list, inserts the pop-up element into another list and returns it; if the list has no elements, it blocks the list until it waits for a timeout or finds a pop-up element. |                               |
| rPopLPush  | $source, $destination           | Remove the last element of the list and add the element to another list and return                          |                               |
| lIndex     | $key,$index                     | Get the elements in the list by index                                       |                               |
| lLen       | $key                            | Get list length                                           |                               |
| lInsert    | $key,$bool,$pivot,$value        | Insert elements before or after the elements of the list                                     |                               |
| rPush      | $key, ...$data                  | Add one or more values ​​to the list                                       |                               |
| lRange     | $key,$start,$stop               | Get the elements in the specified range of the list                                       |                               |
| lPop       | $key                            | Move out and get the first element of the list                                      |                               |
| rPop       | $key                            | Move out and get the last element of the list                                     |                               |
| lPuShx     | $key,$value                     | Insert a value into the existing list header                                    |                               |
| rPuShx     | $key,$value                     | Add a value to an existing list                                        |                               |
| lRem       | $key,$count,$value              | Remove list element                                           |                               |
| lSet       | $key,$index,$value              | Set the value of a list element by index                                       |                               |
| lTrim      | $key,$start,$stop               | Trim a list, that is, let the list retain only the elements in the specified range, and elements that are not within the specified range will be deleted.            |                               |

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
        'listKey1',
        'listKey2',
        'listKey3',
    ];
    $value = [
        'a', 'b', 'c', 'd'
    ];



    $redis->flushAll();

    //When testing null
    $data = $redis->bLPop([$key[0],$key[1]], 1);
    var_dump($data);
    $data = $redis->lPush($key[0], $value[0], $value[1]);
    var_dump($data);

    //When testing null
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
