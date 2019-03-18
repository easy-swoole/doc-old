## Singleton单例

EasySwoole提供了trait写法的单例,只需要在类里面use Singleton;该类即可实现单例模式.  
例如FastCache组件中
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018-12-27
 * Time: 16:05
 */

namespace EasySwoole\FastCache;


use EasySwoole\Component\Singleton;
use EasySwoole\FastCache\Exception\RuntimeError;
use Swoole\Coroutine\Channel;

class Cache
{
    use Singleton;
    //....省略代码
}
```
调用:
```php
<?php
 EasySwoole\FastCache\Cache::getInstance()->get('1');
```
