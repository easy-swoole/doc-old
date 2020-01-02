---
title: 异步任务
meta:
  - name: description
    content: swoole 如何实现上下文管理器，以及协程上下文管理器存在的一些使用误区
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole 上下文管理|swoole 上下文管理|swoole context|协程上下文管理|协程 context
---

# Context
ContextManager

In The swoole,Because multiple coroutines execute concurrently, you cannot use class static variables/global variables to store the coroutine context content.

It is safe to use local variables，Because the value of the local variable is automatically stored in the coroutine stack, no other coroutine can access the local variable of the coroutine.

##  Based on example
```php
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
We can use the context manager to achieve the isolation of the coroutine context

## Register a processing item

For example,When we have a key, we want to be in the coroutine environment，Perform a create when you get，It can be reclaimed when the coroutine exits，Then we can register a context processing item to do that.This scenario can be used for database short connection management within a coroutine.

```php
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

### Implementation principle
Context manager,Is by the coroutine id as the key,Process singleton pattern implemented,Ensure that each coroutine operates on the current coroutine data,With defer, the process is automatically destroyed after the end of the process, so the user doesn't need to do any recycling, just use it.
