# Actor
EasySwoole 自3.0.9开始，提供Actor模式支持，助力游戏行业开发。EasySwoole的Actor采用自定义process作为存储载体，以协程作为最小调度单位，利用协程Channel做mail box,而客户端与process之间的通讯，采用UnixSocket实现。

## 定义一个Actor
```php
<?php

namespace App\Actor;

use EasySwoole\Actor\ActorConfig;

class RoomActor extends \EasySwoole\Actor\AbstractActor
{
    /**
     * 当发送消息时的回调
     * onMessage
     * @param $msg
     * @author Apple
     * Time: 13:59
     */
    function onMessage($msg)
    {
        var_dump("actor".$this->actorId()."on message:" . $msg . PHP_EOL);
        return "on message success\n";
        // TODO: Implement onMessage() method.
    }

    /**
    * 当actor退出时的回调   
    * onExit
    * @param $arg 退出参数
    * @return string
    * @author tioncico
    * Time: 下午5:20
    */
    function onExit($arg)
    {
        var_dump("actor".$this->actorId() . "已经退出,退出参数:".json_encode($arg)."\n");
        return "on exit success\n";
        // TODO: Implement onExit() method.
    }

    /**
     * 当执行出现异常时的回调
     * onException
     * @param \Throwable $throwable
     * @author Apple
     * Time: 13:58
     */
    protected function onException(\Throwable $throwable)
    {
        // TODO: Implement onException() method.
    }

    /**
     * 当该Actor被创建的时候
     * onStart
     * @author Apple
     * Time: 13:58
     */
    function onStart($arg)
    {
        var_dump("actor".$this->actorId() . "on start");
        // TODO: Implement onStart() method.
        return "on start success\n";
    }

    static function configure(ActorConfig $actorConfig)
    {
        $actorConfig->setActorName('RoomActor');//配置actor名称
        // TODO: Implement configure() method.
    }
}
```

## 注册Actor到服务端中
在`EasySwooleEvent.php`全局的`mainServerCreate`事件中，我们进行Actor注册（可以注册多种actor）
```php

Actor::getInstance()->register(RoomActor::class)->setActorProcessNum(3)//设置保存actor的进程数目
->setActorName('RoomActor')//设置Actor的名称，注意一定要注册，且不能重复
->setMaxActorNum(1000);//设置当前actor中最大的actor数目

```

## 客户端
以下为单元测试的代码
```php
<?php
require '../../vendor/autoload.php';//本文件在App/Actor/cliTest.php
define('EASYSWOOLE_ROOT','../../');
\EasySwoole\EasySwoole\Core::getInstance()->initialize();

go(function (){
    //模拟注册Actor ,若在整个easySwoole服务中，客户端不必重复注册，因为已经在全局事件中注册了
    \EasySwoole\Actor\Actor::getInstance()->setTempDir(EASYSWOOLE_ROOT.'Temp2')->register(\App\Actor\RoomActor::class)->setActorProcessNum(3)->setActorName('RoomActor');//一样需要注册
    //添加一个actor ，若成功返回actorId,若超出数目则-1
    $actorId = \EasySwoole\Actor\Actor::getInstance()->client(\App\Actor\RoomActor::class)->create([
        'arg'=>1,
        'time'=>time()
    ]);
    //单独退出某个actor
    $ret = \EasySwoole\Actor\Actor::getInstance()->client(\App\Actor\RoomActor::class)->exit($actorId,['test'=>'test']);//退出一个actor,参数是test=>test
    //单独推送给某个actor
    $ret = \EasySwoole\Actor\Actor::getInstance()->client(\App\Actor\RoomActor::class)->push($actorId,'1234');
    //单独推送给全部actor
//    $ret = \EasySwoole\Actor\Actor::getInstance()->client(\App\Actor\RoomActor::class)->pushMulti([
//        "0001"=>'0001data',
//        '0022'=>'0022Data'
//    ]);
//    广播给全部actor
    $ret = \EasySwoole\Actor\Actor::getInstance()->client(\App\Actor\RoomActor::class)->broadcastPush('121212');
//    退出全部actor
    $ret = \EasySwoole\Actor\Actor::getInstance()->client(\App\Actor\RoomActor::class)->exitAll();
    var_dump($ret);
});
```

> 注意请基于协程实现，不要在actor中写阻塞代码，否则效率会非常差。实现代码目录在 https://github.com/easy-swoole/actor


> FastCache只能在服务启动之后使用,需要有创建unix sock权限(建议使用vm,docker或者linux系统开发)

### unable to connect to unix:///报错
该报错是因为系统不支持unix sock或没有权限创建或者是访问unix sock,请换成换成linux系统或虚拟机,docker等环境

> 使用虚拟机,docker等方式开发,不能在共享文件夹使用，因为unixsock 无法在共享目录中正确读写，或者修改EASYSWOOLE的临时目录，把unxisock文件挂载在非共享目录即可.
