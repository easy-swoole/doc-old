---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# 添加数据

## INSERT INTO

```php
$client->queryBuilder()->insert('insertTable', ['a' => 1, 'b' => "b"]);
```

## REPLACE INTO

```php
$builder->replace('replaceTable', ['a' => 1]);
```