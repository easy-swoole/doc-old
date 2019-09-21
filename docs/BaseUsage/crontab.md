---
title: Crontab计划任务
meta:
  - name: description
    content: Crontab 是linux系统中自带的定时器，本文主要讲述php如何在不依赖运维的情况下，利用swoole实现 crontab定时器解析规则
  - name: keywords
    content: Easyswoole Crontab|swoole crontab|swoole定时任务|php 定时
---

# Crontab 定时器
EasySwoole支持用户根据Crontab规则去添加定时器。时间最小粒度是1分钟。

## 实现原理
在主进程中，注册好各个任务规则和回调，服务启动后，在自定义进程内，通过定时器检测有没有待执行任务，若有则投递给异步进程异步执行。
解析规则可以参考https://github.com/dragonmantank/cron-expression 实现。

## 示例代码
EasySwooleEvent.php中
use EasySwoole\EasySwoole\Crontab\Crontab;
```php

    public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
        /**
         * **************** Crontab任务计划 **********************
         */
        // 开始一个定时任务计划 
        Crontab::getInstance()->addTask(TaskOne::class);
        // 开始一个定时任务计划 
        Crontab::getInstance()->addTask(TaskTwo::class);
    }
```

## 任务定义 3.3.0版本后
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

## 任务定义 3.3.0版本前


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
        // 定时周期 （每小时）
        return '@hourly';
    }

    public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // 定时任务名称
        return 'taskOne';
    }

    static function run(\swoole_server $server, int $taskId, int $fromWorkerId,$flags=null)
    {
        // TODO: Implement run() method.
        // 定时任务处理逻辑
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
        // 定时周期 （每两分钟一次）
        return '*/2 * * * *';
    }

    public static function getTaskName(): string
    {
        // TODO: Implement getTaskName() method.
        // 定时任务名称
        return 'taskTwo';
    }

    static function run(\swoole_server $server, int $taskId, int $fromWorkerId,$flags=null)
    {
        // TODO: Implement run() method.
        // 定时任务处理逻辑
        var_dump('run once every two minutes');
    }
}

```

cron通用表达式规则如下：
```text

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

cron特殊表达式有以下几个：
``` text
@yearly                    每年一次 等同于(0 0 1 1 *) 
@annually                  每年一次 等同于(0 0 1 1 *)
@monthly                   每月一次 等同于(0 0 1 * *) 
@weekly                    每周一次 等同于(0 0 * * 0) 
@daily                     每日一次 等同于(0 0 * * *) 
@hourly                    每小时一次 等同于(0 * * * *)
```
