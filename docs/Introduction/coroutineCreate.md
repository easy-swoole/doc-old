---
title: 配置文件
meta:
  - name: description
    content: swoole,easyswoole协程介绍
  - name: keywords
    content: easyswoole 协程|swoole 协程|协程
---

# 协程

::: tip
从4.0版本开始`Swoole`提供了完整的协程（Coroutine）+ 通道（Channel）特性，带来全新的CSP编程模型。应用层可使用完全同步的编程方式，底层自动实现异步IO。
:::

协程可以理解为纯用户态的线程，其通过协作而不是抢占来进行切换。相对于进程或者线程，协程所有的操作都可以在用户态完成，创建和切换的消耗更低。Swoole可以为每一个请求创建对应的协程，根据IO的状态来合理的调度协程，这会带来了以下优势：

开发者可以无感知的用同步的代码编写方式达到异步IO的效果和性能，避免了传统异步回调所带来的离散的代码逻辑和陷入多层回调中导致代码无法维护
同时由于底层封装了协程，所以对比传统的PHP层协程框架，开发者不需要使用yield关键词来标识一个协程IO操作，所以不再需要对yield的语义进行深入理解以及对每一级的调用都修改为yield，这极大的提高了开发效率
可以满足大部分开发者的需求。对于私有协议，开发者可以使用协程的TCP或者UDP接口去方便的封装。


# 注意事项

- 全局变量：协程使得原有的异步逻辑同步化，但是在协程的切换是隐式发生的，所以在协程切换的前后不能保证全局变量以及static变量的一致性。
- 与xdebug、xhprof、blackfire等zend扩展不兼容，例如不能使用xhprof对协程server进行性能分析采样。


# 创建协程

```php
go(function () {
    co::sleep(0.5);
    echo "hello";
});
go("test");
go([$object, "method"]);
```