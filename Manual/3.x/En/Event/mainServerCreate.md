# Main Service Created Event

## The function prototype
```php
@param \EasySwoole\EasySwoole\Swoole\EventRegister $register
public static function mainServerCreate(EventRegister $register)
{
}
```
## Framework created states
At the time of execution of the event, `EasySwoole` has completed the following tasks：
- Framework initialization events
- All configuration values are loaded
- The main Swoole Server instance has been created
- The main Swoole Server has registered the `onRequest`, `onTask` and `onFinish` event.

## What to do in this stage

### Register callback events for main services
For example, register a new callback of `onWorkerStart` event for the main service
```php
// add() function to register a new callback
$register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
     var_dump($workerId.'start');
});
```
For example, override the callback of the `onMessage` event for the main service
```php
// Register related events for server. Message events must be registered in WebSocket mode
$register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) {
    var_dump($frame);
});
```
>The `set()` method is different from the add method. Set overrides the event callbacks previously configured, while `add()` adds a new callback.

### Add a custom process
```php
 ServerManager::getInstance()
    ->getSwooleServer()
    ->addProcess(
        (new Test('test_process'))->getProcess()
    );
```
> Test is extended from a abstract classes `EasySwoole\Component\Process\AbstractProcess`
                                                         
### Attach a listener to a sub-service
```php
$subPort = ServerManager::getInstance()
    ->getSwooleServer()
    ->addListener('0.0.0.0',9503,SWOOLE_TCP);
    
$subPort->on('receive',function (\swoole_server $server, int $fd, int $reactor_id, string $data){
    var_dump($data);
});
```

> Refer to: [demo branch](https://github.com/easy-swoole/demo/branches)