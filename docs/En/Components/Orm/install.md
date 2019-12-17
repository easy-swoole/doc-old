---
title: ORM component
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# ORM
A new coroutine-safe ORM package from Easyswoole.
# Installation

Dependency

- swoole `>= 4.4.8`
- Easyswoole  `>=3.3.2` 
- mysqli > `2.x`

```php
composer require easyswoole/orm
```

::: tip 
Orm的功能是依赖于mysqli 2.x组件的，update的$data参数将会传递给mysqli构造sql。

所以我们可以直接使用大部分mysqli的功能
:::
