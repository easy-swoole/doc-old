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

## 实际更新影响的行数
::: warning
update返回的是执行语句是否成功,只有mysql语句出错时才会返回false,否则都为true
,所以需要getAffectedRows来判断是否更新成功
:::

```php
$user = UserModel::create()->get(1);
$user->update([
  'is_vip' => 1
]);
var_dump($user->lastQueryResult()->getAffectedRows());
```



## 获取具体语法错误
::: warning
update如果返回了false,那么代表你的语句有错误,可通过getLastError获取具体错误信息
:::
```php
$user = UserModel::create()->get(1);
$suc = $user->update([
  'is_vip' => 1
]);
if($suc=== false){
	var_dump($user->lastQueryResult()->getLastError());
}

```

## 生效字段说明

模型内数据分为正常数据、附属数据两种。

如果是表结构拥有字段的数据，则属于正常数据，其他则属于附属数据。

### 推荐更新用法

先通过model映射出正确的数据对象，然后再改变值，更新。

将会自动生效表结构内的字段。其他附属数据不会组成update sql。

```php
$user = UserModel::create()->get(1);
$user->is_vip = 1;
$user['vip_time'] = 15;
$res = $user->update();
```

### 批量更新

通过这种方式，不会过滤非表结构字段的数据，全部组成sql，可能造成mysql错误。

```php
$res = UserModel::create()->update([
  'is_vip' => 0,
  'test' => 3333,// 表结构不存在的字段
], [
  'vip_time' => 0
]);
```
