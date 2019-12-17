---
title: Ready to wait
meta:
  - name: description
    content: EasySwoole ReadyScheduler
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|ReadyScheduler|Ready to wait
---
# ReadyScheduler
Since the 1.8.7 release of the Easyswoole base component, a ready-to-plan program based on the Swoole Table implementation has been provided to resolve some sub-service not-ready issues when the main service starts.

## Basic test use
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

## Used in the EasySwoole service
Take Http service as a basic example
```php
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
         * Main process initialization table
         */
        ReadyScheduler::getInstance();
        /*
         * Assume that when the service starts, it depends on serviceOne, serviceTwo and other services, such as linking third-party apis.
         * When the service is not ready, we do not want this machine to start external service.
         */
        $register->add($register::onWorkerStart,function ($serv, $workerId){
            if($workerId == 0){
                /*
                 * If not mandatory, please pay attention to addItem, unready, ready implementation
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
         * When the link comes in, determine if the dependent service is ready, and wait for 1s (tcp, ws service is also the same)
         * When the service is not ready, we first refuse the service.
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
