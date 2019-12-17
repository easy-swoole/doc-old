---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# groupBy

Typically used to combine aggregate functions to group result sets based on one or more columns.

The group method has only one argument and can only use strings.

## Use

```php
$builder->groupBy('is_vip')->get('getTable');
$builder->groupBy('is_vip,level')->get('getTable');
```


## Pass the instructions

Method prototype
```php
function groupBy($groupByField)
```

- $groupByField string Grouping field
