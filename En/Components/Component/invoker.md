# Invoker

EasySwoole encapsulates an Invoker to allow the framework to support function timeouts.
****
parameter list：
```
$callable     Executable callback function
$timeOut      The timeout time is `microsecond `1s = 1 * 1000 * 1000μs` Default value 100 * 1000`
...$params    Variable parameters
              
```

## Implementation code
   
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/24
 * Time: 下午4:12
 */

namespace EasySwoole\Component;

use \Swoole\Process;

class Invoker
{
    public static function exec(callable $callable,$timeOut = 100 * 1000,...$params)
    {
        pcntl_async_signals(true);
        pcntl_signal(SIGALRM, function () {
            Process::alarm(-1);
            throw new \RuntimeException('func timeout');
        });
        try
        {
            Process::alarm($timeOut);
            $ret = call_user_func($callable,...$params);
            Process::alarm(-1);
            return $ret;
        }
        catch(\Throwable $throwable)
        {
            throw $throwable;
        }
    }
}
```

## Using examples
   
### Limit function execution time
```
try{
    \EasySwoole\Component\Invoker::exec(function (){
        sleep(2);
    });
}catch (\Throwable $throwable){
    echo $throwable->getMessage();
}
```
