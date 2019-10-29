---
title: 更新
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|更新
---



# 更新

更新时指定 `id` 为 `1` 的 where 条件

## 静态更新

`update` 参数1传入更新数组`[字段名=>字段值]`,参数2传递 where 条件数组

```php
$res = UserModel::create()->update([
    'name' => 'new'
], ['id' => 1]);
```

## 先获取后更新

```php
<?php
// 根据模型对象进行更新（无需写更新条件）
$model = UserModel::create()->get(1);

// 获取后传入更新数组
$res = $model->update([
    'name' => 123,
]);

//获取后指定字段赋值
$model->name = 323;
$model['name'] = 333;

// 调用保存  返回bool 成功失败
$res = $model->update();
var_dump($res);
```