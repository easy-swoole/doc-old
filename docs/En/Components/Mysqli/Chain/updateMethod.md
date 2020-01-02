---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# update

Update


## Pass the instructions

Method prototype
```php
function update($tableName, $tableData, $numRows = null)
```

- $tableName Table Name
- $tableData Updated data
- $numRows  Can not pass, if passed, update the $numRows row data
