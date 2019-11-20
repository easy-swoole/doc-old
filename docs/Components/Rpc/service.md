# 服务定义
每一个Rpc服务都应继承自 EasySwoole\Rpc\AbstractService 类。该类的具体代码如下：
```php
namespace EasySwoole\Rpc;


use EasySwoole\Component\TableManager;
use Swoole\Coroutine;

abstract class AbstractService
{
    private $allowMethods = [];
    private $requests = [];
    private $responses = [];
    private $sockets = [];
    private $actions = [];
    /*
     * 禁止重写该方法，防止在构造函数中抛出异常
     */
    final public function __construct()
    {
        //支持在子类控制器中以private，protected来修饰某个方法不可见
        $list = [];
        $ref = new \ReflectionClass(static::class);
        $public = $ref->getMethods(\ReflectionMethod::IS_PUBLIC);
        foreach ($public as $item) {
            array_push($list, $item->getName());
        }
        $this->allowMethods = array_diff($list,
            [
                '__hook', '__destruct',
                '__clone', '__construct', '__call',
                '__callStatic', '__get', '__set',
                '__isset', '__unset', '__sleep',
                '__wakeup', '__toString', '__invoke',
                '__set_state', '__clone', '__debugInfo',
                'serviceName','version','onTick','actionList'
            ]
        );
    }

    protected function onRequest(?string $action):?bool
    {
        return true;
    }

    protected function afterAction(?string $action)
    {

    }

    abstract public function serviceName():string ;
    /*
     * 每秒会执行一次，请自己实现间隔需求
     */
    public function onTick(Config $config)
    {

    }

    protected function onException(\Throwable $throwable)
    {
        throw $throwable;
    }

    protected function request():Request
    {
        return $this->requests[Coroutine::getCid()];
    }

    protected function response():Response
    {
        return $this->responses[Coroutine::getCid()];
    }

    protected function socket():Coroutine\Socket
    {
        return $this->sockets[Coroutine::getCid()];
    }

    protected function action(): ?string
    {
        return $this->actions[Coroutine::getCid()];
    }

    protected function actionNotFound(?string $action)
    {
        $this->response()->setStatus(Response::STATUS_SERVICE_ACTION_NOT_FOUND);
    }

    public function version():string
    {
        return '1.0';
    }

    public function actionList():array
    {
        return $this->allowMethods;
    }

    public function __hook(Request $request, Response $response, Coroutine\Socket $client)
    {
        $this->requests[Coroutine::getCid()] = $request;
        $this->responses[Coroutine::getCid()] = $response;
        $this->sockets[Coroutine::getCid()] = $client;
        $this->actions[Coroutine::getCid()] = $request->getAction();
        $actionName = $this->action();
        try {
            if ($this->onRequest($this->action()) !== false) {
                if (in_array($actionName, $this->allowMethods)) {
                    $actionName = $this->action();
                    $this->$actionName();
                } else {
                    $this->actionNotFound($this->action());
                }
            }
        } catch (\Throwable $throwable) {
            //若没有重构onException，直接抛出给上层
            $this->onException($throwable);
        } finally {
            try {
                $this->afterAction($this->action());
            } catch (\Throwable $throwable) {
                $this->onException($throwable);
            }
            unset( $this->requests[Coroutine::getCid()]);
            unset( $this->responses[Coroutine::getCid()]);
            unset( $this->actions[Coroutine::getCid()]);
            unset( $this->sockets[Coroutine::getCid()]);
        }
        if($response->getStatus() === Response::STATUS_OK){
            TableManager::getInstance()->get($this->serviceName())->incr($actionName,'success');
        }else{
            TableManager::getInstance()->get($this->serviceName())->incr($actionName,'fail');
        }
    }
}
```

> 注意，全部请求都会复用该实例。因此成员属性的修改访问是不安全的。请用上下文管理器实现变量存储。