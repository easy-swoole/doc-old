---
title: Update
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Update
---



# Update

::: tip 
The function of ORM depends on mysqli2.x component. The $data parameter of update will be passed to mysqli to construct SQL.

So we can use most of mysqli's functions directly
:::

## By existing model

This approach is our most recommended, and is the core idea of the ORM component, mapping the operation of the data to the operation of the object.

```php
$user = UserModel::create()->get(1);
$user->update([
  'is_vip' => 1
]);
```

```php

$user = UserModel::create()->get(1);
// After the specified field assignment
$user->is_vip = 1;
$user->update();
```

## via where update

`update` parameter 1 is passed to the update array `[field name=>field value]`, parameter 2 is passed where condition array

```php
$res = UserModel::create()->update([
     'name' => 'new'
], ['id' => 1]);
```

## The number of rows affected by the actual update
::: warning
Update returns the execution statement is successful, only false when the mysql statement error, otherwise true
, so you need getAffectedRows to determine if the update is successful.
:::

```php
$user = UserModel::create()->get(1);
$user->update([
  'is_vip' => 1
]);
var_dump($user->lastQueryResult()->getAffectedRows());
```



## Get specific syntax errors
::: warning
If update returns false, then there is an error on your statement, you can get specific error information through getLastError
:::
```php
$user = UserModel::create()->get(1);
$suc = $user->update([
   'is_vip' => 1
]);
If($suc=== false){
Var_dump($user->lastQueryResult()->getLastError());
}

```

## Effective field description

The data in the model is divided into normal data and auxiliary data.

If the table structure has data for the field, it belongs to normal data, and the others belong to the ancillary data.

### Recommended update usage

First map the correct data object through the model, then change the value and update.

The fields within the table structure will be automatically validated. Other ancillary data does not make up update sql.

```php
$user = UserModel::create()->get(1);
$user->is_vip = 1;
$user['vip_time'] = 15;
$res = $user->update();
```

### Batch update

In this way, the data of the non-table structure fields will not be filtered, and all of them constitute sql, which may cause mysql error.

```php
$res = UserModel::create()->update([
   'is_vip' => 0,
   'test' => 3333, // table structure does not exist in the field
], [
   'vip_time' => 0
]);
```

## Quick update

```php
TestUserModel::create()->update([
    'age' => QueryBuilder::inc(3), // Self increment 3
    'test' => QueryBuilder::dec(4), // Self descending 4
], [
    'name' => 'Siam222'
]);
```
