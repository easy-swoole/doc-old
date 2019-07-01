# AsyncTask
Easyswoole support you deliver async task in anywhere after server start.

## Run an Closure Task
```
use EasySwoole\EasySwoole\Swoole\Task\TaskManager;
TaskManager::async(function () {
     // you task code
});
```

> Closure Task only can exec some simple task , because closure is not serializable but easyswoole use SuperClosure to try it.

## Task Object
```
use EasySwoole\EasySwoole\Swoole\Task\AbstractAsyncTask;
class Task extends AbstractAsyncTask
{
    protected function run($taskData, $taskId, $fromWorkerId, $flags = null)
    {
        // TODO: Implement run() method.
    }

    protected function finish($result, $task_id)
    {
        // TODO: Implement finish() method.
    }
}
TaskManager::async(Task::class);
// or
TaskManager::async(new Task('task data');
```