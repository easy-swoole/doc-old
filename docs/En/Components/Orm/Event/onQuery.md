---
title: ORM
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---

# Callback event

### For the overall situation onQuery

Set callback events for the global as follows:

```php
// When registering ORM, call the callback function
public static function mainServerCreate(EventRegister $register)
{
    ...

    DbManager::getInstance()->addConnection(new Connection($config));
    DbManager::getInstance()->onQuery(function ($res, $builder, $start) {
        // Print parameter or write log
    });
}
```

The onquery callback will inject three parameters

- `res`Query result object, class name is`EasySwoole\ORM\Db\Result`

Can refer to [results of enforcement](../lastResult.md) Document for more results

- `builder`Query statement object, class name is`EasySwoole\Mysqli\QueryBuilder`

- `start`Start query timestamp, unit is`s`, type is `float`

::: tip
If the `withTotalCount ()` method is invoked during the query, there will be second callback results.
:::

::: warning
It should be noted that this callback party legal must be called when registering ORM, otherwise no result will be generated
:::

### Model specific onQuery

If we don't want to use the global onquery, we can call the onquery method when we perform the operation, so as to realize the callback for a specific model
```php
$res = User::create()->onQuery(function ($res, $builder, $start) {
    // Print parameter or write log
})->get(1);
```

::: tip
The three parameters of callback injection are the same as the global onquery
:::

### Log slow

We can manually determine the execution time to achieve a slow log recording function
```php
public static function mainServerCreate(EventRegister $register)
{
    ...

    DbManager::getInstance()->addConnection(new Connection($config));
    DbManager::getInstance()->onQuery(function ($res, $builder, $start) {
        $queryTime = Query time threshold;
        if (bcsub(time(), $start, 3) > $queryTime) {
            // Write log
        }
    });
}
```
