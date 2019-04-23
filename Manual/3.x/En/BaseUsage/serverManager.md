# ServerManager

> Service Management Class: EasySwoole\EasySwoole\ServerManager

ServerManager It is a singleton class (use EasySwoole\Component\Singleton)
## Create a main service
The `createSwooleServer` listener service can be listened to in the `mainServerCreate` event of `EasySwooleEvent`.
This method is automatically called at the bottom of the framework, will create a swoole main service (not open service), can be obtained through the `getSwooleServer` method, and set the event callback, call the native swoole service method to create sub-services, etc.

## Creating a subservice
The `addServer` listener service can be used in the `mainServerCreate` event of `EasySwooleEvent`.
````php
<?php
Public static function mainServerCreate(EventRegister $register)
{
    ################# tcp Server 1 does not handle sticky packets #####################
    $tcp1ventRegister = $subPort1 = ServerManager::getInstance()->addServer('tcp1', 9502, SWOOLE_TCP, '0.0.0.0', [
        'open_length_check' => false, / / ​​does not verify the packet
    ]);
    $tcp1ventRegister->set(EventRegister::onConnect,function (\swoole_server $server, int $fd, int $reactor_id) {
        Echo "tcp service 1 fd:{$fd} is connected to \n";
        $str = 'Congratulations on connecting to successful server 1';
        $server->send($fd, $str);
    });
    $tcp1ventRegister->set(EventRegister::onClose,function (\swoole_server $server, int $fd, int $reactor_id) {
        Echo "tcp service 1 fd:{$fd} has been closed \n";
    });
    $tcp1ventRegister->set(EventRegister::onReceive,function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        Echo "tcp service 1 fd:{$fd} send message: {$data}\n";
    });
}
````
> The addServer method returns the EventRegister method registration class, which can be used to register/set event callbacks for the service.


## Get the service
Get the currently created swoole service and listener subservices with `getSwooleServer`
````php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/1 0001
 * Time: 11:10
 */

Namespace App\HttpController;

Use EasySwoole\EasySwoole\ServerManager;
Use EasySwoole\Http\AbstractInterface\Controller;

Class Index extends Controller
{
    Function index()
    {
        // TODO: Implement index() method.
    }

    Function push(){
        $fd = intval($this->request()->getRequestParam('fd'));
        $info = ServerManager::getInstance()->getSwooleServer()->connection_info($fd);
        If(is_array($info)){
            ServerManager::getInstance()->getSwooleServer()->send($fd,'push in http at '.time());
        }else{
            $this->response()->write("fd {$fd} not exist");
        }
    }
}
````
Similarly, you can also add a custom process after the main service is obtained from the `mainServerCreate` event of `EasySwooleEvent`.
```php
ServerManager::getInstance()->getSwooleServer()->addProcess((new Test('test_process'))->getProcess());
```
> Get the swoole service, you can use the swoole service all methods.

## Get the registration event class getMainEventRegister
The `getMainEventRegister` method gets the event registration class of the main service, which can register the event callback of the main service.
The method framework automatically calls the bottom layer. In the 'mainServerCreate` event, the `mainServerCreate` method passed to `EasySwooleEvent` is used as a parameter, for example, the onWorkerStart event is registered for the main service.
```php
<?php
Public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
        Var_dump($workerId.'start');
    });
}
```

## start and isStart
The `start` method will process the configured swoole main service, subservices, and callback events, and start the service. This method is called internally by the framework. The successful call represents that the service has started successfully.
The `isStart` method will return whether the service started a successful bool variable.

## getSubServerRegister
`getSubServerRegister` will get the event callback created by all child services.
