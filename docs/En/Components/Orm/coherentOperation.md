---
title: Coherent operation
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Coherent operation
---


# Coherent operation

The chain operation method provided by ORM can effectively improve the code definition and development efficiency of data access.

## where

You can use the where method. The most basic way to call where is to pass a parameter

This parameter can pass a variety of different performances:

### Primary key

```php
// Primary key
$user = UserListModel::create()->where(1)->get();

// Multiple primary keys
$user = UserListModel::create()->where([1,2,3])->all();
```

### Array

```php
// [field name => field value] array mode
$user = UserListModel::create()->where(['state' => 1])->get();

// Complex condition array
$user = UserListModel::create()->where([
    'age'  => [[18,23], 'between'],
    'name' => ['siam', 'like', 'or'],
])
```

### Native sql

```php
$user = UserListModel::create()->where("Sql statement needs to pay attention to the injection risk")->get();
```

### Other **Mysqli** chain operation where the reference parameter

Implement the where in the `EasySwoole\Mysqli\QueryBuilder`

More operations can also refer to the where section of the **Mysqli** chain operation

```php
// Take the builder where is the native
$getCoherent5 = UserListModel::create()->where('id', 1, '=')->get();
$getCoherent6 = UserListModel::create()->where('id', 1, '!=')->get();
$getCoherent6 = UserListModel::create()->where('id', 1, 'like')->get();
```

## alias

`alias` is used to set the alias of the current data table

```php
$res = TestUserListModel::create()->alias('siam')->where(['siam.name' => 'test'])->all();
```

## group

The group method can group the results.

```php
$group = TestUserListModel::create()->field('sum(age) as age, `name`')->group('name')->all(null);
```

## order

The order method can be used to set the native string to the value of the order by clause:

```php
$order = TestUserListModel::create()->order('id', 'DESC')->get();
```

## join

Joins usually have the following types, and different types of join operations can affect the returned data results.

- INNER JOIN: is equivalent to JOIN (the default JOIN type), returning rows if there is at least one match in the table
- LEFT JOIN: returns all rows from the left table even if there is no match in the right table
- RIGHT JOIN: returns all rows from the right table even if there is no match in the left table
- FULL JOIN: return rows as long as there is a match in one of the tables

```php
object join ( mixed $joinTable , string $joinCondition = null [, string $type = 'INNER'] )
```

$joinTable (complete) table name and alias to be associated
$joinCondition association condition.
$type association type. Can be: 'LEFT', 'RIGHT', 'OUTER', 'INNER', 'LEFT OUTER', 'RIGHT OUTER', 'NATURAL', case insensitive, defaults to INNER (database software default).

```php
$join = TestUserListModel::create()->join('table2','table2.col1 = user_list.col2')->get();

$join2 = TestUserListModel::create()->alias('list')->join('table2 as t2','t2.col1 = list.col2')->get();
```
