---
title: Asynchronous tasks
meta:
  - name: description
    content: Mainly about how to use swoole extension of PHP asynchronous task delivery, and the common swoole asynchronous task error
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Asynchronous tasks|swoolea synchronous|swoole Asynchronous process
---

## Installation
```
composer require easyswoole/task
```

## Standalone use example
```php
use EasySwoole\Task\Config;
use EasySwoole\Task\Task;

/*
    The number of worker processes, temporary directory, process name, maximum number of concurrent tasks, exception callbacks and so on can be modified in the configuration item
*/
$config = new Config();
$task = new Task($config);

$http = new swoole_http_server("127.0.0.1", 9501);
/*
Add the service
*/
$task->attachToServer($http);

$http->on("request", function ($request, $response)use($task){
    if(isset($request->get['sync'])){
        $ret = $task->sync(function ($taskId,$workerIndex){
            return "{$taskId}.{$workerIndex}";
        });
        $response->end("sync result ".$ret);
    }else if(isset($request->get['status'])) {
        var_dump($task->status());
    }else{
        $id = $task->async(function ($taskId,$workerIndex){
            \co::sleep(1);
            var_dump("async id {$taskId} task run");
        });
        $response->end("async id {$id} ");
    }
});

$http->start();
```

# Used in the framework

The 3.3.0 version of EasySwoole asynchronous tasks is implemented as a separate component to implement and resolve asynchronous tasks：

- Undeliverable closure task
- Unable to continue delivering tasks in other custom processes such as TaskWorker
- Realize task flow limitation and state monitoring  

For the old version, please do the following :

- Configuration item deletion ：  MAIN_SERVER.SETTING.task_worker_num 与 MAIN_SERVER.SETTING.task_enable_coroutine
- Configuration item added： MAIN_SERVER.TASK ,The default value is ```['workerNum'=>4,'maxRunningNum'=>128,'timeout'=>15]```
- Note that EasySwoole's Temp directory cannot be in a Shared directory between the virtual machine and the host, which will result in a UnixSocket link being created without permission

## Task manager
EasySwoole defines a task manager with a full namespace of：
`EasySwoole\EasySwoole\Task\TaskManager`
It is a singleton that inherits an 'EasySwoole\Task\Task' object and is instantiated in the main service creation event of 'core.php'. Can be invoked anywhere after the service is started.

### Post closure tasks
```php
TaskManager::getInstance()->async(function (){
    var_dump('r');
});
```

::: warning 
Since PHP itself cannot serialize closures, the closure post is done by reflecting the closure function, getting PHP code to serialize PHP code directly, and then eval code directly, so the post closure cannot use external object references and resource handles. For complex tasks, use task template methods.  
::: 

### Delivery callable

```php
TaskManager::getInstance()->async(callable);
```

### Delivery template task

```php
use EasySwoole\Task\AbstractInterface\TaskInterface;

class Task implements TaskInterface
{
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

TaskManager::getInstance()->async(Task::class);
//or
TaskManager::getInstance()->async(new Task());
```

# Asynchronous tasks - below version 3.3.0

::: warning 
 Refer to the Demo: [Asynchronous task handling demo](https://github.com/easy-swoole/demo/tree/3.x-async)
:::

::: warning 
 Asynchronous task manager class：EasySwoole\EasySwoole\Swoole\Task\TaskManager
:::

Asynchronous task delivery can occur anywhere after the service is started. To simplify asynchronous task delivery, the framework encapsulates the task manager for synchronous/asynchronous task delivery，There are two ways to post a Task: directly post a closure and directly post a job template class



## Drop the closure directly

When the task is relatively simple, the closure can be directly posted anywhere including in various callbacks after the controller/timer/service starts

```php
// Post in the controller example
function index()
{
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async(function () {
        echo "Perform asynchronous tasks...\n";
        return true;
    }, function () {
        echo "Asynchronous task finished...\n";
    });
}

// An example of delivery in a timer
\EasySwoole\Component\Timer::getInstance()->loop(1000, function () {
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async(function () {
        echo "Perform asynchronous tasks...\n";
    });
});
```

::: warning 

Since PHP itself cannot serialize closures, the closure post is done by reflecting the closure function, getting PHP code to serialize PHP code directly, and then eval code directly, so the post closure cannot use external object references and resource handles. For complex tasks, use task template methods.

:::

The following usage is incorrect:
```php
$image = fopen('test.php', 'a');//Serializing data using an external resource handle will not exist
$a=1;//Using external variables will not exist
TaskManager::async(function ($image,$a) {
    var_dump($image);
    var_dump($a);
    $this->testFunction();//Using a reference to an external object will cause an error
    return true;
},function () {});
```


## Post the task template class

When the task is complex, logical and fixed, you can create a task template in advance and post the task template directly to simplify the operation and facilitate the delivery of the same task in multiple different places. First, you need to create a task template

::: warning 
 Asynchronous task template class：EasySwoole\EasySwoole\Swoole\Task\AbstractAsyncTask
:::

```php
class Task extends \EasySwoole\EasySwoole\Swoole\Task\AbstractAsyncTask
{

    /**
     * Execute the content of the task
     * @param mixed $taskData     taskData
     * @param int   $taskId       The task number of the execution task
     * @param int   $fromWorkerId Assign the worker process number of the task
     * @author : evalor <master@evalor.cn>
     */
    function run($taskData, $taskId, $fromWorkerId,$flags = null)
    {
        // Note that the task number is not absolutely unique
        // Each worker process is numbered from 0
        // So $fromWorkerId + $taskId is the absolutely unique number
        // !!! The return result is needed to complete the task
    }

    /**
     * A callback to the completion of a task
     * @param mixed $result  The result returned when the task is completed
     * @param int   $task_id The task number of the execution task
     * @author : evalor <master@evalor.cn>
     */
    function finish($result, $task_id)
    {
        // The processing of the end of task execution
    }
}
```

Then, as in the previous example, you can post anywhere after the service is started, just replace the closure with an instance of the task template class

```php
// Post in the controller example
function index()
{
    // Instantiate the task template class and bring in the data to get the data in the task class $taskData parameter
  	$taskClass = new Task('taskData');
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async($taskClass);
}

// An example of delivery in a timer
\EasySwoole\Component\Timer::getInstance()->loop(1000, function () {
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async($taskClass);
});
```

###  Use a quick task template
By inheriting 'EasySwoole, EasySwoole, Swoole, Task, QuickTaskInterface', add the run method, you can achieve a Task template, through the direct post class name to run the Task:
```php
<?php
namespace App\Task;
use EasySwoole\EasySwoole\Swoole\Task\QuickTaskInterface;

class QuickTaskTest implements QuickTaskInterface
{
    static function run(\swoole_server $server, int $taskId, int $fromWorkerId,$flags = null)
    {
        echo "Quick task template";

        // TODO: Implement run() method.
    }
}
```
Controller call:
```php
$result = TaskManager::async(\App\Task\QuickTaskTest::class);
```

## Deliver asynchronous tasks in a custom process

Due to the particularity of custom process, it is not possible to directly call Swoole's asynchronous task-related method for asynchronous task delivery. The framework has encapsulated the relevant method to facilitate asynchronous task delivery, please see the following example

::: warning 
Custom process post asynchronous task without finish callback  
:::

```php
    public function run(Process $process)
    {
        // Delivery the closure directly
        TaskManager::processAsync(function () {
            echo "process async task run on closure!\n";
        });

        // Delivery task class
        $taskClass = new TaskClass('task data');
        TaskManager::processAsync($taskClass);
    }
```

## Concurrent execution of tasks

Sometimes it is necessary to execute multiple asynchronous tasks at the same time. The most typical example is data collection. After collecting and processing multiple data, concurrent task delivery can be carried out，A result set is returned after all tasks are executed

```php
// multitasking
$tasks[] = function () { sleep(50000);return 'this is 1'; }; // task1
$tasks[] = function () { sleep(2);return 'this is 2'; };     // task2
$tasks[] = function () { sleep(50000);return 'this is 3'; }; // task3

$results = \EasySwoole\EasySwoole\Swoole\Task\TaskManager::barrier($tasks, 3);

var_dump($results);
```

::: warning 
 Note: the Barrier is a block waiting for execution, and all tasks will be distributed to different Task processes (there should be enough Task processes, or they will also be blocked) to execute synchronously, and all results will not be returned until all tasks finish execution or timeout. The default Task timeout is 0.5 seconds，Only task 2 in the example above can execute properly and return results。
:::

## Class function reference

```php
/**
 * Deliver an asynchronous task
 * @param mixed $task           Asynchronous tasks that need to be delivered
 * @param mixed $finishCallback The callback function after the task executes
 * @param int   $taskWorkerId   Specify the Task process number to post (randomly post to idle process by default)
 * @return bool Successful delivery returns the integer $task_id, Return false on delivery failure
 */
static function async($task,$finishCallback = null,$taskWorkerId = -1)
```

```php
/**
 * Deliver an asynchronous task
 * @param mixed $task         Asynchronous tasks that need to be delivered
 * @param float $timeout      Task timeout
 * @param int   $taskWorkerId Specify the Task process number to post (randomly post to idle process by default)
 * @return bool|string Successful delivery returns the integer $task_id, Return false on delivery failure
 */
static function sync($task, $timeout = 0.5, $taskWorkerId = -1)
```

```php
/**
 * Deliver tasks in asynchronous processes
 * @param array $taskList List of tasks to perform
 * @param float $timeout  Task timeout
 * @return array|bool The execution result of each task
 */
static function barrier(array $taskList, $timeout = 0.5)
```
