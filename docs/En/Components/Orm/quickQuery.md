---
title: Quick Query
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---


# Quick Query

Dependency relationship
- mysqli >=2.1.2
- ORM >= 1.2.5

Query the specified field value of a single line
- val(string $column)
- scalar(?string $column = null)

Query multiple rows of specified field values
- column(?string $column = null)
- indexBy(string $column)

## Return value description
- `val` When the row data exists and the field exists, the field value is returned.  
		When the field does not exist, the row data array is returned.
        When the row does not exist, return `null`
		
- `scalar` When the qualified data exists, the first data field value is returned.
           When the condition does not exist，Returns an empty array.
           When no parameter is passed, the primary key value is returned by default.
		
- `column` Returns an array of values for the field.
		   When the parameter is not passed, the primary key array is returned by default.
		   
- `indexBy`Returns an array of data with the specified field as the key.

## 示例

```php

// val Directly return a column of a row
$res = UserModel::create()->val('loginName');
var_dump($res);

// column A column of quick query results
$res = UserModel::create()->column('loginName');
var_dump($res);

// scalar First data in a column of quick query results
$res = UserModel::create()->scalar('loginName');
var_dump($res);

// indexBy Return the result array with the data of a field name
$res = UserModel::create()->indexBy('loginName');
var_dump($res);

```
