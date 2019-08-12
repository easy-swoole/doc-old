# FastCacheQueue
EasySwoole FastCache component added message queue support when `>= 1.1.8'.

- Multiple queues can be created
- Support Delayed Delivery
- Task Overtime Recovery Execution
- Task Re-execution
- Maximum number of task retransmissions


# Service registration

First, check the FastCache Basic User Manual for component registration.

After updating，EasySwoole\FastCache\CacheProcessConfig has the following methods
```php
/** Setting process maximum memory default 512M */
public function setMaxMem(string $maxMem): void
/** Set the message queue retention time by default of 60s (the queue will be replayed if the task is removed without timely confirmation) */
public function setQueueReserveTime(int $queueReserveTime): void
/** Setting the maximum number of message queues to be retransmitted by default 10 times will be discarded */
public function setQueueMaxReleaseTimes(int $queueMaxReleaseTimes): void
```

# Start using

Both Job and Cache in the sample code below use the following namespaces
```
use EasySwoole\FastCache\Cache;
use EasySwoole\FastCache\Job;
```


## Delivery task

JobId for this task will be returned after successful delivery.

There are no failures unless fastCache registration fails.

```php
$job = new Job();
$job->setData("siam"); // Any type of data
$job->setQueue("siam_queue");
$jobId = Cache::getInstance()->putJob($job);
var_dump($jobId);
```

## Get task

Custom processes can be opened as consumers, circularly monitor queues, and perform task processing.

> Note: Task execution must have a result. Either delete the task or resend it. Otherwise, when the task takes out a certain time (default 60s), it will be automatically put back into the queue.

```php
$job = Cache::getInstance()->getJob('siam_queue');// Job object or null
if ($job === null){
    echo "No task\n";
}else{
    // Executing business logic
    var_dump($job);
    // Delete or resend after execution, otherwise automatically resend after timeout
    Cache::getInstance()->deleteJob($job);
}
```

## Delayed execution of tasks

```php
$job = new Job();
$job->setData("siam");
$job->setQueue("siam_queue_delay");
$job->setDelay(5);// Delay 5S
$jobId = Cache::getInstance()->putJob($job);
var_dump($jobId);
// Failure to take the meeting immediately and success every five seconds
$job = Cache::getInstance()->getJob('siam_queue_delay');
var_dump($job);
```

## Delete tasks

It can be an object taken out by getJob, or it can declare the Job object itself and pass in JobId to delete it.
```php
$job = new Job();
$job->setJobId(1);
Cache::getInstance()->deleteJob($job);
```

## Task Re-issuance

If task execution fails or some scenarios need to be re-executed, they can be re-issued.

When retransmitting, you can specify whether execution is delayed.

```php
// The task that gets out fails to execute and can be reissued
$job = new Job();
$job->setData("siam");
$job->setQueue("siam_queue");
$jobId = Cache::getInstance()->putJob($job);

$job = Cache::getInstance()->getJob('siam_queue');

if ($job === null){
    echo "No task\n";
}else{
    // Executing business logic
    $doRes = false;
    if (!$doRes){
        // Business logic fails and needs to be reissued
        // If the delayed queue needs to be retransmitted immediately, the delay attribute needs to be cleared here
        // $job->setDelay(0);
        // If a normal queue needs to delay retransmitting, set the delay attribute
        // $job->setDelay(5);
        $res = Cache::getInstance()->releaseJob($job);
        var_dump($res);
    }else{
        // Delete or resend after execution, otherwise automatically resend after timeout
        Cache::getInstance()->deleteJob($job);
    }
}
```

## Return to what queue you have now

```php
$queues = Cache::getInstance()->jobQueues();
var_dump($queues);
```

## Return the length of a queue

```php
$queueSize = Cache::getInstance()->jobQueueSize("siam_queue");
$queueSize2 = Cache::getInstance()->jobQueueSize("siam_queue_delay");
var_dump($queueSize);
var_dump($queueSize2);
```

## Empty queue can be named

```php
// Clean up all
$res = Cache::getInstance()->flushJobQueue();
var_dump($res);

// Clear the siam_queue queue
$res = Cache::getInstance()->flushJobQueue('siam_queue');
var_dump($res);
```

## Change the task to a delayed state

```php
//Adding tasks
$job = new Job();
$job->setData("LuffyQAQ");
$job->setQueue("LuffyQAQ_queue_delay");
$jobId = Cache::getInstance()->putJob($job);

//Method one: Direct into JobId
$job->setJobId($jobId);
$job->setDelay(30);
var_dump(Cache::getInstance()->delayJob($job));

//Method two: get task
$job = Cache::getInstance()->getJob('LuffyQAQ_queue_delay');
$job->setDelay(30);
var_dump(Cache::getInstance()->delayJob($job));

//Use JobQueueSize to view queue length
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_delay");
var_dump($queueSize);




```

## Change the task to a reserved state

```php
//Adding tasks
$job = new Job();
$job->setData("LuffyQAQ");
$job->setQueue("LuffyQAQ_queue_delay");
$jobId = Cache::getInstance()->putJob($job);

//Method 1: Direct into JobId
$job->setJobId($jobId);
var_dump(Cache::getInstance()->reserveJob($job));

//Method 2: get task
$job = Cache::getInstance()->getJob('LuffyQAQ_queue_delay');
var_dump(Cache::getInstance()->reserveJob($job));

//Use JobQueueSize to view queue length
$queueSize = Cache::getInstance()->jobQueueSize("LuffyQAQ_queue_delay");
var_dump($queueSize);
```

## Change the mission to buried status

`To be continued...`
