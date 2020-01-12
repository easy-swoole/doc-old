---
title: ORM Last Execution Statement
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# Last execution statement

After a model executes a statement, it will save the executed statement to ` $model - > lastquery()`:

```php
<?php
$model = new AdminModel();
//Execute all query
var_dump($model->all());
//Print last executed`EasySwoole\Mysqli\QueryBuilder` object
var_dump($model->lastQuery());
//Print the last executed SQL statement
var_dump($model->lastQuery()->getLastQuery());
```

::: warning
$model->lastQuery() Query object is returned, and specific documents can be viewed:[Query Builder](/EN/Mysqli/builder.md) 文档
:::
