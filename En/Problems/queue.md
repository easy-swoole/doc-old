# How to Implement Queue Consumption/Customization Process
Perhaps we often encounter scenarios where we need to constantly consume content in the queue. We implement this function by customizing processes in EasySwoole.
## Implementation code
### Defining the Logic of Consumption Process
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2018/10/18 0018
 * Time: 9:43
 */

namespace App\Process;

use EasySwoole\Component\Process\AbstractProcess;
use Swoole\Process;

class Consumer extends AbstractProcess
{
    private $isRun = false;
    public function run($arg)
    {
        // TODO: Implement run() method.
        /*
         * For example, consume queue data in redis
         * Timing 500ms to detect whether there is a task or not, or if there is a while dead cycle to execute
         */
        $this->addTick(500,function (){
            if(!$this->isRun){
                $this->isRun = true;
                $redis = new \redis();//This is pseudo code. Please establish your own connection or maintain redis connection.
                while (true){
                    try{
                        $task = $redis->lPop('task_list');
                        if($task){
                            // do you task
                        }else{
                            break;
                        }
                    }catch (\Throwable $throwable){
                        break;
                    }
                }
                $this->isRun = false;
            }
            var_dump($this->getProcessName().' task run check');
        });
    }

    public function onShutDown()
    {
        // TODO: Implement onShutDown() method.
    }

    public function onReceive(string $str, ...$args)
    {
        // TODO: Implement onReceive() method.
    }
}
```

### Registered Consumption Process
In the global event of EasySwoole, register the consumption process.
```php
<?php
use App\Consumer;
use EasySwoole\EasySwoole\ServerManager;

public static function mainServerCreate(EventRegister $register)
{
       $allNum = 3;
           for ($i = 0 ;$i < $allNum;$i++){
               ServerManager::getInstance()->getSwooleServer()->addProcess((new Consumer("consumer_{$i}"))->getProcess());
           }
}
```


> Examples of reptiles：https://github.com/HeKunTong/easyswoole3_demo
