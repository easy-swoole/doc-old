# ReadyScheduler
Easyswoole 基础组件1.8.7版本起，提供了一个基于Swoole Table实现的就绪计划程序，用于解决主服务启动时，部分子服务未就绪问题。

## 基础测试使用
```php
namespace EasySwoole\Component\Tests;


use EasySwoole\Component\ReadyScheduler;
use PHPUnit\Framework\TestCase;
use Swoole\Coroutine;

class ReadySchedulerTest extends TestCase
{
    function testNormal()
    {
        ReadyScheduler::getInstance()->addItem('worker');
        ReadyScheduler::getInstance()->addItem('rpc');
        ReadyScheduler::getInstance()->addItem('fastCache');

        go(function (){
            Coroutine::sleep(1);
            ReadyScheduler::getInstance()->ready('worker');
            ReadyScheduler::getInstance()->ready('rpc');
        });
        $this->assertEquals(false,ReadyScheduler::getInstance()->waitReady(['rpc','worker'],0.1));
        $this->assertEquals(true,ReadyScheduler::getInstance()->waitReady('rpc'));
        $this->assertEquals(true,ReadyScheduler::getInstance()->waitReady(['rpc','worker']));
        $this->assertEquals(false,ReadyScheduler::getInstance()->waitReady(['rpc','worker','fastCache'],1.1));
    }
}
```

## EasySwoole服务中使用
以Http服务作为基础例子
```
namespace EasySwoole\EasySwoole;

use EasySwoole\Component\ReadyScheduler;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use Swoole\Coroutine;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        /*
         * 主进程初始化table
         */
        ReadyScheduler::getInstance();
        /*
         * 假设，服务启动的时候，依赖 serviceOne，serviceTwo 两个服务，例如链接第三方api等。
         * 在服务未就绪的时候，我们不希望本机器开始对外服务
         */
        $register->add($register::onWorkerStart,function ($serv, $workerId){
            if($workerId == 0){
                /*
                 * 若不是强制准备，请注意addItem,unready，ready实现方法
                 */
                Coroutine::sleep(3);
                ReadyScheduler::getInstance()->ready('serviceOne',true);
                var_dump('r1');
            }else if($workerId == 1){
                Coroutine::sleep(4);
                ReadyScheduler::getInstance()->ready('serviceTwo',true);
                var_dump('r2');
            }
        });
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        /*
         * 链接进来的时候，判断依赖的服务是否就绪,等待时间为1s (tcp，ws服务也同理)
         * 在服务未就绪的时候，我们先拒绝服务
        */
        if(!ReadyScheduler::getInstance()->waitReady(['serviceOne','serviceTwo'],1.0)){
            $response->write('not ready,try again');
            return false;
        }
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {

    }
}
```