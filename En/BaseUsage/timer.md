# Timer
The framework encapsulates Swoole's native millisecond timer so that developers can quickly call the native timer. The namespace of the timer class is `EasySwoole\Component\Timer`

> Note: The time parameter of the timer is in milliseconds. Do not forget to multiply it by 1000 when it is executed in second.
> If the reload_async configuration is enabled, please move the timer to the custom process. Otherwise, the worker process cannot be reloaded.

## Loop Execution
To set an interval clock timer, triggered regularly until the `clear` operation, you can call the corresponding Swoole timer function `swoole_timer_tick`

### Function Prototype

```php
/**
* Loop Call
* @param int $microSeconds executed recuurently in milliseconds as integer type
* @param \Closure $func the behavior that the timer needs to perform, passing in a closure
* @param string $name the name of the timer used to cancel the timer
* @return int returns the integer type of timer number which can be used to stop the timer
*/
public function loop($microSeconds, \Closure $func, $args = null)
```

### Sample Code

```php
// execute every 10 seconds
\EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
    Echo "this timer runs at intervals of 10 seconds\n";
});
```

## Delay Execution

ßTo set a delay timer, triggered one time operation after a specified delay of time, you can cal the Swoole native timer function `swoole_timer_after`

### Function Prototype

```php
/**
* Delayed call
* @param int $microSeconds delay of time to execute
* @param \Closure $func the behavior that the timer needs to perform, passing in a closure
* @return int returns the integer type of timer number
*/
public function after($microSeconds, \Closure $func)
```

### Sample Code

```php
// execute once after 10 seconds
\EasySwoole\Component\Timer::getInstance()->after(10 * 1000, function () {
    echo "ten seconds later\n";
});
```

## Clear Timer

> Note: This operation cannot be used to clear timers of other processes, only for the current process.

When the timer is successfully created, it will return an integer number. If you pass the number to the corresponding function, the timer can be stopped ahead of time. The Swoole's stop timer function is `swoole_timer_clear`.

### Function Prototype

```php
/**
* Clear timer
* @param int $timerId|$timeName timer number or name
* @author : evalor <master@evalor.cn>
*/
public function clear($timerId)
```

### Sample Code

```php
// create a 2 second timer
$timerId = \EasySwoole\Component\Timer::getInstance()->loop(2 * 1000, function () {
    echo "timeout\n";
},'time');

// clear the timer
// var_dump(\EasySwoole\Component\Timer::getInstance()->clear($timerId)); // bool(true)
var_dump($timerId); // int(1)

// The timer is not executed. No output: timeout
```


## Applications

> Note: The timer cannot be used before the service is started. After the service is started, the added timer is only valid in the current process. When adding a timer to the workerStart event, please pay attention to determine the workerId that needs to be added to the timer. Otherwise, the timer will be executed in each process.

```php
// add a timer to the first worker
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
        // how to avoid the timer is lost due to process restart
        // for example, in the first process, add a 10 second timer.
        If ($workerId == 0) {
            \EasySwoole\Component\Timer::getInstance()->loop(10 * 1000, function () {
                // from the database, or redis, to get the next task that needs to be executed within 10 seconds
                // for example: a task after 2 seconds, a task after 3 seconds is as follows
                \EasySwoole\Component\Timer::getInstance()->loop(2 * 1000, function () {
                    // in order to prevent the timer from being inaccurate because of the task blocking, the task is processed to the asynchronous process
                    Logger::getInstance()->console("time 2", false);
                });
                \EasySwoole\Component\Timer::getInstance()->after(3 * 1000, function () {
                    // in order to prevent the timer from being inaccurate because of the task blocking, the task is processed to the asynchronous process
                    Logger::getInstance()->console("time 3", false);
                });
            });
        }
    });
}
```

### Classic Case - Order Status Timeout Monitoring
Scene Description: In many snapped-up scenarios, it is necessary to limit the payment time after the order is placed, or the room status needs to be monitored in the board game. Then we can first monitor the purchasing order, or push the room into the redis queue. Then we use the timer with asynchronous process to achieve cyclic monitoring of their status.
