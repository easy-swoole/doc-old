# Task component
For the sake of more flexible customization, EasySwoole implements a Task component based on a custom process to implement asynchronous tasks and solve:
- Unable to deliver closure tasks
- Unable to continue delivering tasks in other custom processes such as TaskWorker
- Realizing Task Limitation and State Monitoring

> This component can be used independently

## Install 
```
composer require easyswoole/task
```

## Sample code

```php
use EasySwoole\Task\Config;
use EasySwoole\Task\Task;

/*
    Configuration items can modify the number of working processes, temporary directories, process names, maximum number of concurrent tasks, exception callbacks, etc.
*/
$config = new Config();
$task = new Task($config);

$http = new swoole_http_server("127.0.0.1", 9501);
/*
Adding services
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

## Task Delivery Type
### closures
### Task Interface
### callable
