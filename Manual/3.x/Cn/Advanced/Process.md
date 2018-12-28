# 自定义进程

> 参考Demo: [自定义进程](https://github.com/easy-swoole/demo/tree/3.x)

> 自定义进程抽象类：EasySwoole\Component\Process\AbstractProcess

EasySwoole中支持添加用户自定义的swoole process。  

## 抽象父类
> 任何的自定义进程，都应该继承自EasySwoole\Component\Process\AbstractProcess

**AbstractProcess实现代码如下：**
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018-12-27
 * Time: 01:41
 */

namespace EasySwoole\Component\Process;
use EasySwoole\Component\Timer;
use Swoole\Process;

abstract class AbstractProcess
{
    private $swooleProcess;
    private $processName;
    private $arg;

    final function __construct(string $processName,$arg = null)
    {
        $this->arg = $arg;
        $this->processName = $processName;
        $this->swooleProcess = new \swoole_process([$this,'__start']);
    }

    public function getProcess():Process
    {
        return $this->swooleProcess;
    }

    /*
     * 仅仅为了提示:在自定义进程中依旧可以使用定时器
     */
    public function addTick($ms,callable $call):?int
    {
        return Timer::getInstance()->loop(
            $ms,$call
        );
    }

    public function clearTick(int $timerId):?int
    {
        return Timer::getInstance()->clear($timerId);
    }

    public function delay($ms,callable $call):?int
    {
        return Timer::getInstance()->after($ms,$call);
    }

    /*
     * 服务启动后才能获得到pid
     */
    public function getPid():?int
    {
        if(isset($this->swooleProcess->pid)){
            return $this->swooleProcess->pid;
        }else{
            return null;
        }
    }

    function __start(Process $process)
    {
        if(PHP_OS != 'Darwin'){
            $process->name($this->getProcessName());
        }

        if (extension_loaded('pcntl')) {
            pcntl_async_signals(true);
        }

        Process::signal(SIGTERM,function ()use($process){
            try{
                $this->onShutDown();
            }catch (\Throwable $throwable){
                $this->onException($throwable);
            }
            swoole_event_del($process->pipe);
            $this->swooleProcess->exit(0);

        });
        swoole_event_add($this->swooleProcess->pipe, function(){
            $msg = $this->swooleProcess->read(64 * 1024);
            $this->onReceive($msg);
        });
        try{
            $this->run($this->arg);
        }catch (\Throwable $throwable){
            $this->onException($throwable);
        }
    }

    public function getArg()
    {
        return $this->arg;
    }

    public function getProcessName()
    {
        return $this->processName;
    }

    protected function onException(\Throwable $throwable){
        throw $throwable;
    }

    public abstract function run($arg);
    public abstract function onShutDown();
    public abstract function onReceive(string $str);
}
```

## 进程管理器
Helper，实现代码如下：
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018-12-27
 * Time: 11:36
 */

namespace EasySwoole\Component\Process;


class ProcessHelper
{
    static function register(\swoole_server $server,AbstractProcess $process):bool
    {
        return $server->addProcess($process->getProcess());
    }
}
```

## 在自定义进程投递异步任务

由于自定义进程的特殊性，不能直接调用Swoole的异步任务相关方法进行异步任务投递，框架已经封装好了相关的方法方便异步任务投递，请看下面的例子,详细异步任务教程请[点击这里](async_task.md)查看

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

## 实例
我们以demo中的自定义进程例子来说明：
```php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/1 0001
 * Time: 11:30
 */

namespace App\Process;


use EasySwoole\Component\Process\AbstractProcess;
use Swoole\Process;

class ProcessTest extends AbstractProcess
{
    public function run($arg)
    {
        var_dump($arg);
        echo "process is run.\n";

        // TODO: Implement run() method.
    }

    public function onShutDown()
    {
        echo "process is onShutDown.\n";
        // TODO: Implement onShutDown() method.
    }

    public function onReceive(string $str)
    {
        echo "process is onReceive.\n";
        // TODO: Implement onReceive() method.
    }

}
```
以上代码[直达连接](https://github.com/easy-swoole/demo/blob/3.x/App/Process/ProcessTest.php)，
至于如何使用（测试），请见demo中的EasySwooleEvent.php
