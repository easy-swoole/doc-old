<head>
     <title>Easyswoole Crontab|swoole crontab|swoole timing task|php timing</title>
     <meta name="keywords" content="Easyswoole Crontab|swoole crontab|swoole timing task|php timing"/>
     <meta name="description" content="Easyswoole Crontab|swoole crontab|swoole timing task|php timing"/>
</head>
---<head>---

# Crontab Timer
EasySwoole allows users to add timers based on Crontab rules. The minimum time granularity is 1 minute.

## Implementation Principle
Each task rule and callback are registered in the main process. After the service is started, the timer is used to detect whether there is a task to be executed in the custom process, and if a task is detected, it will be delivered to the asynchronous process to execute asynchronously.
The parsing rules can be implemented by referring to [cron-expression](https://github.com/dragonmantank/cron-expression).

## Sample Code
To use EasySwoole\EasySwoole\Crontab\Crontab in EasySwooleEvent.php

```
    Public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
        /**
         * **************** Crontab Mission Plan **********************
         */
        // start a scheduled task plan
        Crontab::getInstance()->addTask(TaskOne::class);
        // start a scheduled task plan
        Crontab::getInstance()->addTask(TaskTwo::class);
    }
```

Scheduled tasks: TaskOne.php

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-6
 * Time: 3:30 PM
 */

namespace App\Crontab;


use EasySwoole\EasySwoole\Crontab\AbstractCronTask;

class TaskOne extends AbstractCronTask
{

    public static function getRule(): string
    {
        // TODO: Implement getRule() method.
        // scheduled period (hourly)
        return '@hourly';
    }

    public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // scheduled task name
        return 'taskOne';
    }

    static function run(\swoole_server $server, int $taskId, int $fromWorkerId, $flags=null)
    {
        // TODO: Implement run() method.
        // scheduled task processing logic
        var_dump('run once per hour');
    }
}
```

Scheduled task: TaskTwo.php

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-6
 * Time: 4:28 PM
 */

namespace App\Crontab;


use EasySwoole\EasySwoole\Crontab\AbstractCronTask;

class TaskTwo extends AbstractCronTask
{

    public static function getRule(): string
    {
        // TODO: Implement getRule() method.
        // scheduled period (every two minutes)
        return '*/2 * * * *';
    }

    public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // scheduled task name
        return 'taskTwo';
    }

    Static function run(\swoole_server $server, int $taskId, int $fromWorkerId, $flags=null)
    {
        // TODO: Implement run() method.
        // scheduled task processing logic
        var_dump('run once every two minutes');
    }
}
```


The cron general expression rules are as follows:

    * * * * *
    - - - - -
    | | | | |
    | | | | |
    | | | | +----- day of week (0 - 7) (Sunday=0 or 7)
    | | | +---------- month (1 - 12)
    | | +--------------- day of month (1 - 31)
    | +-------------------- hour (0 - 23)
    +------------------------- min (0 - 59)

The cron special expressions have the following:
```
@yearly once a year is equivalent to (0 0 1 1 *)
@annually once a year is equivalent to (0 0 1 1 *)
@monthly once a month is equivalent to (0 0 1 * *)
@weekly once a week is equivalent to (0 0 * * 0)
@daily Once a day is equivalent to (0 0 * * *)
@hourly once per hour is equivalent to (0 * * * *)
```
