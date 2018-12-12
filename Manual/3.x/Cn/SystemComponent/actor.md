# Actor
EasySwoole 自3.0.9开始，提供Actor模式支持，助力游戏行业开发。EasySwoole的Actor采用自定义process作为存储载体，以协程作为最小调度单位，利用协程Channel做mail box,而客户端与process之间的通讯，采用UnixSocket实现。

## 定义一个Actor
```
namespace App;


use EasySwoole\EasySwoole\Actor\AbstractActor;

class Room extends AbstractActor
{
    /*
    当一个actor退出的时候，会执行的回调
    如果是客户端单独发送exit命令给某个actor的时候，你可以return 一个可以被序列化的变量，返回给客户端
    若是客户端执行exitAll命令时，则无法接收该消息（等待全部的代价过大）
    */
    function onExit()
    {
        // TODO: Implement onExit() method.
        var_dump($this->actorId().' exit ');
    }
    
    /*
    当你的客户端向某个actor推送消息的时候
    */
    function onMessage($arg)
    {
        // TODO: Implement onCommand() method.
        var_dump($arg);
        return $this->actorId().' msg at '.time();
    }
    /*
       当该Actor被创建的时候
    */
    function onStart()
    {
        // TODO: Implement onStart() method.
        var_dump($this->actorId().' start ');
        $this->tick(1000,function (){
           var_dump('time tick for'.$this->actorId());
        });
    }
}
```

## 注册Actor到服务端中
在EasySwoole全局的mainServerCreate事件中，我们进行Actor注册（可以注册多种actor）
```
use App\Room;
use EasySwoole\EasySwoole\Actor\ActorManager;

ActorManager::getInstance()->register(Room::class)
->setActorProcessNum(3)//设置保存actor的进程数目
->setActorName('RoomActor')//设置Actor的名称，注意一定要注册，且不能重复
->setMaxActorNum(1000);//设置当前actor中最大的actor数目
```

## 客户端
以下为单元测试的代码
```
require 'vendor/autoload.php';
\EasySwoole\EasySwoole\Core::getInstance()->initialize();


use EasySwoole\EasySwoole\Actor\ActorManager;
use App\Room;
go(function (){
    //模拟注册Actor ,若在整个easySwoole服务中，客户端不必重复注册，因为已经在全局事件中注册了
    ActorManager::getInstance()->register(Room::class)->setActorProcessNum(3)->setActorName('RoomActor');//一样需要注册
    //添加一个actor ，若成功返回actorId,若超出数目则-1
    $ret = ActorManager::getInstance()->actorClient(Room::class)->create([
        'arg'=>1,
        'time'=>time()
    ]);
    //单独退出某个actor
    $ret = ActorManager::getInstance()->actorClient(Room::class)->exit('0011');
    //单独推送给某个actor
    //$ret = ActorManager::getInstance()->actorClient(Room::class)->push('0001',2);
   //单独推送给全部actor
//    $ret = ActorManager::getInstance()->actorClient(Room::class)->pushMulti([
//        "0001"=>'0001data',
//        '0022'=>'0022Data'
//    ]);
    //退出全部actor
//    $ret = ActorManager::getInstance()->actorClient(MyActor::class)->exitAll();
    var_dump($ret);
});
```

> 注意请基于协程实现，不要在actor中写阻塞代码，否则效率会非常差。实现代码目录在 https://github.com/easy-swoole/easyswoole/tree/3.x/src/Actor