# QueueDrive

We can customize the driver to implement the packaging of consumer queue software such as RabbitMQ.

Define the class and inherit the `EasySwoole\Queue\QueueDriverInterface` interface to implement several methods.

## QueueDriverInterface


```php
namespace EasySwoole\Queue;
interface QueueDriverInterface
{
    public function push(Job $job):bool ;
    public function pop(float $timeout = 3.0):?Job;
    public function size():?int ;
}
```

## Comes with redis drive

```php
namespace EasySwoole\Queue\Driver;


use EasySwoole\Queue\Job;
use EasySwoole\Queue\QueueDriverInterface;
use EasySwoole\Redis\Redis as Connection;
use EasySwoole\RedisPool\RedisPool;

class Redis implements QueueDriverInterface
{

    protected $pool;
    protected $queueName;
    public function __construct(RedisPool $pool,string $queueName = 'EasySwoole')
    {
        $this->pool = $pool;
        $this->queueName = $queueName;
    }

    public function push(Job $job): bool
    {
        $data = $job->__toString();
        return $this->pool->invoke(function (Connection $connection)use($data){
            return $connection->lPush($this->queueName,$data);
        });
    }

    public function pop(float $timeout = 3.0): ?Job
    {
        return $this->pool->invoke(function (Connection $connection){
            $data =  json_decode($connection->rPop($this->queueName),true);
            if(is_array($data)){
                return new Job($data);
            }else{
                return null;
            }
        });
    }

    public function size(): ?int
    {
        return $this->pool->invoke(function (Connection $connection){
            return $connection->lLen($this->queueName);
        });
    }
}
```