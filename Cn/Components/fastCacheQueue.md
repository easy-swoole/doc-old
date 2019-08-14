<head>
     <title>EasySwoole FastCache|swoole 缓存|swoole 跨进程缓存</title>
     <meta name="keywords" content="EasySwoole FastCache|swoole 缓存|swoole 跨进程缓存"/>
     <meta name="description" content="利用swoole自定义进程实现简单的本机缓存"/>
</head>
---<head>---

# FastCacheQueue
EasySwoole FastCache组件在`>= 1.2.1`的时候新增类似· beanstalkd消息队列 ·特性。

- 可以创建多个queue
- 支持延迟投递
- 任务超时恢复执行
- 任务重发执行
- 任务最大重发次数
- 支持putJob、delayJob、releaseJob、reserveJob、buryJob、kickJob等命令




# 服务注册

首先查看FastCache基础使用手册，进行组件注册。


更新后，EasySwoole\FastCache\CacheProcessConfig类多出以下方法
```php
/** 设置进程最大内存 默认512M */
public function setMaxMem(string $maxMem): void
/** 设置消息队列保留时间 默认60s （取出任务后没有及时确认会重新放回队列） */
public function setQueueReserveTime(int $queueReserveTime): void
/** 设置消息队列最大重发次数 默认10 达到次数后重发将会被丢弃 */
public function setQueueMaxReleaseTimes(int $queueMaxReleaseTimes): void
```

# 开始使用

下文示例代码的Job和Cache都使用以下命名空间
```
use EasySwoole\FastCache\Cache;
use EasySwoole\FastCache\Job;
```


## 投递任务

投递成功之后 将会返回该任务的jobId。

没有失败情况，除非fastCache注册注册失败。

```php
$job = new Job();
$job->setData("siam"); // 任意类型数据
$job->setQueue("siam_queue");
$jobId = Cache::getInstance()->putJob($job);
var_dump($jobId);
```

## 取出任务

可以开启自定义进程当消费者，循环监听队列，执行任务处理。

> 注意：任务执行完成一定要有一个结果。要么删除该任务，要么重发。否则当任务取出一定时间后（默认60s）会自动放回队列中。

```php
$job = Cache::getInstance()->getJob('siam_queue');// Job对象或者null
if ($job === null){
    echo "没有任务\n";
}else{
    // 执行业务逻辑
    var_dump($job);
    // 执行完了要删除或者重发，否则超时会自动重发
    Cache::getInstance()->deleteJob($job);
}
```

## 清空ready任务队列

```php

 var_dump(Cache::getInstance()->flushReadyJobQueue('siam_queue'));

 var_dump(Cache::getInstance()->jobQueueSize('siam_queue'));
```

## 延迟执行任务

```php
$job = new Job();
$job->setData("siam");
$job->setQueue("siam_queue_delay");
$job->setDelay(5);// 延时5s
$jobId = Cache::getInstance()->putJob($job);
var_dump($jobId);
// 马上取会失败 隔5s取才成功
$job = Cache::getInstance()->getJob('siam_queue_delay');
var_dump($job);
```



## 删除任务

可以是由getJob取出的对象，也可以自己声明Job对象，传入JobId来删除。
```php
$job = new Job();
$job->setJobId(1);
$job->setQueue('siam_queue_delay');
Cache::getInstance()->deleteJob($job);
```

## 任务重发

任务执行失败，或者某些场景需要重新执行，则可以重发。

重发时，可以指定是否延迟执行。

```php
// get出来的任务执行失败可以重发
$job = new Job();
$job->setData("siam");
$job->setQueue("siam_queue");
$jobId = Cache::getInstance()->putJob($job);

$job = Cache::getInstance()->getJob('siam_queue');

if ($job === null){
    echo "没有任务\n";
}else{
    // 执行业务逻辑
    $doRes = false;
    if (!$doRes){
        // 业务逻辑失败,需要重发  
        // 如果延迟队列需要马上重发,在这里需要清空delay属性
        // $job->setDelay(0);
        // 如果普通队列需要延迟重发,则设置delay属性
        // $job->setDelay(5);
        $res = Cache::getInstance()->releaseJob($job);
        var_dump($res);
    }else{
        // 执行完了要删除或者重发，否则超时会自动重发
        Cache::getInstance()->deleteJob($job);
    }
}
```

## 返回现在有什么队列

```php
$queues = Cache::getInstance()->jobQueues();
var_dump($queues);
```

## 返回某个队列的长度

```php
$queueSize = Cache::getInstance()->jobQueueSize("siam_queue");
$queueSize2 = Cache::getInstance()->jobQueueSize("siam_queue_delay");
var_dump($queueSize);
var_dump($queueSize2);
```

## 清空队列 可指定名称

```php
// 清空全部
$res = Cache::getInstance()->flushJobQueue();
var_dump($res);

// 清空siam_queue队列
$res = Cache::getInstance()->flushJobQueue('siam_queue');
var_dump($res);
```

## 将任务改为延迟状态

```php
//添加任务
$job = new Job();
$job->setData("LuffyQAQ");
$job->setQueue("LuffyQAQ_queue_delay");
$jobId = Cache::getInstance()->putJob($job);

//方法一 直接传入jobId
$job->setJobId($jobId);
$job->setDelay(30);
var_dump(Cache::getInstance()->delayJob($job));

//方法二 取出任务
$job = Cache::getInstance()->getJob('LuffyQAQ_queue_delay');
$job->setDelay(30);
var_dump(Cache::getInstance()->delayJob($job));

//使用jobQueueSize查看队列长度
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_delay");
var_dump($queueSize);


```


## 从延迟执行队列中拿取

```php
//传入队列名
var_dump(Cache::getInstance()->getDelayJob('LuffyQAQ_queue_delay'));

```


## 清空delay任务队列

```php

 var_dump(Cache::getInstance()->flushDelayJobQueue('LuffyQAQ_queue_delay'));

 var_dump(Cache::getInstance()->jobQueueSize('LuffyQAQ_queue_delay'));
```



## 将任务改为保留状态

```php
//添加任务
$job = new Job();
$job->setData("LuffyQAQ");
$job->setQueue("LuffyQAQ_queue_reserve");
$jobId = Cache::getInstance()->putJob($job);

//方法一 直接传入jobId
$job->setJobId($jobId);
var_dump(Cache::getInstance()->reserveJob($job));

//方法二 取出任务
$job = Cache::getInstance()->getJob('LuffyQAQ_queue_reserve');
var_dump(Cache::getInstance()->reserveJob($job));

//使用jobQueueSize查看队列长度
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_reserve");
var_dump($queueSize);
```

## 从保留队列中拿取

```php
//传入队列名
var_dump(Cache::getInstance()->getReserveJob('LuffyQAQ_queue_reserve'));

```

## 清空reserve任务队列

```php

 var_dump(Cache::getInstance()->flushReserveJobQueue('LuffyQAQ_queue_reserve'));

 var_dump(Cache::getInstance()->jobQueueSize('LuffyQAQ_queue_reserve'));
```

## 将任务改为埋藏状态

```php
$job = new Job();
$job->setQueue('LuffyQAQ_queue_bury');
$job->setData('LuffyQAQ');
$jobId = Cache::getInstance()->putJob($job);
$job->setJobId($jobId);


var_dump(Cache::getInstance()->buryJob($job));

//使用jobQueueSize查看队列长度
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_bury");
var_dump($queueSize);

```

##  从埋藏队列中拿取

```php
//传入队列名
var_dump(Cache::getInstance()->getBuryJob('LuffyQAQ_queue_bury'));

```

## 将埋藏队列任务恢复到ready中

```php

var_dump(Cache::getInstance()->kickJob($job));

```

## 清空bury任务队列

```php

 var_dump(Cache::getInstance()->flushBuryJobQueue('LuffyQAQ_queue_bury'));

 var_dump(Cache::getInstance()->jobQueueSize('LuffyQAQ_queue_bury'));
```
