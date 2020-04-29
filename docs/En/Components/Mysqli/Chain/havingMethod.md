---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# having

Used to match the group method to filter data (usually aggregated conditions) from the results of the grouping.


## Use

```php
$builder->groupBy('user_id')->having('times', 3,'>')->get('getTable');
```


## Pass the instructions

Method prototype
```php
function having($havingProp, $havingValue = 'DBNULL', $operator = '=', $cond = 'AND')
```

- `$havingProp` condition
- `$havingValue` value
- `$operator string` Operator
- `$cond string` Connection condition
