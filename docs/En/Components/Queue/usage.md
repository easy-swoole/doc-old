# Queue use
## Defining a queue
```php
namespace App\Utility;


use EasySwoole\Component\Singleton;
use EasySwoole\Queue\Queue;

class MyQueue extends Queue
{
    use Singleton;
}
```

## Define the consumption process
```php
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
> Can multi-process, multi-correlation consumption


## Driver registration

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
        //Redis pool use please see redis chapter documentation
        $config = new RedisConfig([
            'host'=>'127.0.0.1'
        ]);
        $redis = new RedisPool($config);
        $driver = new Redis($redis);
        MyQueue::getInstance($driver);
        //Register a consumer process
        ServerManager::getInstance()->addProcess(new QueueProcess());
        //Simulated producers, can be delivered anywhere
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