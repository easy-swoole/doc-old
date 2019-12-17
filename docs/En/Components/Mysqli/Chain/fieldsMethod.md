---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# fields

The main purpose is to identify the field value to be returned when querying

## Specified field

```php
$builder->fields(['id','title'])->get('user_list');
```

## Set alias

```php
$builder->fields(['id','title as notice'])->get('user_list');
```

## Using SQL functions

```php
$builder->fields(['id','SUM(score)'])->get('user_list');
```

## Pass the instructions

Method prototype
```php
function fields($fields)
```

- $fields array|String can only pass in a field name if it is not an array
