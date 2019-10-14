---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端
---
## hash操作方法
方法列表

| 方法名称     | 参数                                      | 说明                              | 备注 |
|:-------------|:------------------------------------------|:---------------------------------|:----|
| hDel         | $key, ...$field                           | 删除键,可多个                     |     |
| hExists      | $key, $field                              | 查询字段是否存在                   |     |
| hGet         | $key, $field                              | 获取一个字段值                     |     |
| hGetAll      | $key                                      | 获取这个key的全部字段值            |     |
| hSet         | $key, $field, $value                      | 设置key的字段值                   |     |
| hValS        | $key                                      | 获取哈希表中所有值                 |     |
| hKeys        | $key                                      | 获取所有哈希表中的字段              |     |
| hLen         | $key                                      | 获取哈希表中字段的数量              |     |
| hMGet        | $key, $hashKeys                           | 获取所有给定字段$hashKeys数组的值   |     |
| hMSet        | $key, $data                               | 同时将多个$data键值对设置到$key中   |     |
| hIncrBy      | $key, $field, $increment                  | 给指定字段增加$increment           |     |
| hIncrByFloat | $key, $field, $increment                  | 给指定字段增加浮点数$increment     |     |
| hSetNx       | $key, $field, $value                      | 只有在$filed不存在时,设置$field的值 |     |
| hScan        | $key,&$cursor, $pattern=null, $count=null | 迭代哈希表中的键值对。              |     |


## 实例
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