---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# Join

`join` usually have the following types, and different types of `join` operations can affect the returned data results.

- INNER JOIN: Equivalent to JOIN (the default JOIN type), returning rows if there is at least one match in the table
- LEFT JOIN: Return all rows from the left table even if there is no match in the right table
- RIGHT JOIN: Return all rows from the right table even if there is no match in the left table
- FULL JOIN: Return rows as long as there is a match in one of the tables

## Basic use

```php
$builder->join('table2','table2.col1 = getTable.col2')->get('getTable');
```

## Specified type

```php
$builder->join('table2','table2.col1 = getTable.col2','LEFT')->get('getTable');
```

## Pass the instructions

Method prototype
```php
function join($joinTable, $joinCondition, $joinType = '')
```

- $joinTable Table Name
- $joinCondition Condition
- $joinType Type
