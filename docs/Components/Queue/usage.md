# Queue使用
## 定义一个队列
```
namespace App\Utility;


use EasySwoole\Component\Singleton;
use EasySwoole\Queue\Queue;

class MyQueue extends Queue
{
    use Singleton;
}
```

## 定义消费进程
```
namespace App\Utility;


use EasySwoole\Component\Process\AbstractProcess;
use EasySwoole\Queue\Job;

class QueueProcess extends AbstractProcess
{

    protected function run($arg)
    {
        go(function (){
            MyQueue::getInstance()->consumer()->listen(function (Job $job){
                var_dump($job->toArray());
            });
        });
    }
}
```
> 可以多进程，多协程消费


## 驱动注册

```php
namespace EasySwoole\EasySwoole;


use App\Utility\MyQueue;
use App\Utility\QueueProcess;
use EasySwoole\Component\Timer;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\Queue\Driver\Redis;
use EasySwoole\Queue\Job;
use EasySwoole\Redis\Config\RedisConfig;
use EasySwoole\RedisPool\RedisPool;
use EasySwoole\Utility\Time;


class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        //redis pool使用请看redis 章节文档
        $config = new RedisConfig([
            'host'=>'127.0.0.1'
        ]);
        $redis = new RedisPool($config);
        $driver = new Redis($redis);
        MyQueue::getInstance($driver);
        //注册一个消费进程
        ServerManager::getInstance()->addProcess(new QueueProcess());
        //模拟生产者，可以在任意位置投递
        $register->add($register::onWorkerStart,function ($ser,$id){
            if($id == 0){
                Timer::getInstance()->loop(3000,function (){
                   $job = new Job();
                   $job->setJobData(['time'=>\time()]);
                   MyQueue::getInstance()->producer()->push($job);
                });
            }
        });

    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```