---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# setQueryOption

设置查询条件

## 用法


```php
$builder->setQueryOption("FOR UPDATE")->where('whereUpdate', 'whereValue')->update('updateTable', ['a' => 1], 2);
```

## 传参说明

方法原型
```php
function setQueryOption($options)
```
