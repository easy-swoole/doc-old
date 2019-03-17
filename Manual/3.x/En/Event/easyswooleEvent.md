# EasyswooleEvent
Easyswoole has global event callback entrance which register in ***EasySwooleEvent.php*** file  at your project root.

## initialize()
which is call when the easyswoole framework initialized . what you can do ? eg:
- load you config or extral lib
- register error handler or other callback
- register pool
- etc...

## mainServerCreate(EventRegister $register)
which is call when easyswoole has created the ***swoole_server*** instance . what you can do ? eg:
- register or hook default event callback
- add sub listener
- register your process into server
- etc...

#### Example

##### Register swoole event
```
//register onworkerstart event
$register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
     var_dump($workerId.'start');
});

//register onmessage event
$register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) {
    var_dump($frame);
});
```

> add() is different with set();

##### Add an customer process
```
ServerManager::getInstance()->getSwooleServer()->addProcess((new Test('test_process'))->getProcess());
```
> Test class is an sub class of EasySwoole\Component\Process\AbstractProcess

#### Add sub listener 
```
$subRegister = ServerManager::getInstance()->addServer('tcp',9500);
$subRegister->set(EventRegister::onReceive,function(){
    
});
```

## public static function onRequest(Request $request, Response $response): ?bool

onRequest() will be call for each http request before router and controller handler, if you return false here, them the request will not be continue to parser .

## public static function afterRequest(Request $request, Response $response): void

onRequest() will be call for each http request after router and controller handler .
