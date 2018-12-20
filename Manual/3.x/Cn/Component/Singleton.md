## Singleton单例

> 参考Demo: [rpcServer](https://github.com/easy-swoole/demo/blob/3.x/App/Rpc/RpcServer.php)

EasySwoole提供了trait写法的单例,只需要在类里面use Singleton;该类即可实现单例模式.
例如在demo中的[rpcServer](https://github.com/easy-swoole/demo/blob/3.x/App/Rpc/RpcServer.php)中,就使用了单例模式:

```php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/27 0027
 * Time: 12:19
 */
namespace App\Rpc;
use EasySwoole\Component\Singleton;
use EasySwoole\Rpc\Rpc;
class RpcServer extends Rpc
{
    use Singleton;
}
```
调用:
```php
<?php
 $rpc = \App\Rpc\RpcServer::getInstance($rpcConfig);
```
