---
title: Service management
meta:
  - name: description
    content: Easysoole service management, service start, stop, etc
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole service management|swoole servicemanagement|swoole service|EasySwoole service
---

# ServerManager

::: warning 
 ServerManagerClass: EasySwoole\EasySwoole\ServerManager
:::

ServerManager It is a singleton class (use EasySwoole\Component\Singleton)
## Create main service
In the ```mainServerCreate``` event of ```EasySwooleEvent``` the subservice can be listened on by ```createSwooleServer```.
This method is automatically invoked at the bottom of the framework, which will create a swoole main service (not opened), which can be obtained through the ```getSwooleServer``` method, and set event callback, calling the original swoole service method to create sub-services, and so on

## Create subservices
In the ```mainServerCreate``` event of ```EasySwooleEvent```, a subservice can be listened on through ```addServer```.
````php
<?php
public static function mainServerCreate(EventRegister $register)
{
    ################# tcp Server 1 did not handle sticky packets #####################
    $tcp1ventRegister = $subPort1 = ServerManager::getInstance()->addServer('tcp1', 9502, SWOOLE_TCP, '0.0.0.0', [
        'open_length_check' => false,//Unauthenticated packet
    ]);
    $tcp1ventRegister->set(EventRegister::onConnect,function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcpServer 1  fd:{$fd} The connected\n";
        $str = 'Congratulations on connecting to server 1';
        $server->send($fd, $str);
    });
    $tcp1ventRegister->set(EventRegister::onClose,function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcpServer 1  fd:{$fd} closed\n";
    });
    $tcp1ventRegister->set(EventRegister::onReceive,function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "tcpServer 1  fd:{$fd} Send a message:{$data}\n";
    });
}
````

::: warning 
 The addServer method returns the EventRegister method registration class, which is used to register/set up event callbacks for the service.
:::


## getSwooleServer
The swoole service you are currently creating and the child service you are listening to can be retrieved through ```getSwooleServer```.
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
Similarly, it is possible to add a custom process after the mainServerCreate event of EasySwooleEvent is fetched through this to the primary service.
```php
ServerManager::getInstance()->getSwooleServer()->addProcess((new Test('test_process'))->getProcess());
```

::: warning 
 You get Swoole services,All methods of the Swoole service are available.
:::

## getMainEventRegister
`getMainEventRegister`Method gets the event registration class for the master service, which registers event callbacks for the master service
The method framework is automatically invoked at the bottom,In the ```mainServerCreate``` event, the```mainServerCreate``` method passed in to ```EasySwooleEvent``` is used as an argument, such as registering the onWorkerStart event for the primary service.

```php
<?php
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
        var_dump($workerId.'start');
    });
}
```

## start And isStart
The ```start``` method will handle the configured swoole main service, sub-service, and callback events, and will open the service. The method is called from within the framework, and the successful invocation indicates that the service has been started successfully..
The 'isStart' method returns a bool variable that indicates whether the service started successfully.

## getSubServerRegister
'getSubServerRegister' gets all the event callbacks created by the subservice.



