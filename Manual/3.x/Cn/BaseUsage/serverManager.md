# ServerManager

> 服务管理类: EasySwoole\EasySwoole\ServerManager

ServerManager 它是一个单例类(use EasySwoole\Component\Singleton)
## 创建主服务
在`EasySwooleEvent`的`mainServerCreate`事件中可通过`createSwooleServer`监听子服务.
该方法在框架底层自动调用,将创建一个swoole主服务(未开启服务),可通过`getSwooleServer`方法获取,并设置事件回调,调用原生swoole服务方法创建子服务,等

## 创建子服务
在`EasySwooleEvent`的`mainServerCreate`事件中可通过`addServer`监听子服务.
````php
<?php
public static function mainServerCreate(EventRegister $register)
{
    ################# tcp 服务器1 没有处理粘包 #####################
    $tcp1ventRegister = $subPort1 = ServerManager::getInstance()->addServer('tcp1', 9502, SWOOLE_TCP, '0.0.0.0', [
        'open_length_check' => false,//不验证数据包
    ]);
    $tcp1ventRegister->set(EventRegister::onConnect,function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcp服务1  fd:{$fd} 已连接\n";
        $str = '恭喜你连接成功服务器1';
        $server->send($fd, $str);
    });
    $tcp1ventRegister->set(EventRegister::onClose,function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcp服务1  fd:{$fd} 已关闭\n";
    });
    $tcp1ventRegister->set(EventRegister::onReceive,function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "tcp服务1  fd:{$fd} 发送消息:{$data}\n";
    });
}
````
> addServer方法返回的是EventRegister方法注册类,可通过该类去注册/设置服务的事件回调


## 获取服务
通过`getSwooleServer`可获取当前创建的swoole服务以及监听的子服务   
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
同样,也可以在`EasySwooleEvent`的`mainServerCreate`事件 通过这个获取到主服务之后,添加一个自定义进程
```php
ServerManager::getInstance()->getSwooleServer()->addProcess((new Test('test_process'))->getProcess());
```
> 获取到的是swoole的服务,可使用swoole服务所有的方法.

## 获取注册事件类 getMainEventRegister
`getMainEventRegister`方法可获取主服务的事件注册类,该类可注册主服务的事件回调  
该方法框架底层自动调用,在`mainServerCreate`事件中,传入到`EasySwooleEvent`的`mainServerCreate`方法作为参数使用,例如为主服务注册onWorkerStart事件
```php
<?php
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
        var_dump($workerId.'start');
    });
}
```

## start和isStart
`start`方法将处理配置的swoole主服务,子服务,以及回调事件,并开启服务,该方法由框架内部调用,调用成功代表着服务已经启动成功.
`isStart` 方法将返回服务是否启动成功的bool变量

## getSubServerRegister
`getSubServerRegister`将获取到所有子服务创建的事件回调.



