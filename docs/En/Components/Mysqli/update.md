---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# 更新数据

## WHERE UPDATE

```php
$client->queryBuilder()->where('whereUpdate', 'whereValue')->update('updateTable', ['a' => 1]);
```

## LIMIT UPDATE

```php
$client->queryBuilder()->update('updateTable', ['a' => 1], 5);
```

## 快捷更新

```php
$client->queryBuilder()
    ->where('whereUpdate', 'whereValue')
    ->update('updateTable', [
        'age'    => QueryBuilder::inc(1),
        'number' => QueryBuilder::dec(3),
    ]);
```

