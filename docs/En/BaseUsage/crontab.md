---
title: Crontab planning task

meta:
  - name: description
    content: Crontab is a timer in Linux system. This paper mainly talks about how PHP implements crontab timer resolution rules by using swoole without relying on operation and maintenance
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole Crontab|swoole crontab|Swoole scheduled tasks|php timing
---

# Crontab timer
Easysoole supports users to add timers according to crontab rules. The minimum granularity of time is 1 minute.

## Realization principle
In the main process, each task rule and callback are registered. After the service is started, in the user-defined process, the timer is used to detect whether there is a task to be executed. If there is one, it is delivered to the asynchronous process for asynchronous execution.
The resolution rules can be referred to https://github.com/dragonmantank/cron-expression 。

## Sample code
EasySwooleEvent.php中
use EasySwoole\EasySwoole\Crontab\Crontab;
```php

    public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
        
        // Start a scheduled task plan 
        Crontab::getInstance()->addTask(TaskOne::class);
        // Start a scheduled task plan 
        Crontab::getInstance()->addTask(TaskTwo::class);
    }
```

## After task definition version 3.3.0
```php

namespace App;


use EasySwoole\EasySwoole\Crontab\AbstractCronTask;
use EasySwoole\EasySwoole\Task\TaskManager;

class TaskOne extends AbstractCronTask
{

    public static function getRule(): string
    {
        return '*/1 * * * *';
    }

    public static function getTaskName(): string
    {
        return  'taskOne';
    }

    function run(int $taskId, int $workerIndex)
    {
        var_dump('c');
        TaskManager::getInstance()->async(function (){
           var_dump('r');
        });
    }

    function onException(\Throwable $throwable, int $taskId, int $workerIndex)
    {
        echo $throwable->getMessage();
    }
}
```

```php

namespace App;


use EasySwoole\EasySwoole\Crontab\AbstractCronTask;
use EasySwoole\EasySwoole\Task\TaskManager;

class TaskTwo extends AbstractCronTask
{

    public static function getRule(): string
    {
        return '*/2 * * * *';
    }

    public static function getTaskName(): string
    {
        return  'taskTwo';
    }

    function run(int $taskId, int $workerIndex)
    {
        var_dump('c');
        TaskManager::getInstance()->async(function (){
           var_dump('r');
        });
    }

    function onException(\Throwable $throwable, int $taskId, int $workerIndex)
    {
        echo $throwable->getMessage();
    }
}
```

## Before task definition version 3.3.0


```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-6
 * Time: 下午3:30
 */

namespace App\Crontab;


use EasySwoole\EasySwoole\Crontab\AbstractCronTask;

class TaskOne extends AbstractCronTask
{

    public static function getRule(): string
    {
        // TODO: Implement getRule() method.
        // Timing period (per hour)
        return '@hourly';
    }

    public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // Scheduled task name
        return 'taskOne';
    }

    static function run(\swoole_server $server, int $taskId, int $fromWorkerId,$flags=null)
    {
        // TODO: Implement run() method.
        // Timed task processing logic
        var_dump('run once per hour');
    }
}
```

定时任务:TaskTwo.php

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-6
 * Time: 下午4:28
 */

namespace App\Crontab;


use EasySwoole\EasySwoole\Crontab\AbstractCronTask;

class TaskTwo extends AbstractCronTask
{

    public static function getRule(): string
    {
        // TODO: Implement getRule() method.
        // Timing cycle (every two minutes)
        return '*/2 * * * *';
    }

    public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // Scheduled task name
        return 'taskTwo';
    }

    static function run(\swoole_server $server, int $taskId, int $fromWorkerId,$flags=null)
    {
        // TODO: Implement run() method.
        // Timed task processing logic
        var_dump('run once every two minutes');
    }
}

```

The general expression rules of cron are as follows：
```

    *    *    *    *    *
    -    -    -    -    -
    |    |    |    |    |
    |    |    |    |    |
    |    |    |    |    +----- day of week (0 - 7) (Sunday=0 or 7)
    |    |    |    +---------- month (1 - 12)
    |    |    +--------------- day of month (1 - 31)
    |    +-------------------- hour (0 - 23)
    +------------------------- min (0 - 59)
```

Cron special expressions are as follows：
``` text
@yearly                    Once a year is equivalent to(0 0 1 1 *) 
@annually                  Once a year is equivalent to((0 0 1 1 *)
@monthly                   Once a month is equivalent to(0 0 1 * *) 
@weekly                    Once a week is equivalent to(0 0 * * 0) 
@daily                     Once a day is equivalent to(0 0 * * *) 
@hourly                    Once an hour is equivalent to(0 * * * *)
```
