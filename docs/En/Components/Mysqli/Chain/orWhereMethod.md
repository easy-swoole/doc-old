---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# orWhere

Quickly complete conditional statement construction

The following two methods are equivalent

```php
$builder->where('is_vip', 1)->where('id', [1,2], '=', 'OR')->get('getTable');
```

```php
$builder->where('is_vip', 1)->orWhere('id', [1,2])->get('getTable');
```

## Pass the instructions

Method prototype

```php
function orWhere($whereProp, $whereValue = 'DBNULL', $operator = '=')
```

- $whereProp string Support indexed arrays, kv arrays, or directly passed strings
- $whereValue stringConditional value
- $operator string Operator
