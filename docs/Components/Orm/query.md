---
title: 查询
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|查询
---


# 查询
```php
<?php

// 获取单条(返回一个模型)
$res = UserModel::create()->get(10001);
$res = UserModel::create()->get(['emp_no' => 10001]);
var_dump($res); // 如果查询不到则为null
// 不同获取字段方式
var_dump($res->emp_no);
var_dump($res['emp_no']);

// 批量获取 返回一个数组  每一个元素都是一个模型对象
$res = UserModel::create()->all([1, 3, 10003]);
$res = UserModel::create()->all('1, 3, 10003');
$res = UserModel::create()->all(['name' => 'siam']);
$res = UserModel::create()->all(function (QueryBuilder $builder) {
    $builder->where('name', 'siam');
});
var_dump($res);

```

## 复杂查询

在以上查的示例中，我们可以看到最后一个是闭包方式，我们可以在其中使用QueryBuilder的任意连贯操作，来构建一个复杂的查询操作。

支持方法列表查看Mysqli。

```php
$res = UserModel::create()->all(function (QueryBuilder $builder) {
    $builder->where('name', 'siam');
    $builder->order('id');
    $builder->limit(10);
});
```


## 指定字段获取

field，其作用是获取指定的数据库字段数据。

获取``` admin_id ```，``` admin_name ```数据

```php
$admin = AdminModel::create()->field(['admin_id', 'admin_name'])->get(1);

print_r($admin->toArray());

});
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
});
```

## 获取序列化记录数据

jsonSerialize，获取序列化记录数据。

```php
$model = AdminModel::create();

$admin = $model->get(1);

$data = $admin->jsonSerialize();
});
```

## 获取字符串json数据

__toString，将数据转化成字符串json数据并返回。

```php
$model = AdminModel::create();

$admin = $model->get(1);

$data = $admin->__toString();

var_dump($data);
```