---
title: Orm Results of Enforcement
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# Results of Enforcement

When a model executes a statement, it will save the execution result to`$model->lastQueryResult()`and the method will return an`EasySwoole\ORM\Db\Result`object
    
```php
<?php
$model = new AdminModel();
$model->all();
//Get query result object
$lastResult = $model->lastQueryResult();
//Get the total number of query data. You need to call`withTotalCount`to use this method
var_dump($lastResult->getTotalCount());
//Get the last inserted ID
var_dump($lastResult->getLastInsertId());
//Get the number of data affected by execution using update, delete and other methods
var_dump($lastResult->getAffectedRows());
//Get error code
var_dump($lastResult->getLastErrorNo());
//Get error message
var_dump($lastResult->getLastError());
//Get the result of executing MySQL
var_dump($lastResult->getResult());

// The following is provided after version > = 1.2.2

// Get the first of the results
var_dump($lastResult->getResultOne());
// Get a column in the result
var_dump($lastResult->getResultColumn(string $column));
// Get the first data of a column in the result
var_dump($lastResult->getResultScalar(string $column));
// Return the result array with a field named key
var_dump($lastResult->getResultIndexBy(string $column));
```

:::warning

When $model executes get, all, save and other similar methods, it can get error messages for debugging by calling GetLastError method:::
