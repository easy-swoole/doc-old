---
title: Coroutine
meta:
  - name: description
    content: Swoole, easyswoole coroutine introduction
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole coroutine|swoole coroutine|coroutine
---

# Coroutine

::: tip
Starting with version 4.0, `Swoole` provides a complete Coroutine + Channel feature that brings a new CSP programming model. The application layer can use fully synchronous programming, and the underlying layer automatically implements asynchronous IO.
:::

A coroutine can be understood as a thread of pure user mode, which switches by cooperation rather than preemption. Relative to the process or thread, all operations of the coroutine can be completed in the user mode, and the consumption of creation and switching is lower. Swoole can create a corresponding coroutine for each request, and reasonably schedule the coroutine according to the state of IO, which brings the following advantages:

Developers can achieve asynchronous IO effects and performance in a non-perceived way with synchronous code writing, avoiding the discrete code logic and the multi-layer callbacks caused by traditional asynchronous callbacks.
At the same time, because the underlying package is packaged, the developer does not need to use the yield keyword to identify a coroutine IO operation compared to the traditional PHP layer coroutine framework, so there is no need to deeply understand the semantics of yield and for each level. The calls are all modified to yield, which greatly improves the development efficiency.
Can meet the needs of most developers. For proprietary protocols, developers can use the TCP or UDP interface of the coroutine for convenient encapsulation.


# Precautions

- Global variables: Coroutines synchronize the original asynchronous logic, but the switching of the coroutines occurs implicitly, so the consistency of global variables and static variables cannot be guaranteed before and after coroutine switching.
- It is not compatible with zend extensions such as xdebug, xhprof, and blackfire. For example, you cannot use xhprof to perform performance analysis sampling on the coroutine server.


# Create a coroutine

```php
go(function () {
    co::sleep(0.5);
    echo "hello";
});
go("test");
go([$object, "method"]);
```
