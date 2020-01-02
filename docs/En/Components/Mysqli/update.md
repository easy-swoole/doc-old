---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# Update data

## WHERE UPDATE

```php
$client->queryBuilder()->where('whereUpdate', 'whereValue')->update('updateTable', ['a' => 1]);
```

## LIMIT UPDATE

```php
$client->queryBuilder()->update('updateTable', ['a' => 1], 5);
```

## Quick update

```php
$client->queryBuilder()
    ->where('whereUpdate', 'whereValue')
    ->update('updateTable', [
        'age'    => QueryBuilder::inc(1),
        'number' => QueryBuilder::dec(3),
    ]);
```

