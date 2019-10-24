---
title: 连贯操作
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|连贯操作
---


# 连贯操作

ORM提供的链式操作方法，可以有效的提高数据存取的代码清晰度和开发效率。

## where
你可以使用 where 方法。调用 where 最基本的方式是需要传递一个参数这个参数可以传递多种不同表现:

```php
$model =  UserListModel::create();
$getCoherent = $model->where(['state' => 1])->get();//数组方式
$getCoherent2 = $model->where($getCoherent->id)->get();//主键方式
```

## group

group 方法可以将结果分组。

```php
$group = TestUserListModel::create()->field('sum(age) as age, `name`')->group('name')->all(null);
```

## order

order 方法可用于将原生字符串设置为 order by 子句的值：

```php
$order = TestUserListModel::create()->order('id', 'DESC')->get();
```

## select

select 方法使用和[查询](/Components/Orm/query)中的 all 方法相同：

```php
$groupDivField = TestUserListModel::create()->field('sum(age), `name`')->group('name')->select();
```


