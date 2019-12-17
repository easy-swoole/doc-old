---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## Subscription/release method



| Method name         | Parameter                              | Description                           | Notes                           |    |
|:-----------------|:----------------------------------|:-------------------------------|:-------------------------------|:---|
| pSubscribe       | $callback, $pattern, ...$patterns | Subscribe to one or more channels that match a given pattern. | $callback is a callback function             |    |
| pubSub           | $subCommand, ...$arguments        | View subscription and release system status.    |                                |    |
| publish          | $channel, $message                | Send the message to the specified channel.    |                                |    |
| pUnSubscribe     | $pattern, ...$patterns            | Unsubscribe from all channels in a given mode.    |                                |    |
|                  |                                   |                                |                                |    |
| subscribe        | $callback, $channel, ...$channels | Subscribe to information for a given channel or channels. |                                |    |
|                  |                                   |                                |                                |    |
| unsubscribe      | $channel, ...$channels            | Refers to unsubscribing to a given channel.       |                                |    |
|                  |                                   |                                |                                |    |
| setSubscribeStop | bool $subscribeStop               | Set whether to opt out of the subscription        | Call this command when your callback function wants to exit  |    |
| isSubscribeStop  |                                   | View current subscription status        |                                |    |


## Instance
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

    //Open a new coroutine to subscribe
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

    //Open a new coroutine to subscribe
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
