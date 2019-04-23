# Timer
The framework encapsulates the native millisecond timer so that developers can quickly call Swoole's native timer. The namespace of the timer class is `EasySwoole\Component\Timer`

> Note: The time parameter of the timer is in milliseconds. Do not forget to execute by the second. Multiply by 1000.
> If the reload_async configuration is enabled, move the timer to the custom process. Otherwise, the worker process cannot be reloaded.



## Loop execution

Set an interval clock timer, which is triggered at regular intervals until the `clear` operation, and the corresponding Swoole timer function is `swoole_timer_tick`

### Function Prototype

```php
/**
* Loop call
* @param int $microSeconds Interval milliseconds for loop execution Integer type
* @param \Closure $func The action that the timer needs to perform. Pass in a closure.
* @param string $name The name of the timer used to cancel the timer
* @return int returns the integer type of timer number. You can use this number to stop the timer.
*/
Public function loop($microSeconds, \Closure $func, $args = null)
```

### Sample Code

```php
// execute every 10 seconds
\EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
    Echo "this timer runs at intervals of 10 seconds\n";
});
```



## Delay execution

Set a delay timer, trigger the corresponding operation after a specified time delay, only perform one operation, corresponding to the Swoole native timer function is `swoole_timer_after`

### Function Prototype

```php
/**
* Delayed call
* @param int $microSeconds Time to delay execution
* @param \Closure $func The action that the timer needs to perform. Pass in a closure.
* @return int returns the integer type of timer number
*/
Public function after($microSeconds, \Closure $func)
```

### Sample Code

```php
// Execute once in 10 seconds
\EasySwoole\Component\Timer::getInstance()->after(10 * 1000, function () {
    Echo "ten seconds later\n";
});
```



## Clear timer

> Note: This operation cannot be used to clear timers of other processes, only for the current process.

When the timer is successfully created, it will return an integer number. If you call this function to pass the number, you can stop the timer ahead of time. The corresponding Swoole timer function is `swoole_timer_clear`.

### Function Prototype

```php
/**
* Clear timer
* @param int $timerId|$timeName timer number or name
* @author : evalor <master@evalor.cn>
*/
Public function clear($timerId)
```

### Sample Code

```php
// Create a 2 second timer
$timerId = \EasySwoole\Component\Timer::getInstance()->loop(2 * 1000, function () {
    Echo "timeout\n";
},'time');

// clear the timer
//var_dump(\EasySwoole\Component\Timer::getInstance()->clear($timerId)); // bool(true)
Var_dump($timerId); // int(1)

// The timer is not executed. No output: timeout
```


## Applications

> Note: The timer cannot be used before the service is started. After the service is started, the added timer is only valid in the current process. When adding a timer to the workerStart event, please pay attention to determine the workerId that needs to be added to the timer. Otherwise, the timer will be executed in each process.

```php
// Add a timer to the first worker
If ($workerId == 0) {
\EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
Echo "timer in the worker number 0\n";
});
}
```

```php
Public static function mainServerCreate(EventRegister $register)
{
    $register->add(EventRegister::onWorkerStart, function (\swoole_server $server, $workerId) {
        / / How to avoid the timer is lost due to process restart
        // For example, in the first process, add a 10 second timer.
        If ($workerId == 0) {
            \EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
                // From the database, or redis, to get the next task that needs to be executed within 10 seconds
                // For example: a task after 2 seconds, a task after 3 seconds is as follows
                \EasySwoole\Component\Timer::getInstance()->loop(2 * 1000, function () {
                    / / In order to prevent the timer from being inaccurate because of the task blocking, the task is processed to the asynchronous process
                    Logger::getInstance()->console("time 2", false);
                });
                \EasySwoole\Component\Timer::getInstance()->after(3 * 1000, function () {
                    / / In order to prevent the timer from being inaccurate because of the task blocking, the task is processed to the asynchronous process
                    Logger::getInstance()->console("time 3", false);
                });
            });
        }
    });
}
```

### Classic Case - Order Status Timeout Monitoring
Scene Description: In many snapped-up scenarios, after the order is placed, it is necessary to limit the payment time, or in the board game, the room status needs to be monitored. Then we
You can first push the order to be monitored or the room into the redis queue. Then use the timer + asynchronous process to achieve cyclic monitoring of the order status.
