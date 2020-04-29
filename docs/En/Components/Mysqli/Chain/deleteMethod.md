---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# delete

Delete query


## Pass the instructions

Method prototype
```php
function delete($tableName, $numRows = null)
```

- $tableName Table Name
- $numRows  Can not pass, if passed, delete $numRows row data
