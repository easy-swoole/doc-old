---
title: Task异步任务
meta:
  - name: description
    content: 主要讲述php如何用swoole拓展进行异步任务投递，以及常见的swoole异步任务报错问题
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|EasySwoole异步任务|swoole异步|swoole异步进程
---
# task组件
3.3.0版本的EasySwoole异步任务抛弃了swoole的原生task,采用独立组件实现实现.
相对于原生swoole task,easyswoole/task组件实现了：

- 可以投递闭包任务
- 可以在TaskWorker等其他自定义进程继续投递任务
- 实现任务限流与状态监控  

## 安装 
```
composer require easyswoole/task
```

## 独立使用示例
```php
use EasySwoole\Task\Config;
use EasySwoole\Task\Task;

/*
    配置项中可以修改工作进程数、临时目录，进程名，最大并发执行任务数，异常回调等
*/
$config = new Config();
$task = new Task($config);
//添加swoole 服务
$http = new swoole_http_server("0.0.0.0", 9501);
//注入swoole服务,进行创建task进程
$task->attachToServer($http);
//在onrequest事件中调用task(其他地方也可以,这只是示例)
$http->on("request", function (Swoole\Http\Request  $request, $response)use($task){
    if(isset($request->get['sync'])){
        //同步调用task
        $ret = $task->sync(function ($taskId,$workerIndex){
            return "{$taskId}.{$workerIndex}";
        });
        $response->end("sync result ".$ret);
    }else if(isset($request->get['status'])) {
        var_dump($task->status());
    }else{
        //异步调用task
        $id = $task->async(function ($taskId,$workerIndex){
            \co::sleep(1);
            var_dump("async id {$taskId} task run");
        });
        $response->end("async id {$id} ");
    }
});
//启动服务
$http->start();
```

## 框架中使用
### 配置项
老版本用户升级,需要删除 `MAIN_SERVER.SETTING.task_worker_num`,`MAIN_SERVER.SETTING.task_enable_coroutine`配置项  
请在`MAIN_SERVER`配置项中,增加TASK子配置项(如下图):
```php
<?php
return [
            'MAIN_SERVER' => [
                'TASK'=>[
                    'workerNum'=>4,
                    'maxRunningNum'=>128,
                    'timeout'=>15
                    ],
            ],
        ];
```  
::: waring
    注意EasySwoole的Temp目录不在虚拟机与宿主机共享目录下，否则会导致没有权限创建UnixSocket链接
:::


### 用法
在EasySwoole框架中,只需要配置好task配置项,即可在控制器,自定义进程内调用task实现异步任务:
```php
<?php
use EasySwoole\EasySwoole\Task\TaskManager;

class Index extends BaseController
{
    function index()
    {
        $task = TaskManager::getInstance();
        $task->async(function (){
            echo "异步调用task1\n";
        });
        $data =  $task->sync(function (){
            echo "同步调用task1\n";
            return "可以返回调用结果\n";
        });
        $this->response()->write($data);
    }
}
```
::: waring
 `EasySwoole\EasySwoole\Task\TaskManager` 是EasySwoole的全局task管理对象,可以直接通过单例,在框架启动后的任意位置调用它进行任务投递
:::

::: warning 
由于php本身就不能序列化闭包,该闭包投递是通过反射该闭包函数,获取php代码直接序列化php代码,然后直接eval代码实现的 所以投递闭包无法使用外部的对象引用,以及资源句柄,复杂任务请使用任务模板方法  
::: 

### 投递模板任务
新建模板类文件
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/11/20 0020
 * Time: 10:44
 */

namespace App\Task;


use EasySwoole\Task\AbstractInterface\TaskInterface;

class TestTask implements TaskInterface
{
    protected $data;
    //通过构造函数,传入数据,获取该次任务的数据
    public function __construct($data)
    {
        $this->data = $data;
    }

    function run(int $taskId, int $workerIndex)
    {
        var_dump("模板任务运行");
        var_dump($this->data);
        //只有同步调用才能返回数据
        return "返回值:".$this->data['name'];
        // TODO: Implement run() method.
    }

    function onException(\Throwable $throwable, int $taskId, int $workerIndex)
    {
        // TODO: Implement onException() method.
    }
}
```                                                           
调用:
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/11/20 0020
 * Time: 10:14
 */

namespace App\HttpController;


use App\Task\TestTask;
use EasySwoole\EasySwoole\Task\TaskManager;

class Index extends BaseController
{
    function index()
    {
        $task = TaskManager::getInstance();
        $task->async(new TestTask(['name'=>'仙士可2号']));
        $data =  $task->sync(new TestTask(['name'=>'仙士可1号']));
        $this->response()->write($data);
    }
}
```

## 投递返回值
任务投递之后,会返回一个是否投递成功的返回值,有以下几种情况:
- 大于0 投递成功(异步任务专属,返回taskId,同步任务直接返回return值)
- -1 task进程繁忙,投递失败(已经到达最大运行数量maxRunningNum)
- -2 投递数据解包失败,当投递数据传输时数据异常时会报错,此错误为组件底层错误,一般不会出现
- -3 任务出错(该任务执行时出现异常错误,被组件拦截并输出错误)


# 异步任务-3.3.0版本以下


::: warning 
 参考Demo: [异步任务处理demo](https://github.com/easy-swoole/demo/tree/3.x-async)
:::


::: warning 
 异步任务管理器类：EasySwoole\EasySwoole\Swoole\Task\TaskManager
:::

在服务启动后的任意一个地方，都可以进行异步任务的投递，为了简化异步任务的投递，框架封装了任务管理器，用于投递同步/异步任务，投递任务有两种方式，一是直接投递闭包，二是投递任务模板类



## 直接投递闭包

任务比较简单的情况下可以直接投递闭包，任意地方包括控制器/定时器/服务启动后的各种回调中均可进行投递

```php
// 在控制器中投递的例子
function index()
{
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async(function () {
        echo "执行异步任务...\n";
        return true;
    }, function () {
        echo "异步任务执行完毕...\n";
    });
}

// 在定时器中投递的例子
\EasySwoole\Component\Timer::getInstance()->loop(1000, function () {
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async(function () {
        echo "执行异步任务...\n";
    });
});
```

::: warning 
 由于php本身就不能序列化闭包,该闭包投递是通过反射该闭包函数,获取php代码直接序列化php代码,然后直接eval代码实现的 所以投递闭包无法使用外部的对象引用,以及资源句柄,复杂任务请使用任务模板方法  
:::

以下的使用方法是错误的:
```php
$image = fopen('test.php', 'a');//使用外部资源句柄序列化数据将不存在
$a=1;//使用外部变量将不存在
TaskManager::async(function ($image,$a) {
    var_dump($image);
    var_dump($a);
    $this->testFunction();//使用外部对象的引用将出错
    return true;
},function () {});
```


## 投递任务模板类

当任务比较复杂，逻辑较多而且固定时，可以预先创建任务模板，并直接投递任务模板，以简化操作和方便在多个不同的地方投递相同的任务，首先需要创建一个任务模板


::: warning 
 异步任务模板类：EasySwoole\EasySwoole\Swoole\Task\AbstractAsyncTask
:::

```php
class Task extends \EasySwoole\EasySwoole\Swoole\Task\AbstractAsyncTask
{

    /**
     * 执行任务的内容
     * @param mixed $taskData     任务数据
     * @param int   $taskId       执行任务的task编号
     * @param int   $fromWorkerId 派发任务的worker进程号
     * @author : evalor <master@evalor.cn>
     */
    function run($taskData, $taskId, $fromWorkerId,$flags = null)
    {
        // 需要注意的是task编号并不是绝对唯一
        // 每个worker进程的编号都是从0开始
        // 所以 $fromWorkerId + $taskId 才是绝对唯一的编号
        // !!! 任务完成需要 return 结果
    }

    /**
     * 任务执行完的回调
     * @param mixed $result  任务执行完成返回的结果
     * @param int   $task_id 执行任务的task编号
     * @author : evalor <master@evalor.cn>
     */
    function finish($result, $task_id)
    {
        // 任务执行完的处理
    }
}
```

然后同上例，一样可以在服务启动后的任何地方进行投递，只是将闭包换成任务模板类的实例进行投递

```php
// 在控制器中投递的例子
function index()
{
    // 实例化任务模板类 并将数据带进去 可以在任务类$taskData参数拿到数据
  	$taskClass = new Task('taskData');
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async($taskClass);
}

// 在定时器中投递的例子
\EasySwoole\Component\Timer::getInstance()->loop(1000, function () {
    \EasySwoole\EasySwoole\Swoole\Task\TaskManager::async($taskClass);
});
```

###  使用快速任务模板
可通过继承`EasySwoole\EasySwoole\Swoole\Task\QuickTaskInterface`,增加run方法,即可实现一个任务模板,通过直接投递类名运行任务:
```php
<?php
namespace App\Task;
use EasySwoole\EasySwoole\Swoole\Task\QuickTaskInterface;

class QuickTaskTest implements QuickTaskInterface
{
    static function run(\swoole_server $server, int $taskId, int $fromWorkerId,$flags = null)
    {
        echo "快速任务模板";

        // TODO: Implement run() method.
    }
}
```
控制器调用:
```php
$result = TaskManager::async(\App\Task\QuickTaskTest::class);
```

## 在自定义进程投递异步任务

由于自定义进程的特殊性，不能直接调用Swoole的异步任务相关方法进行异步任务投递，框架已经封装好了相关的方法方便异步任务投递，请看下面的例子  

::: warning 
自定义进程投递异步任务没有finish回调  
:::

```php
    public function run(Process $process)
    {
        // 直接投递闭包
        TaskManager::processAsync(function () {
            echo "process async task run on closure!\n";
        });

        // 投递任务类
        $taskClass = new TaskClass('task data');
        TaskManager::processAsync($taskClass);
    }
```

## 任务并发执行

有时需要同时执行多个异步任务，最典型的例子是数据采集，采集完多个数据后集中进行处理，这时可以进行并发任务投递，底层会将任务逐个进行投递并执行，所有任务执行完后返回一个结果集

```php
// 多任务并发
$tasks[] = function () { sleep(50000);return 'this is 1'; }; // 任务1
$tasks[] = function () { sleep(2);return 'this is 2'; };     // 任务2
$tasks[] = function () { sleep(50000);return 'this is 3'; }; // 任务3

$results = \EasySwoole\EasySwoole\Swoole\Task\TaskManager::barrier($tasks, 3);

var_dump($results);
```


::: warning 
 注意：Barrier为阻塞等待执行，所有的任务会被分发到不同Task进程(需要有足够的task进程,否则也会阻塞)同步执行， 直到所有的任务执行结束或超时才返回全部结果，默认的任务超时为0.5秒，以上示例中只有任务2能正常执行并返回结果。
:::

## 类函数参考

```php
/**
 * 投递一个异步任务
 * @param mixed $task           需要投递的异步任务
 * @param mixed $finishCallback 任务执行完后的回调函数
 * @param int   $taskWorkerId   指定投递的Task进程编号 (默认随机投递给空闲进程)
 * @return bool 投递成功 返回整数 $task_id 投递失败 返回 false
 */
static function async($task,$finishCallback = null,$taskWorkerId = -1)
```

```php
/**
 * 投递一个同步任务
 * @param mixed $task         需要投递的异步任务
 * @param float $timeout      任务超时时间
 * @param int   $taskWorkerId 指定投递的Task进程编号 (默认随机投递给空闲进程)
 * @return bool|string 投递成功 返回整数 $task_id 投递失败 返回 false
 */
static function sync($task, $timeout = 0.5, $taskWorkerId = -1)
```

```php
/**
 * 异步进程内投递任务
 * @param array $taskList 需要执行的任务列表
 * @param float $timeout  任务执行超时
 * @return array|bool 每个任务的执行结果
 */
static function barrier(array $taskList, $timeout = 0.5)
```


