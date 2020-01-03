---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# limit

The limit method is mainly used to specify the number of queries and operations, especially when using paging queries.

## Number of queries

Query 10 user data:

```php
$builder->limit(10)->get('user_list');
```

## Pass the instructions

Method prototype
```php
function limit(int $one, ?int $two = null)
```

- $one If the second parameter is not passed, it means how many pieces of data are taken; if the second parameter is passed, it means starting from the first line.
- $tow Can not pass, if passed, it means starting from $one, taking $tow line data
