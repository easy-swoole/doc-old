# Asynchronous Task

> Reference Demo: [Asynchronous Task Processing Demo] (https://github.com/easy-swoole/demo/tree/3.x-async)

> Asynchronous Task Manager Class: EasySwoole\EasySwoole\Swoole\Task\TaskManager

In any place after the service is started, a delivery of asynchronous task can be performed. To simplify the delivery of asynchronous tasks, the framework encapsulates the task manager for delivering synchronous/asynchronous tasks. There are two ways to deliver tasks. The first way is direct delivery of closure, and the second way is the delivery task template class


## Direct Delivery of Closure

When the task is relatively simple, the task can be directly delivered and it can be delivered in any callback after any controller/timer/service startup.

```php
// example of delivery in the controller
function index()
{
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async(function () {
        echo "execute asynchronous task...\n";
        return true;
    }, function () {
        echo "asynchronous task execution completed...\n";
    });
}

// example of posting delivery of closure in a timer
\EasySwoole\Component\Timer::getInstance()->loop(1000, function () {
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async(function () {
        echo "execute asynchronous task...\n";
    });
});
```

> Since php itself can't serialize closures, the delivery of closure is achieved by reflecting the closure function, getting the PHP code to serialize the PHP code directly, and then directly implemented by the eval code.
> Therefore, delivery of closure cannot use external object references and resource handler. For those complex tasks, please use the task template method.

The following usage is wrong:

```php
$image = fopen('test.php', 'a'); // serialization data using external resource handler will not exist
$a=1; // using external variables will not exist
TaskManager::async(function ($image,$a) {
    var_dump($image);
    var_dump($a);
    $this->testFunction(); // the reference to the external object will be wrong
    return true;
},function () {});
```

## Delivery Task Template Class

When the task is more complicated with a lot fixed logical code, you can create a task template in advance and directly deliver the task template in order to simplify the operation and facilitate the delivery of the same task in multiple different places. First, you need to create a task template.

> Asynchronous Task Template Class: EasySwoole\EasySwoole\Swoole\Task\AbstractAsyncTask

```php
class Task extends \EasySwoole\EasySwoole\Swoole\Task\AbstractAsyncTask
{

    /**
     * Content of the task
     * @param mixed $taskData - task data
     * @param int $taskId - the task number of the task to be executed
     * @param int $fromWorkerId  - the worker process number of the dispatch task
     * @author : evalor <master@evalor.cn>
     */
    function run($taskData, $taskId, $fromWorkerId, $flags = null)
    {
        // note that the task number is not absolutely unique
        // the number of each worker process starts from 0
        // so $fromWorkerId + $taskId is the absolute unique number
        // !!! completion of task requires return result
    }

    /**
     * Callback after task execution
     * @param mixed $result - the result of the task execution completion
     * @param int $task_id The task number of the task to be executed
     * @author : evalor <master@evalor.cn>
     */
    function finish($result, $task_id)
    {
        // processing after the task execution
    }
}
```

Then, as in the previous example, you can post the delivery anywhere after the service is started, but just replace the closure by the task template class for delivery.

```php
// example of delivery in the controller
function index()
{
    // instantiate the task template class and bring the data in it. You can get the data in the task class $taskData parameter.
  $taskClass = new Task('taskData');
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async($taskClass);
}

// example of posting in a timer
\EasySwoole\Component\Timer::getInstance()->loop(1000, function () {
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async($taskClass);
});
```

### Using Quick Task Template
You can implement a task template by inheriting the `EasySwoole\EasySwoole\Swoole\EasySwoole\Swoole\Task\QuickTaskInterface` and adding the run method to run the task by directly posting the class name:
```php
<?php
namespace App\Task;
use EasySwoole\EasySwoole\Swoole\Task\QuickTaskInterface;

class QuickTaskTest implements QuickTaskInterface
{
    static function run(\swoole_server $server, int $taskId, int $fromWorkerId,$flags = null)
    {
        echo "fast task template";

        // TODO: Implement run() method.
    }
}
```
controller call:
```php
$result = TaskManager::async(\App\Task\QuickTaskTest::class);
```

## Delivering Asynchronous Tasks In A Custom Process

Due to the special nature of the custom process, Swoole's asynchronous task-related methods cannot be directly called for asynchronous task delivery. The framework has already packaged the relevant methods to facilitate asynchronous task delivery. Please see the following example.
>Asynchronous task without finish callback is delivered by custom process 

```php
    public function run(Process $process)
    {
        // directly deliver closure
        TaskManager::processAsync(function () {
            echo "process async task run on closure!\n";
        });

        // deliver task class
        $taskClass = new TaskClass('task data');
        TaskManager::processAsync($taskClass);
    }
```

## Task Concurrent Execution

Sometimes it is necessary to execute multiple asynchronous tasks at the same time. The most typical example is data collection. After collecting multiple data, it can be processed centrally. At this time, concurrent delivery of tasks can be performed. The bottom layer will deliver and execute the tasks one by one. After all tasks are executed, a result set will be returned.

```php
// concurrent multitasking
$tasks[] = function () { sleep(50000);return 'this is 1'; }; // task 1
$tasks[] = function () { sleep(2);return 'this is 2'; }; // task 2
$tasks[] = function () { sleep(50000);return 'this is 3'; }; // task 3

$results = \EasySwoole\EasySwoole\Swoole\Task\TaskManager::barrier($tasks, 3);

var_dump($results);
```

> Note: Barrier is waiting for execution for blocking, all tasks will be distributed to different Task processes (need to have enough task processes, otherwise blocking will happen) synchronous execution, until all tasks finish or timeout to return all results, the default The task timeout is 0.5 seconds. In the above example, only task 2 can execute normally and return the result.

## Class Methods Reference

```php
/**
 * deliver an asynchronous task
 * @param mixed $task - asynchronous task to be delivered
 * @param mixed $finishCallback - callback function after the task is executed
 * @param int $taskWorkerId - the number of tje specified delivery of task process (default delivery is random idle processes)
 * @return bool - successful delivery will return integer $task_id, and failed delivery will return false
 */
static function async($task,$finishCallback = null, $taskWorkerId = -1)
```

```php
/**
 * deliver a synchronization task
 * @param mixed $task - asynchronous task to be delivered
 * @param float $timeout - task timeout
 * @param int $taskWorkerId - the number of tje specified delivery of task process (default delivery is random idle processes)
 * @return bool|string successful delivery will return integer $task_id, and failed delivery will return false
 */
static function sync($task, $timeout = 0.5, $taskWorkerId = -1)
```

```php
/**
 * asynchronous in-process delivery task
 * @param array $taskList - task list to be executed
 * @param float $timeout - task execution timeout
 * @return array|bool - execution result for each task
 */
static function barrier(array $taskList, $timeout = 0.5)
```
