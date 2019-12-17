---
title: 聚合
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|聚合
---


# 聚合

ORM 还提供了各种聚合方法，比如 count, max，min， avg，还有 sum。你可以在构造查询后调用任何方法：

## max

```php
$max = TestUserListModel::create()->max('age');
```

## min

```php
$min = TestUserListModel::create()->min('age');
```

## count

```php
// count 不必传字段名
$count = TestUserListModel::create()->count();
```

## avg

```php
$avg = TestUserListModel::create()->avg('age');
```

## sum

```php
$sum = TestUserListModel::create()->sum('age');
```

