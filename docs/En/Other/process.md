---
title: Queue consumption / custom process problem
meta:
  - name: description
    content: Easyswoole, queue consumption / custom process issues
  - name: keywords
    content: Easyswoole|Queue consumption/custom process issues
---
## How to implement queue consumption / custom process
Maybe we will often encounter scenarios that require constant consumption of content in the queue. We implement this function in the way of custom processes in EasySwoole.
## Implementation code
### Define consumption process logic
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
         * Timed 500ms to detect whether there is a task, and if it is a while loop execution
         */
        $this->addTick(500,function (){
            if(!$this->isRun){
                $this->isRun = true;
                $redis = new \redis();//Here is the pseudo code, please establish a connection or maintain a redis connection.
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

### Registered consumption process
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


::: warning 
 Reptile example: https://github.com/HeKunTong/easyswoole3_demo
:::

