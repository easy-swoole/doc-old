# ServerManager

> Service Management Class: EasySwoole\EasySwoole\ServerManager

ServerManager It is a singleton class (use EasySwoole\Component\Singleton)

## Create a Main Service
Through the `createSwooleServer` listener service, the `mainServerCreate` event of `EasySwooleEvent` can be listened.
This method is automatically called at the bottom of the framework. It will create a Swoole main service (unstarted service) through the `getSwooleServer` method, and set the callback event to call the native Swoole service method to create subservices etc.

## Creating a Subservice
The `addServer` listener service can be used by calling the `mainServerCreate` event of `EasySwooleEvent`.

````php
<?php
public static function mainServerCreate(EventRegister $register)
{
    ################# TCP Server 1 does not handle sticky package #####################
    $tcp1ventRegister = $subPort1 = ServerManager::getInstance()->addServer('tcp1', 9502, SWOOLE_TCP, '0.0.0.0', [
        'open_length_check' => false, / / ​​does not verify the packet
    ]);
    $tcp1ventRegister->set(EventRegister::onConnect,function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcp service 1 fd:{$fd} is connected to \n";
        $str = 'Congratulations on connecting to server 1 successfully';
        $server->send($fd, $str);
    });
    $tcp1ventRegister->set(EventRegister::onClose,function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcp service 1 fd:{$fd} has been closed \n";
    });
    $tcp1ventRegister->set(EventRegister::onReceive,function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "tcp service 1 fd:{$fd} send message: {$data}\n";
    });
}
````
> The addServer method returns the EventRegister method registration class, which can be used to register/set event callbacks for the service.


## Get The Service
Get the currently created swoole service and listener subservices via `getSwooleServer`
````php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/1 0001
 * Time: 11:10
 */

namespace App\HttpController;

use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller
{
    function index()
    {
        // TODO: Implement index() method.
    }

    function push(){
        $fd = intval($this->request()->getRequestParam('fd'));
        $info = ServerManager::getInstance()->getSwooleServer()->connection_info($fd);
        if(is_array($info)){
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
> Get the swoole service, you can use all the methods of Swoole service.

## Get Registration Event Class getMainEventRegister
The `getMainEventRegister` method gets the event registration class of the main service. The class can register the callback event of the main service.
The method framework automatically calls the bottom layer. In the `mainServerCreate` event, the `EasySwooleEvent` is passed to `mainServerCreate` method as a parameter, for example, the onWorkerStart event is registered for the main service.
```php
<?php
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
        var_dump($workerId.'start');
    });
}
```

## start and isStart
The `start` method will process the configuration of Swoole including main service, subservices, and callback events, and then start the service. This method is called internally by the framework. The successful call represents that the service has started successfully.
The `isStart` method will return bool variable to identify whether the service started successfully or not.

## getSubServerRegister
`getSubServerRegister` will get the callback event created by all child services.
