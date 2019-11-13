---
title: mainServerCreate
meta:
  - name: description
    content: 主服务创建事件
  - name: keywords
    content: EasySwoole|swoole|mainServerCreate
---
# mainServerCreateEvent

## The function prototype

```php
@param \EasySwoole\EasySwoole\Swoole\EventRegister $register
public static function mainServerCreate(EventRegister $register)
{
}
```

## Finished work

At the time of executing the event, the following work has been completed:

- Framework initializes events
- The configuration file is loaded
- The main Swoole Server is created successfully
- Main Swoole Server registered its default onRequest, onTask, onFinish events.。

## Processable content

### Register the main service callback event

For example, register the onWorkerStart event for the main service

```php
$register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
     var_dump($workerId.'start');
});
```

For example, add an onMessage event to the main service

```php
  // In WebSocket mode message events must be registered and handed in 
$register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) {
    var_dump($frame);
});
```

::: warning 
The set method is different from the add method. The set method overrides the previously configured event callback, while the add method adds a new callback
:::

### Add a custom process

::: tip
Detailed operations can be viewed in the basic use -> custom process
:::

```php
ServerManager::getInstance()->getSwooleServer()->addProcess((new Test('test_process'))->getProcess());
```

::: warning 
Test is a subclass of the ```EasySwoole\Component\Process\AbstractProcess'```abstract class
:::

### Add a subservice listener

```php
$subPort = ServerManager::getInstance()->getSwooleServer()->addListener('0.0.0.0',9503,SWOOLE_TCP);
$subPort->on('receive',function (\swoole_server $server, int $fd, int $reactor_id, string $data){
    var_dump($data);
});
```

::: warning 
Refer to different ways of writing Demo branches event: [The demo branch](https://github.com/easy-swoole/demo/branches)
:::

## Call the coroutine API before starting
```php
use Swoole\Coroutine\Scheduler;
$scheduler = new Scheduler();
$scheduler->add(function() {
    /*  Call the coroutine API */
});
$scheduler->start();
//Clear all timers
\Swoole\Timer::clearAll();
```
