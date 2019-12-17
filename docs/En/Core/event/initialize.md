---
title: initialize
meta:
  - name: description
    content: 框架初始化事件
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole|swoole|initialize
---
# Framework initializes Events

## The function prototype

```php
public static function initialize(): void
{
}
```

## Finished work

EasySwoole has done the following when executing the framework initialization event: 

- The definition of the global constant EASYSWOOLE_ROOT
- System default Log/Temp directory definition


## Processable content

In this event, some system constant changes and global configuration can be made, for example：

- Modify and create the system default Log/Temp directory。
- Introduce user-defined configurations
- Register database,redis connection pool
- trace registration

## Call the coroutine API before starting
```php
use Swoole\Coroutine\Scheduler;
$scheduler = new Scheduler();
$scheduler->add(function() {
    /*  Call the coroutine API */
});
$scheduler->start();
//Clear all timers
\Swoole\Timer::clearAll();
```
