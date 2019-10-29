---
title: 查询
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|查询
---


# 查询

## 从数据表中获取单行或单列

如果你只需要从数据表中获取一行数据，你可以使用 `get` 方法, 该方法可以传入多种类型值。

该方法返回一个 `EasySwoole\ORM\AbstractModel` 实例可以**复用**进行模型的其他操作, 当没有查询结果时返回 `null` 

### 通过主键查询
```php
$res = UserModel::create()->get(1);

$model = new UserModel();
$res = $model->get(1);
$res->destroy();//删除获取的单条记录
```

### 通过 where 条件查询

传入一个条件数组格式为: `[字段=>字段值]`
```php
$res = UserModel::create()->get(['emp_no' => 10001]);

$model =  UserModel::create();
$getCoherent = $model->where(['state' => 1])->get();
```

### 其他方法

语义化 `findOne` 方法, 使用方式同 `get` 方法. 不同的是返回值为 `array` 类型 `[字段 => 字段值, ...]`

```php
$res = UserModel::create()->findOne(['emp_no' => 10001]);
```

## 从数据表中获取多条

使用 `all` 方法, 该方法可以传入多种类型值。

该方法返回一个数组 `[ EasySwoole\ORM\AbstractModel实例, ...]` 每个键的值可以**复用**进行模型的其他操作, 当没有查询结果时返回空数组`[]` 

### 通过主键查询
```php
<?php
// 
$res = UserModel::create()->all([1, 3, 10003]);
$res = UserModel::create()->all('1, 3, 10003');
```

### 通过 where 条件查询

传入一个条件数组格式为: `[字段=>字段值]`

```php
$res = UserModel::create()->all(['name' => 'siam']);

$model =  UserModel::create();
$getCoherent = $model->where(['state' => 1])->all();
```

### 其他方法

语义化 `findAll` 方法, 使用方式同 `all` 方法. 不同的是返回值为 `array` 类型 `[[字段名称=>值], ...]`

```php
$res = UserModel::create()->findAll(['emp_no' => 10001]);

$model =  UserModel::create();
$getCoherent = $model->where(['state' => 1])->findAll();
```


## 复杂查询

在以上查的示例中，我们可以看到最后一个是闭包方式，我们可以在其中使用QueryBuilder的任意连贯操作，来构建一个复杂的查询操作。

支持方法列表查看Mysqli。

```php
$res = UserModel::create()->get(function (QueryBuilder $builder) {
    $builder->where('name', 'siam');
});

$res = UserModel::create()->all(function (QueryBuilder $builder) {
    $builder->where('name', 'siam');
    $builder->order('id');
    $builder->limit(10);
});
```


## 指定字段获取

field，作用于数据库 `select` 语句是获取指定的数据库列数据,也可以使用原生语句

获取``` admin_id ```，``` admin_name ```数据

```php
$admin = AdminModel::create()->field(['admin_id', 'admin_name'])->get(1);

$res = AdminModel::create()->field('sum(age) as siam, `name`')->get(1);
```

## 分页

limit和withTotalCount，获取分页列表数据以及总条数。

下面模拟获取分页列表数据，page为页码，limit为每页显示多少条数。

```php
$page = 1;          // 当前页码
$limit = 10;        // 每页多少条数据

$model = AdminModel::create()->limit($limit * ($page - 1), $limit * $page - 1)->withTotalCount();

// 列表数据
$list = $model->all(null, true);

$result = $model->lastQueryResult();

// 总条数
$total = $result->getTotalCount();
```