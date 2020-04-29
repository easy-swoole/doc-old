---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# Query data

## Basic query

Query a user data with id:

```php
$client->queryBuilder()->where('id', 1)->getOne('user_list');
```

Query multiple pieces of data:

```php
$client->queryBuilder()->where('is_vip', 1)->get('user_list');
```

::: warning
Get/getOne return value to view the detailed documentation in the chain operation
:::


::: tip Reminder
You can use the chain operation method arbitrarily before using the operation methods such as `get` and `getOne`
:::
