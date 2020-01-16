---
title: Orm Invoke
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|Orm Invoke
---

# orm invoke

在高并发情况下，资源浪费的占用时间越短越好，可以提高程序的服务效率。

在ORM默认情况下是使用defer方法获取pool内的连接资源，并在协程退出时自动归还，在此情况下，在带来便利的同时，会造成不必要资源的浪费。

我们可以使用invoke方式，让ORM查询结束后马上归还资源，可以提高资源的利用率。

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


## 方法支持

在此种模式下，主要有两个方法需要讲解。

- DbManager下的invoke方法 （从连接池内获取一个连接，并在闭包完成时归还连接）
- Model的invoke方法 （注入客户端连接，不再从连接池内defer获取）

## invoke中调试sql

版本>=1.2.12提供特性

关于lastQueryResult、lastQuery返回内容，请查看章节`模型执行结果`、`最后执行语句`

```php
$client->lastQueryResult();
$client->lastQuery();
```

