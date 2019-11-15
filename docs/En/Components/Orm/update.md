---
title: 更新
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|更新
---



# 更新

## 通过 已有Model

这种方式是我们最推荐的，也是ORM这种组件的核心思想，把数据的操作映射为对对象的操作。

```php
$user = UserModel::create()->get(1);
$user->update([
  'is_vip' => 1
]);
```

```php

$user = UserModel::create()->get(1);
//获取后指定字段赋值
$user->is_vip = 1;
$user->update();
```

## 通过 where 更新

`update` 参数1传入更新数组`[字段名=>字段值]`,参数2传递 where 条件数组

```php
$res = UserModel::create()->update([
    'name' => 'new'
], ['id' => 1]);
```
::: tip
 --要说明  无论是否真实更新到数据，都返回true
 -- 实际影响行数要以affectRows为准  然后附带affectRows的获取方式
:::