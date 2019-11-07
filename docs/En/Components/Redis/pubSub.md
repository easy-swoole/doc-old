---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## 订阅/发布方法



| 方法名称         | 参数                              | 说明                           | 备注                           |    |
|:-----------------|:----------------------------------|:-------------------------------|:-------------------------------|:---|
| pSubscribe       | $callback, $pattern, ...$patterns | 订阅一个或多个符合给定模式的频道。 | $callback是回调函数             |    |
| pubSub           | $subCommand, ...$arguments        | 查看订阅与发布系统状态。         |                                |    |
| publish          | $channel, $message                | 将信息发送到指定的频道。         |                                |    |
| pUnSubscribe     | $pattern, ...$patterns            | 退订所有给定模式的频道。         |                                |    |
|                  |                                   |                                |                                |    |
| subscribe        | $callback, $channel, ...$channels | 订阅给定的一个或多个频道的信息。  |                                |    |
|                  |                                   |                                |                                |    |
| unsubscribe      | $channel, ...$channels            | 指退订给定的频道。               |                                |    |
|                  |                                   |                                |                                |    |
| setSubscribeStop | bool $subscribeStop               | 设置是否退出订阅                 | 当你回调函数想退出时,调用这个命令  |    |
| isSubscribeStop  |                                   | 查看当前订阅状态                 |                                |    |


## 实例
```php

defined("REDIS_HOST") ?: define('REDIS_HOST', '127.0.0.1');
defined("REDIS_PORT") ?: define('REDIS_PORT', 6379);
defined("REDIS_AUTH") ?: define('REDIS_AUTH', 'easyswoole');
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));;

    //新开协程进行订阅
    go(function () {
        $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
            'host' => REDIS_HOST,
            'port' => REDIS_PORT,
            'auth' => REDIS_AUTH
        ]));
        $redis->pSubscribe(function (\EasySwoole\Redis\Redis $redis, $pattern, $str) {
            var_dump($pattern,$str);
            $data = $redis->unsubscribe('test');
            var_dump($data);
            $redis->setSubscribeStop(true);
        }, 'test', 'test1', 'test2');
    });

    //新开协程进行订阅
    go(function () {
        $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
            'host' => REDIS_HOST,
            'port' => REDIS_PORT,
            'auth' => REDIS_AUTH
        ]));
        $redis->subscribe(function (\EasySwoole\Redis\Redis $redis, $pattern, $str) {
            var_dump($pattern,$str);
            $data = $redis->unsubscribe('test');
            var_dump($data);
            $redis->setSubscribeStop(true);
        }, 'test', 'test1', 'test2');
    });


    $data = $redis->pubSub('CHANNELS');
    var_dump($data);
    \Swoole\Coroutine::sleep(1);

    $data = $redis->publish('test2', 'test');
    var_dump($data);

    $data = $redis->pUnSubscribe('test');
    var_dump($data);

});

```