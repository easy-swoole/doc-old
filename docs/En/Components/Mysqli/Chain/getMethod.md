---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# get

select Inquire

## Query usage

Query user data:

```php
$builder->get("user",null,"*");
```
## Pass the instructions

Method prototype
```php
function get($tableName, $numRows = null, $columns = null): ?QueryBuilder
```

- $tableName Table Name
- $numRows  The number of queries
- $columns Fields to be queried
