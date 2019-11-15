---
title: Custom process implementation redis subscription
meta:
  - name: description
    content: Easyswoole, custom process implementation redis subscription
  - name: keywords
    content: Easyswoole|Custom process implementation redis subscription
---

## Custom process implementation redis subscription
## Implementation code
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2018/10/18 0018
 * Time: 10:28
 */

namespace App\Process;


use EasySwoole\Component\Process\AbstractProcess;
use Swoole\Process;

class Subscribe extends AbstractProcess
{
    public function run($arg)
    {
        // TODO: Implement run() method.
        $redis = new \Redis();//Here is the pseudo code, please establish your own connection or maintenance
        $redis->connect('127.0.0.1');
        $redis->subscribe(['ch1'],function (){
            var_dump(func_get_args());
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

Next, what needs to be done is to register the process in the main service creation event of EasySwooleEvent.php.
```php
use App\Process;
use EasySwoole\Core\Swoole\Process\ProcessManager;

ServerManager::getInstance()->getSwooleServer()->addProcess((new Subscribe('sub'))->getProcess());
```
