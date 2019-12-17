---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# where

Quickly complete the construction of conditional statements. The parameters of the where method support strings and arrays.

## General query

```php
$builder->where('col1', 2)->get('getTable');
```

## String statement

You can use string statements to build more complex conditions

```php
// Generate a rough statement: where status = 1 AND (id > 10 or id < 2)
$builder->where('status', 1)->where(' (id > 10 or id <2) ')->get('getTable);
```

## Special operator

```php
$builder->where('id', [1,2,3], 'IN')->get('getTable');
```

```php
$builder->where('age', 12, '>')->get('getTable');
```

## Connection condition

### orWhere

```php
$builder->where('is_vip', 1)->where('id', [1,2], '=', 'OR')->get('getTable');
```

```php
$builder->where('is_vip', 1)->orWhere('id', [1,2])->get('getTable');
```

## Pass the instructions

Method prototype

```php
function where($whereProp, $whereValue = 'DBNULL', $operator = '=', $cond = 'AND')
```

- $whereProp string Support indexed arrays, kv arrays, or directly passed strings
- $whereValue stringConditional value
- $operator string Operator
- $cond string Connection condition
