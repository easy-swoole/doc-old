---
title: 删除
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|删除
---

# 删除

```php
<?php
// 删除(返回影响的记录数)
$res = UserModel::create()->destroy(1); //通过直接指定主键(如果存在)
$res = UserModel::create()->destroy('2,4,5');//指定多个参数每个参数为不同主键
$res = UserModel::create()->destroy([3, 7]);//数组指定多个主键
$res = UserModel::create()->destroy(['age' => 21]);//数组指定 where 条件结果来删除
$res = UserModel::create()->destroy(function (QueryBuilder $builder) {
    $builder->where('id', 1);
});
```

如果你需要清空表，你可以使用 destroy 方法传入 (null,true)，它将删除所有行
```php
//删除全表数据
$res = UserModel::create()->destroy(null,true);
var_dump($res);
```
