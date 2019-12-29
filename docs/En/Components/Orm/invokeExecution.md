---
title: Orm Invoke
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---

# orm invoke

In the case of high concurrency, the shorter the waste time is, the better the service efficiency can be improved.

By default, the ORM uses the defer method to obtain the connection resources in the pool, and returns them automatically when the collaboration exits. In this case, it will bring convenience and waste unnecessary resources.

We can use the invoke method to return resources as soon as the ORM query is finished, which can improve the utilization of resources.
```php
DbManager::getInstance()->invoke(function ($client){

    $testUserModel = Model::invoke($client);
    $testUserModel->state = 1;
    $testUserModel->name = 'Siam';
    $testUserModel->age = 18;
    $testUserModel->addTime = date('Y-m-d H:i:s');

    $data = $testUserModel->save();
});
```


## Method support

In this mode, there are two main methods to be explained.

- Invoke method under DbManager (get a connection from the connection pool and return the connection when the closure is completed)
- Invoke method of Model (inject client connection, no longer get from defer in connection pool)

