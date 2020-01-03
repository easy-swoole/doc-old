---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## Hash operation method
Method list

| Method name     | Parameter                                      | Description                              | Notes |
|:-------------|:------------------------------------------|:---------------------------------|:----|
| hDel         | $key, ...$field                           | Delete key, multiple    |     |
| hExists      | $key, $field                              | Whether the query field exists   |     |
| hGet         | $key, $field                              | Get a field value    |     |
| hGetAll      | $key                                      | Get all the field values of this key |     |
| hSet         | $key, $field, $value                      | Set the field value of the key    |     |
| hValS        | $key                                      | Get all the values in the hash table  |     |
| hKeys        | $key                                      | Get the fields in all hash tables |     |
| hLen         | $key                                      | Get the number of fields in the hash table |     |
| hMGet        | $key, $hashKeys                           | Get the value of all the given field $hashKeys array|     |
| hMSet        | $key, $data                               | Set multiple $data key-value pairs to $key at the same time|     |
| hIncrBy      | $key, $field, $increment                  | Add $increment to the specified field    |     |
| hIncrByFloat | $key, $field, $increment                  | Add a floating point number to the specified field $increment |     |
| hSetNx       | $key, $field, $value                      | Set the value of $field only if $filed does not exist |     |
| hScan        | $key,&$cursor, $pattern=null, $count=null | Iterate over the key-value pairs in the hash table. |     |


## Instance
```php
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));

    $key = 'hKey';
    $field = [
        'hField1',
        'hField2',
        'hField3',
        'hField4',
        'hField5',
    ];
    $value = [
        1,
        2,
        3,
        4,
        5,
    ];

    $redis->del($key);
    $data = $redis->hSet($key, $field[0], $value[0]);
    var_dump($data);

    $data = $redis->hGet($key, $field[0]);
    var_dump($data);

    $data = $redis->hExists($key, $field[0]);
    var_dump($data);

    $data = $redis->hDel($key, $field[0]);
    var_dump($data);

    $data = $redis->hExists($key, $field[0]);
    var_dump($data);

    $data = $redis->hMSet($key, [
        "{$field[0]}" => $value[0],
        "{$field[1]}" => $value[1],
        "{$field[2]}" => $value[2],
        "{$field[3]}" => $value[3],
        "{$field[4]}" => $value[4],
    ]);
    var_dump($data);
    $data = $redis->hValS($key);
    var_dump($data);

    $data = $redis->hGetAll($key);
    var_dump($data);

    $data = $redis->hKeys($key);
    var_dump($data);

    $data = $redis->hLen($key);
    var_dump($data);

   $data = $redis->hMGet($key, [$field[0], $field[1], $field[2]]);
    var_dump($data);

    $data = $redis->hIncrBy($key, $field[4], 1);
    var_dump($data);

    $data = $redis->hIncrByFloat($key, $field[1], 1.1);
    var_dump($data);

    $data = $redis->hSetNx($key, $field[0], 1);
    var_dump($data);

    $data = $redis->hSetNx($key, $field[0] . 'a', 1);
    var_dump($data);
    var_dump($redis->hGet($key, $field[0] . 'a'));


    $cursor = 0;
    $redis->del('a');
    $redis->hMSet('a',[
        'a'=>'tioncico',
        'b'=>'tioncico',
        'c'=>'tioncico',
        'd'=>'tioncico',
        'e'=>'tioncico',
        'f'=>'tioncico',
        'g'=>'tioncico',
        'h'=>'tioncico',
    ]);

    $data = [];
    do {
        $keys = $redis->hScan('a',$cursor);
        $data = array_merge($data,$keys);
        var_dump($keys);
    } while ($cursor);

});

```
