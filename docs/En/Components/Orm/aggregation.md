---
title: aggregation
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|aggregation
---


# aggregation

ORM also provides various aggregation methods such as count, max, min, avg, and sum. You can call any method after constructing the query:

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
// count No need to pass field name
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

