# 进程

## 用途
处理耗时任务，比如处理死循环队列消费，清除多余redis中的token数据等等。

## 例子

### 定义一个进程类
```
use EasySwoole\Component\Process\AbstractProcess;

class Process extends AbstractProcess
{

    protected function run($arg)
    {
        //当进程启动后，会执行的回调
        var_dump($this->getProcessName()." run");
        var_dump($arg);
    }
    
    protected function onPipeReadable(\Swoole\Process $process)
    {
        /*
         * 该回调可选
         * 当有主进程对子进程发送消息的时候，会触发的回调，触发后，务必使用
         * $process->read()来读取消息
         */
    }
    
    protected function onShutDown()
    {
        /*
         * 该回调可选
         * 当该进程退出的时候，会执行该回调
         */
    }
    
    
    protected function onException(\Throwable $throwable, ...$args)
    {
        /*
         * 该回调可选
         * 当该进程出现异常的时候，会执行该回调
         */
    }
}
```


### 注册进程

我们在EasySwoole全局的mainServerCreate事件中进行进程注册
```
use App\Process;
use EasySwoole\Component\Process\Config;
$processConfig = new Config();
$processConfig->setProcessName('testProcess');
/*
 * 传递给进程的参数
*/
$processConfig->setArg([
    'arg1'=>time()
]);
ServerManager::getInstance()->getSwooleServer()->addProcess((new Process($processConfig))->getProcess());
```

> 注意，一个进程模型可以被注册N次，也就是创建N个相同类型的进程