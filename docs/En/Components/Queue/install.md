# Queue Introduction

The Easyswoole package implements a lightweight queue, with Redis as the queue driver by default.

You can implement a queue driver yourself to implement queue storage in kafka or boot mode.

As you can see, Queue is not a separate component, it is more like a facade component that uniformly encapsulates different driver queues.

# start installation

```
Composer require easyswoole/queue
```

# manual

- Register queue driver
- Set the consumption process
- Producer delivery task

## Redis driver example

```php
use EasySwoole\Redis\Config\RedisConfig;
use EasySwoole\RedisPool\RedisPool;
use EasySwoole\Queue\Driver\Redis;
use EasySwoole\Queue\Queue;
use EasySwoole\Queue\Job;

$config = new RedisConfig([
    'host'=>'127.0.0.1'
]);
$redis = new RedisPool($config);

$driver = new Redis($redis);
$queue = new Queue($driver);

go(function ()use($queue){
    while (1){
        $job = new Job();
        $job->setJobData(time());
        $id = $queue->producer()->push($job);
        var_dump('job create for Id :'.$id);
        \co::sleep(3);
    }
});

go(function ()use($queue){
    $queue->consumer()->listen(function (Job $job){
        var_dump($job->toArray());
    });
});
```