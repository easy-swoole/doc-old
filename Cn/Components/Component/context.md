## Context
ContextManager上下文管理器  
在swoole中,由于多个协程是并发执行的，因此不能使用类静态变量/全局变量保存协程上下文内容。使用局部变量是安全的，因为局部变量的值会自动保存在协程栈中，其他协程访问不到协程的局部变量。  

##  基础例子
```
use EasySwoole\Component\Context\ContextManager;
go(function (){
    ContextManager::getInstance()->set('key','key in parent');
    go(function (){
        ContextManager::getInstance()->set('key','key in sub');
        var_dump(ContextManager::getInstance()->get('key')." in");
    });
    \co::sleep(1);
    var_dump(ContextManager::getInstance()->get('key')." out");
});
```
我们可以利用上下文管理器来实现协程上下文的隔离

## 注册一个处理项

例如，当我们有一个key,希望在协程环境中，get的时候执行一次创建，在协程退出的时候可以进行回收，那么我们就可以注册一个上下文处理项来实现。该场景可以用于协程内数据库短连接管理。

```
use EasySwoole\Component\Context\ContextManager;
use EasySwoole\Component\Context\ContextItemHandlerInterface;

class Handler implements ContextItemHandlerInterface
{

    function onContextCreate()
    {
        $class = new \stdClass();
        $class->time = time();
        return $class;
    }

    function onDestroy($context)
    {
        var_dump($context);
    }
}

ContextManager::getInstance()->registerItemHandler('key',new Handler());

go(function (){
    go(function (){
        ContextManager::getInstance()->get('key');
    });
    \co::sleep(1);
    ContextManager::getInstance()->get('key');
});
```

### 实现原理
context上下文管理器,是通过协程id作为key,进程单例模式,实现的,确保每个协程操作的都是当前协程数据,并通过defer,实现了协程结束后自动销毁,用户无需进行任何的回收处理,只管用就行
