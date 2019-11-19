---
title: One-to-many association
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|One-to-many association
---

# One-to-many association

Define methods in the model

```php
Public function orders()
{
     Return $this->hasMany(OrdersModel::class, null, null, 'u_id');
}
```

OrdersModel is also a Model class, just defines a simple table structure

use
```php
$res = UserModel::create()->get(1);

/**
  * Association One-to-many
  */
Var_dump($res);
Var_dump($res->orders);
// null if the query is not available
// The query gets an array, and each child element is an instance of the OrdersModel class.
```