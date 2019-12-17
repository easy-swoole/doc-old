---
title: FastCache-Queue
meta:
  - name: description
    content: Implement a simple native cache with the swoole custom process and implement queue features
  - name: keywords
    content: swoole|swoole extension|swoole framework|FastCache-Queue|Queue|EasySwoole FastCache|swoole Cache|swoole Cross-Process Cache
---

# FastCacheQueue
The EasySwoole FastCache component adds a similar · beanstalkd message queue feature when `>= 1.2.1`.

- Can create multiple queues
- Support for delayed delivery
- Task timeout resumes execution
- Task resend execution
- Maximum number of retransmissions for the task
- Support for putJob, delayJob, releaseJob, reserveJob, buryJob, kickJob, etc.




# Service registration

First check the FastCache basic user manual for component registration.


After the update, the EasySwoole\FastCache\CacheProcessConfig class has the following methods.
```php
/** Set process maximum memory Default 512M */
Public function setMaxMem(string $maxMem): void
/** Set message queue retention time Default 60s (If you do not confirm in time after removing the task, it will be put back into the queue) */
Public function setQueueReserveTime(int $queueReserveTime): void
/** Set the maximum number of resends for the message queue. Default 10 Retransmission will be discarded after the number of hits */
Public function setQueueMaxReleaseTimes(int $queueMaxReleaseTimes): void
```

# start using

The following code is used for both the Job and Cache of the sample code below.
```php
use EasySwoole\FastCache\Cache;
use EasySwoole\FastCache\Job;
```


## Delivery task

After the delivery is successful, the jobId of the task will be returned.

There is no failure unless the fastCache registration fails.

```php
$job = new Job();
$job->setData("siam"); // any type of data
$job->setQueue("siam_queue");
$jobId = Cache::getInstance()->putJob($job);
Var_dump($jobId);
```

## Take out the task

You can turn on the custom process as the consumer, loop the listener queue, and perform task processing.


::: warning
  Note: There must be a result when the task is completed. Either delete the task or resend it. Otherwise, when the task is taken out for a certain period of time (default 60s), it will be automatically put back into the queue.
:::

```php
$job = Cache::getInstance()->getJob('siam_queue');// Job object or null
if ($job === null){
    echo "No task\n";
}else{
    // Execute business logic
    Var_dump($job);
    // After the execution is finished, delete or resend, otherwise the timeout will be automatically resent.
    Cache::getInstance()->deleteJob($job);
}
```

## Empty the ready task queue

```php

 var_dump(Cache::getInstance()->flushReadyJobQueue('siam_queue'));

 var_dump(Cache::getInstance()->jobQueueSize('siam_queue'));
```

## Delayed execution of tasks

```php
$job = new Job();
$job->setData("siam");
$job->setQueue("siam_queue_delay");
$job->setDelay(5);// Delay 5s
$jobId = Cache::getInstance()->putJob($job);
var_dump($jobId);
// I will fail to get it right away. I will succeed only after 5s.
$job = Cache::getInstance()->getJob('siam_queue_delay');
var_dump($job);
```



## Delete task

It can be an object taken by getJob, or you can declare the Job object yourself, and pass in the JobId to delete it.
```php
$job = new Job();
$job->setJobId(1);
$job->setQueue('siam_queue_delay');
Cache::getInstance()->deleteJob($job);
```

## Task resend

If the task fails to execute, or some scenarios need to be re-executed, you can resend it.

When resending, you can specify whether to delay execution.

```php
// get the task that failed to execute can be resent
$job = new Job();
$job->setData("siam");
$job->setQueue("siam_queue");
$jobId = Cache::getInstance()->putJob($job);

$job = Cache::getInstance()->getJob('siam_queue');

if ($job === null){
    echo "No task\n";
}else{
    // Execution of business logic
    $doRes = false;
    if (!$doRes){
        // Business logic failed and needs to be resent
        // If the delay queue needs to be resent immediately, you need to clear the delay attribute here.
        // $job->setDelay(0);
        // If the normal queue needs to delay retransmission, set the delay attribute
        // $job->setDelay(5);
        $res = Cache::getInstance()->releaseJob($job);
        var_dump($res);
    }else{
        // To delete or resend after execution, otherwise the timeout will be automatically resent.
        Cache::getInstance()->deleteJob($job);
    }
}
```

## Back to what queue is there now

```php
$queues = Cache::getInstance()->jobQueues();
Var_dump($queues);
```

## Returns the length of a queue

```php
$queueSize = Cache::getInstance()->jobQueueSize("siam_queue");
$queueSize2 = Cache::getInstance()->jobQueueSize("siam_queue_delay");
var_dump($queueSize);
var_dump($queueSize2);
```

## Clear Queue Can specify a name

```php
// empty all
$res = Cache::getInstance()->flushJobQueue();
Var_dump($res);

// empty the siam_queue queue
$res = Cache::getInstance()->flushJobQueue('siam_queue');
Var_dump($res);
```

## Change task to delayed state

```php
// Add a task
$job = new Job();
$job->setData("LuffyQAQ");
$job->setQueue("LuffyQAQ_queue_delay");
$jobId = Cache::getInstance()->putJob($job);

// Method 1 directly into the jobId
$job->setJobId($jobId);
$job->setDelay(30);
Var_dump(Cache::getInstance()->delayJob($job));

//Method 2 Take the task
$job = Cache::getInstance()->getJob('LuffyQAQ_queue_delay');
$job->setDelay(30);
Var_dump(Cache::getInstance()->delayJob($job));

// Use jobQueueSize to view the queue length
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_delay");
var_dump($queueSize);


```


## Take from the delayed execution queue

```php
// Incoming queue name
Var_dump(Cache::getInstance()->getDelayJob('LuffyQAQ_queue_delay'));

```


## Clear the delay task queue

```php

  Var_dump(Cache::getInstance()->flushDelayJobQueue('LuffyQAQ_queue_delay'));

  Var_dump(Cache::getInstance()->jobQueueSize('LuffyQAQ_queue_delay'));
```



## Change task to reserved state

```php
// Add a task
$job = new Job();
$job->setData("LuffyQAQ");
$job->setQueue("LuffyQAQ_queue_reserve");
$jobId = Cache::getInstance()->putJob($job);

// Method 1 directly into the jobId
$job->setJobId($jobId);
Var_dump(Cache::getInstance()->reserveJob($job));

//Method 2 Take the task
$job = Cache::getInstance()->getJob('LuffyQAQ_queue_reserve');
Var_dump(Cache::getInstance()->reserveJob($job));

// Use jobQueueSize to view the queue length
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_reserve");
Var_dump($queueSize);
```

## Take from the reservation queue

```php
// Incoming queue name
Var_dump(Cache::getInstance()->getReserveJob('LuffyQAQ_queue_reserve'));

```

## Empty the reserve task queue

```php

  Var_dump(Cache::getInstance()->flushReserveJobQueue('LuffyQAQ_queue_reserve'));

  Var_dump(Cache::getInstance()->jobQueueSize('LuffyQAQ_queue_reserve'));
```

## Change the task to the buried state

```php
$job = new Job();
$job->setQueue('LuffyQAQ_queue_bury');
$job->setData('LuffyQAQ');
$jobId = Cache::getInstance()->putJob($job);
$job->setJobId($jobId);


var_dump(Cache::getInstance()->buryJob($job));

//Use jobQueueSize to view queue length
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_bury");
var_dump($queueSize);

```

## Take from the buried queue

```php
// Incoming queue name
Var_dump(Cache::getInstance()->getBuryJob('LuffyQAQ_queue_bury'));

```

## Restore buried queue tasks to ready

```php

Var_dump(Cache::getInstance()->kickJob($job));

```

## Empty bury task queue

```php

 var_dump(Cache::getInstance()->flushBuryJobQueue('LuffyQAQ_queue_bury'));

 var_dump(Cache::getInstance()->jobQueueSize('LuffyQAQ_queue_bury'));
```
