# Crontab Timer
EasySwoole allows users to add timers based on Crontab rules. The minimum time granularity is 1 minute.

## Implementation principle
In the main process, each task rule and callback are registered. After the service is started, in the custom process, the timer is used to detect whether there is a task to be executed, and if so, the asynchronous process is delivered asynchronously.
The parsing rules can be implemented by referring to https://github.com/dragonmantank/cron-expression.

## Sample Code
EasySwooleEvent.php
Use EasySwoole\EasySwoole\Crontab\Crontab;
```
    Public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
        /**
         * **************** Crontab Mission Plan **********************
         */
        // Start a scheduled task plan
        Crontab::getInstance()->addTask(TaskOne::class);
        // Start a scheduled task plan
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

Namespace App\Crontab;


Use EasySwoole\EasySwoole\Crontab\AbstractCronTask;

Class TaskOne extends AbstractCronTask
{

    Public static function getRule(): string
    {
        // TODO: Implement getRule() method.
        // timing period (hourly)
        Return '@hourly';
    }

    Public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // Timed task name
        Return 'taskOne';
    }

    Static function run(\swoole_server $server, int $taskId, int $fromWorkerId, $flags=null)
    {
        // TODO: Implement run() method.
        // Timed task processing logic
        Var_dump('run once per hour');
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

Namespace App\Crontab;


Use EasySwoole\EasySwoole\Crontab\AbstractCronTask;

Class TaskTwo extends AbstractCronTask
{

    Public static function getRule(): string
    {
        // TODO: Implement getRule() method.
        // Timing period (every two minutes)
        Return '*/2 * * * *';
    }

    Public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // Timed task name
        Return 'taskTwo';
    }

    Static function run(\swoole_server $server, int $taskId, int $fromWorkerId, $flags=null)
    {
        // TODO: Implement run() method.
        // Timed task processing logic
        Var_dump('run once every two minutes');
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
