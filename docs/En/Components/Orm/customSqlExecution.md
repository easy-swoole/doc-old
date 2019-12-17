---
title: Custom SQL execution
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Custom SQL execution
---


# Custom SQL execution

Sometimes you may need to use a native expression in your query. You can construct a native `SQL` expression using `QueryBuilder`

The ORM internally relies on the `QueryBuilder` of the `mysqli` component.

```php
use EasySwoole\Mysqli\QueryBuilder;


$queryBuild = new QueryBuilder();
$queryBuild->raw("show tables");

// The second parameter raw specifies true, which means that the native sql is executed.
// The third parameter connectionName specifies the connection name to use, the default default
$data = DbManager::getInstance()->query($queryBuild, true, 'default');

```

Executed by Model
```php
// Note that the sql statement here is just an example.
// The correct recommended practice should still be to query the table corresponding to the Model class, get the data of the table structure field
$data = Model::create()->get(function ($queryBuild){
    $queryBuild->raw("shwo tables");
});
```

::: warning
Native SQL expressions will be injected into the query as strings, so you should be careful to avoid creating SQL injection vulnerabilities.
:::
