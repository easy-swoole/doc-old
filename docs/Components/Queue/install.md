# Queue介绍

Easyswoole封装实现了一个轻量级的队列，默认以Redis作为队列驱动器。

可以自己实现一个队列驱动来实现用kafka或者启动方式的队列存储。

从上可知，Queue并不是一个单独使用的组件，它更像一个对不同驱动的队列进行统一封装的门面组件。

# 开始安装

```
composer require easyswoole/queue
```

# 使用流程

- 注册队列驱动器
- 设置消费进程
- 生产者投递任务

## Redis 驱动示例

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