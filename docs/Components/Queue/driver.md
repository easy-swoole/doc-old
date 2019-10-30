# Queue驱动

我们可以自定义驱动，实现RabbitMQ等消费队列软件的封装。

定义类，并继承`EasySwoole\Queue\QueueDriverInterface`接口，实现几个方法即可。

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

## redis队列驱动示例

```php
namespace EasySwoole\Queue\Driver;
use EasySwoole\Queue\Exception\Exception;
use EasySwoole\Queue\Job;
use EasySwoole\Queue\QueueDriverInterface;
use EasySwoole\Redis\Config\RedisConfig;
use EasySwoole\Redis\Redis as Connection;
use EasySwoole\RedisPool\Redis as Pool;

class Redis implements QueueDriverInterface
{
    protected $pool;
    protected $queueName;
    public function __construct(string $poolKey,string $queueName)
    {
        $this->pool = Pool::getInstance()->pool($poolKey);
        //强制进行php序列化
        $this->pool->getRedisConfig()->setSerialize(RedisConfig::SERIALIZE_PHP);
        if(!$this->pool){
            throw new Exception("redis pool {$poolKey} is unregister");
        }
        $this->queueName = $queueName;
    }
    public function push(Job $job): bool
    {
        $array = $job->toArray();
        return $this->pool->invoke(function (Connection $connection)use($array){
            return $connection->lPush($this->queueName,$array);
        });
    }
    public function pop(float $timeout = 3.0): ?Job
    {
        return $this->pool->invoke(function (Connection $connection){
            $data =  $connection->rPop($this->queueName);
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