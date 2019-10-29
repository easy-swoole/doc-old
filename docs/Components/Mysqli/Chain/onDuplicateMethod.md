---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# onDuplicate

onDuplicate插入


## 传参说明

方法原型
```php
function onDuplicate($updateColumns, $lastInsertId = null)
```

- $updateColumns 更新的列
- $lastInsertId 可不传，若传入，更新$lastInsertId行数据