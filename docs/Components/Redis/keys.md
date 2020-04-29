---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## 键操作方法
方法列表

| 方法名称  | 参数                   | 说明                      | 备注           |
|:----------|:-----------------------|:--------------------------|:---------------|
| del       | ...$keys               | 删除一个键                 |$key可传一个array,也可以传多个可变参数                |
| unlink    | ...$keys            | 非阻塞删除一个键                 |$key可传一个array,也可以传多个可变参数             |
| dump      | $key                   | 序列化                    |                |
| exists    | $key                   | 查询是否存在               |                |
| expire    | $key, $expireTime = 60 | 给key设定过期时间(秒)      |                |
| expireAt  | $key, $expireTime      | 给key设定过期时间(毫秒)     |                |
| keys      | $pattern               | 匹配key                   |                |
| move      | $key, $db              | 移动key                   | 集群模式不能使用 |
| persist   | $key                   | 移除key的过期时间          |                |
| pTTL      | $key                   | 返回毫秒过期时间           |                |
| ttl       | $key                   | 返回过期时间               |                |
| randomKey |                        | 随机返回一个key            |                 |
| rename    | $key, $new_key         | 修改key的名字              |    集群模式不能使用|
| renameNx  | $key, $new_key         | newkey不存在时,修改key名字 |    集群模式不能使用  |
| type      | $key                   | 返回key储存的数据类型        |                 |


::: warning
 del和unlink都可以传一个数组,或者传 ...数组(可变参数),如果第一个参数为数组,则后面的参数全部将忽略
:::

::: warning
在集群中,del和unlink都是拆分key,判断key的solt进行一个个执行
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
    
    
    
    $data = $redis->del($key);
    var_dump($data);
    $data = $redis->del('a','b','c');
    var_dump($data);
    $data = $redis->del(['a','b','c']);
    var_dump($data);
    
    $data = $redis->unlink($key);
    var_dump($data);
    $data = $redis->unlink('a','b','c');
    var_dump($data);
    $data = $redis->unlink(['a','b','c']);
    var_dump($data);

});
```
