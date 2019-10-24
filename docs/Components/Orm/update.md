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

```php
// 可以直接静态更新
$res = UserModel::create()->update([
    'name' => 'new'
], ['id' => 1]);
```

先获取后更新

```php
<?php

// 根据模型对象进行更新（无需写更新条件）
$model = UserModel::create()->get(1);

// 不同设置新字段值的方式
$res = $model->update([
    'name' => 123,
]);
$model->name = 323;
$model['name'] = 333;

// 调用保存  返回bool 成功失败
$res = $model->update();
var_dump($res);
```