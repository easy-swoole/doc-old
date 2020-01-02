---
title: delete
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|delete
---

# delete

Deleting records uses the `destroy` method, which can pass in multiple expression type parameters. The number of records that are affected after execution

## By existing model

This approach is our most recommended, and is the core idea of the ORM component, mapping the operation of the data to the operation of the object.

```php
$user = UserModel::create()->get(1);
$user->destroy();
```

## By Primary Key

```php
$res = UserModel::create()->destroy(1); //by specifying the primary key directly (if it exists)
$res = UserModel::create()->destroy('2,4,5');//Specify multiple parameters for each parameter as a different primary key
$res = UserModel::create()->destroy([3, 7]);//Array specifies multiple primary keys
```

### By where condition

```php
$res = UserModel::create()->destroy(['age' => 21]);//Array specifies where condition results are removed
$res = UserModel::create()->destroy(function (QueryBuilder $builder) {
     $builder->where('id', 1);
});
```

## Delete full table data

If you need to empty the table, you can use the destroy method to pass in (null, true), which will delete all rows.

```php
$res = UserModel::create()->destroy(null,true);
```
