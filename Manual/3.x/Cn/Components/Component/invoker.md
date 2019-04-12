# Invoker

EasySwoole为了让框架支持函数超时处理,封装了一个Invoker。
****
参数列表：
```
$callable     可执行回调函数
$timeOut      超时时间，单位为 `微秒` 1s = 1 * 1000 * 1000μs。 `默认值100 * 1000`
...$params    可变参数
```

## 实现代码
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

## 使用实例

### 限制函数执行时间
```
try{
    \EasySwoole\Component\Invoker::exec(function (){
        sleep(2);
    });
}catch (\Throwable $throwable){
    echo $throwable->getMessage();
}
```
