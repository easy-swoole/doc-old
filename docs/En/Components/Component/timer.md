---
title: timer
meta:
  - name: description
    content:  We can use swoole timer to realize millisecond level timer and some traps of timer
  - name: keywords
    content: swoole|swoole expand|swoole frame|EasySwoole timer|swoole timer|swoole timing task
---

# timer
The framework encapsulates the native millisecond timer so that developers can quickly call the native timer of swoole. The namespace of timer class is `EasySwoole\Component\Timer`


::: warning 
 Note: the time parameter unit passed in by the timer is milliseconds and executed in seconds. Do not forget to multiply by 1000. If the reload ﹣ async configuration is enabled, please move the timer to the custom process, otherwise the worker process will not reload
:::


## Loop execution

Set an interval clock timer, which will be triggered at regular intervals until the 'clear' operation is performed. The corresponding native timer function of swoole is `swoole_timer_tick`

### Function prototype

```php
/**
* Cyclic invocation
* @param int      $microSeconds The number of milliseconds between loop execution passed into integer type
* @param \Closure $func The timer needs to perform an operation passed in a closure the timer needs to perform an operation passed in a closure
* @param string    $name Timer name, used to cancel the timer
* @return int Return the timer number of integer type to stop the timer
*/
public function loop($microSeconds, \Closure $func, $args = null)
```

### Sample code

```php
// Every 10 seconds
\EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
    echo "this timer runs at intervals of 10 seconds\n";
});
```



## Delayed execution

Set a delay timer to trigger the corresponding operation after delaying the specified time. Only one operation will be performed. The corresponding native timer function of swoole is `swoole_timer_after`

### Function prototype

```php
/**
* Delayed call
* @param int      $microSeconds Time to delay execution
* @param \Closure $func The timer needs to perform an operation to pass a closure
* @return int Returns the timer number of the integer type
*/
public function after($microSeconds, \Closure $func)
```

### Sample code

```php
// Once in 10 seconds
\EasySwoole\Component\Timer::getInstance()->after(10 * 1000, function () {
    echo "ten seconds later\n";
});
```



## Clear timer


::: warning 
 Note: this operation cannot be used to clear the timers of other processes, only for the current process
:::

When the timer is created successfully, an integer number will be returned. Call this function to pass in the number, and the timer can be stopped in advance. The corresponding native timer function of swoole is `swoole_timer_clear`

### Function prototype

```php
/**
* Clear timer
* @param int $timerId|$timeName Timer number or name
* @author : evalor <master@evalor.cn>
*/
public function clear($timerId)
```

### Sample code

```php
// Create a 2 second timer
$timerId = \EasySwoole\Component\Timer::getInstance()->loop(2 * 1000, function () {
    echo "timeout\n";
},'time');

// Clear the timer
//var_dump(\EasySwoole\Component\Timer::getInstance()->clear($timerId)); // bool(true)
var_dump($timerId); // int(1)

// Timer not available, no output：timeout
```


## Application example


::: warning 
 Note: the timer cannot be used before the service starts. After the service is started, the added timer is only valid in the current process. When adding a timer in the workerstart event, please pay attention to judge whether the workerid of the timer needs to be added will be executed in each process
:::

```php
// Add timer for first worker
if ($workerId == 0) {
	\EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
		echo "timer in the worker number 0\n";
	});
}
```

```php
public static function mainServerCreate(EventRegister $register)
{
    $register->add(EventRegister::onWorkerStart, function (\swoole_server $server, $workerId) {
        //How to avoid timer loss due to process restart
        //For example, add a 10 second timer to the first process
        if ($workerId == 0) {
            \EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
                // From the database or redis, get the next task to be executed in the nearest 10 seconds
                // For example: a task after 2 seconds and a task code after 3 seconds are as follows
                \EasySwoole\Component\Timer::getInstance()->after(2 * 1000, function () {
                    //In order to prevent the timer from being inaccurate due to task blocking, the task is sent to the asynchronous process for processing
                    Logger::getInstance()->console("time 2", false);
                });
                \EasySwoole\Component\Timer::getInstance()->after(3 * 1000, function () {
                    //In order to prevent the timer from being inaccurate due to task blocking, the task is sent to the asynchronous process for processing
                    Logger::getInstance()->console("time 3", false);
                });
            });
        }
    });
}
```

### Classic case - order status timeout monitoring
Scenario Description: in many rush to buy scenarios, after the order is placed, the payment time needs to be limited, or in chess and card games, the room status needs to be monitored. Then we
You can first press the order or room to be monitored into the redis queue. Then use timer + asynchronous process to realize the cyclic monitoring of order status.
