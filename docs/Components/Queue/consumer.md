# Queue消费者

- 需要先定义消费进程文件
- 注册消费进程


## 定义消费进程

```php
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

## 注册消费进程

```php

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
    public static function mainServerCreate(EventRegister $register)
    {
        Redis::getInstance()->register('queue',new \EasySwoole\RedisPool\Config());

        // 这里是Es提供的默认驱动 基于Redis 
        // 第一个参数是连接池名称，第二个参数是队列名称 可以自定义
        $driver = new \EasySwoole\Queue\Driver\Redis('queue','queue');
        Queue::getInstance($driver);

        $process = new QueueProcess('QueueProcess',null,false,2,true);
        /**
         * 需要多个进程消费，则new 多个QueueProcess 即可
         */
        ServerManager::getInstance()->addProcess($process);

        // 这里提供了默认的任务投递示例
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
}
```