---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
## Pipe pipe method

| Method name    | Parameter | Description         | Notes |
|:------------|:----|:-------------|:----|
| discardPipe |     | Cancel the pipeline   |     |
| execPipe    |     | Send command once |     |
| startPipe   |     | Pipeline starts recording |     |

::: warning
After starting the pipeline, the operation command will return "PIPE" until the pipeline is canceled or executed. After executing exec, all command results will be returned.
:::
::: warning
After the pipeline starts, all commands will not be executed after the call, but will be recorded, and then sent to the redis server once waiting for exec.
So you need to pay attention to memory, do not execute too many commands in one pipeline.
:::

::: warning
In the cluster, only the execPipe command will select a client to send data, and other times, regardless of how it is called, it has nothing to do with the client.
:::

## Instance
```php
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));;

    $redis->get('a');
    $data = $redis->startPipe();
    var_dump($data);
    $redis->del('ha');
    $data = $redis->hset('ha', "a", "a\r\nb\r\nc");
    var_dump($data);
    $data = $redis->hset('ha', 'b', '2');
    var_dump($data);
    $data = $redis->hset('ha', 'c', '3');
    var_dump($data);
    $data = $redis->hGetAll('ha');
    var_dump($data);
    $data = $redis->execPipe();

    var_dump($data);

    $redis->startPipe();
    $data = $redis->set("a", '1');
    var_dump($data);
    $data = $redis->discardPipe();
    var_dump($data);

});
```
