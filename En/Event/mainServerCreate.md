# Master Service Creation Event

## The function prototype
```php
@param \EasySwoole\EasySwoole\Swoole\EventRegister $register
public static function mainServerCreate(EventRegister $register)
{
}
```
## Work completed
At the time of execution of the event, the work completed was：
- Framework initialization events
- Loading configuration files
- Success in creating the main Swoole Server
- The main Swoole Server registers the default onRequest, onTask, onFinish events.

## Processing content

### Register callback events for main services
For example, register the onWorkerStart event for the main service
```php
$register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
     var_dump($workerId.'start');
});
```
For example, register the onMessage event for the main service
```php
// Register related events for server. Message events must be registered in WebSocket mode
$register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) {
    var_dump($frame);
});
```
>The set method is different from the add method. Set overrides the event callbacks previously configured, while add adds a new callback.

### Add a custom process
```php
 ServerManager::getInstance()->getSwooleServer()->addProcess((new Test('test_process'))->getProcess());
```
> Test is `EasySwoole\Component\Process\AbstractProcess` subclasses of abstract classes
                                                         
### Add a sub-service listener
```php
$subPort = ServerManager::getInstance()->getSwooleServer()->addListener('0.0.0.0',9503,SWOOLE_TCP);
$subPort->on('receive',function (\swoole_server $server, int $fd, int $reactor_id, string $data){
    var_dump($data);
});
```

> Refer to different demo branch event writings: [demo branch](https://github.com/easy-swoole/demo/branches)