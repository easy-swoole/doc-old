---
title: 新增
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|新增
---

# 新增

要往数据库新增一条记录，先创建新模型实例，给实例设置属性，然后调用 save 方法：

```php
<?php
$model = new UserModel();
// 不同设置值的方式
$model->setAttr('id', 7);
$model->name = 'name';

$res = $model->save();
var_dump($res); // 返回自增id 或者主键的值  失败则返回null
```
在这个示例中，我们将 `id` 和 `name` 赋值给了 UserModel 模型实例的 `id` 和 `name` 属性。当调用 `save` 方法时，将会插入一条新记录


### 批量赋值

```php
<?php
$model = new UserModel([
    'name' => 'siam',
    'age'  => 21,
]);

$res = $model->save();
var_dump($res); // 返回自增id 或者主键的值  失败则返回null
```
在这个示例中，我们将 `id` 和 `name` 放置在数组中赋值给了 UserModel 模型实例创建参数中。当调用 `save` 方法时，将数组以键为字段名值为字段值方式插入一条新记录
