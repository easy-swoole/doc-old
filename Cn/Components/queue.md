# Queue
Easyswoole封装实现了一个轻量级的队列，默认以Redis作为队列驱动器。

## 安装
```
composer require  easyswoole/queue
```

## 使用
```php
use EasySwoole\RedisPool\Redis;
use EasySwoole\RedisPool\Config();
use EasySwoole\Queue\Driver\Redis as RedisDirver;
use EasySwoole\Queue\Queue;
use EasySwoole\Queue\Job;
go(function (){
    /*
        注册一个名为queue的redis连接池
    */
    Redis::getInstance()->register('queue',new Config());
    /*
        实例化默认自带的Redis队列驱动
    */
    $driver = new RedisDirver('queue','queue');
    /*
        创建一个队列
    */
    $queue = new Queue($driver);
    
    /*
        生产者
    */
    go(function ()use($queue){
        while (1){
            $job = new Job();
            $job->setJobData(time());
            $id = $queue->producer()->push($job);
            var_dump('job create for Id :'.$id);
            \co::sleep(3);
        }
    });
    /*
        消费者
     */
    go(function ()use($queue){
        $queue->consumer()->listen(function (Job $job){
            var_dump($job->toArray());
        });
    });
});
```

> 可以自己实现一个队列驱动来实现用kafka或者启动方式的队列存储

## EasySwoole

### 定义一个单例对象的Queue
```
namespace App\Utility;


use EasySwoole\Component\Singleton;

class Queue extends \EasySwoole\Queue\Queue
{
    use Singleton;
}
```

> 这样做是为了方便快速调用，而默认库不单例，是为了方便用户实现多个队列

### 定义一个消费进程

```
namespace App\Utility;


use EasySwoole\Component\Process\AbstractProcess;
use EasySwoole\Queue\Job;

class QueueProcess extends AbstractProcess
{

    protected function run($arg)
    {
        Queue::getInstance()->consumer()->listen(function (Job $job){
            var_dump($job->toArray());
        });
    }

    protected function onShutDown()
    {
        Queue::getInstance()->consumer()->stopListen();
    }
}
```

### 进行事件注册
```
namespace EasySwoole\EasySwoole;


use App\Utility\Queue;
use App\Utility\QueueProcess;
use EasySwoole\Component\Timer;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\Queue\Job;
use EasySwoole\RedisPool\Redis;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        Redis::getInstance()->register('queue',new \EasySwoole\RedisPool\Config());
        $driver = new \EasySwoole\Queue\Driver\Redis('queue','queue');
        Queue::getInstance($driver);
        $process = new QueueProcess('QueueProcess',null,false,2,true);
        /*
         * 需要多个进程消费，则new 多个QueueProcess 即可
         */
        ServerManager::getInstance()->addProcess($process);

        $register->add($register::onWorkerStart,function ($ser,$workerId){
            if($workerId == 0){
                Timer::getInstance()->loop(3000,function (){
                    $job = new Job();
                    $job->setJobData(time());
                    Queue::getInstance()->producer()->push($job);
                });
            }
        });

    }

    public static function onRequest(Request $request, Response $response): bool
    {
        return  false;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```