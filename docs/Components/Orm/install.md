---
title: ORM组件
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# ORM
Easyswoole提供的一个全新协程安全的ORM封装。
# 安装

依赖关系

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
