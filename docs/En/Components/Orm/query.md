---
title: 查询
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|查询
---


# 查询

查询一行
- get($where, $returnAsArray = false)
- findOne(where) 等同于等价的get($where, true)

查询多行
- all($where, $returnAsArray = false)
- select(where) 等同于等价的all($where, true)
- findAll(where) 等同于等价的all($where, true)

## 返回值说明

- `get`返回的是一个 `EasySwoole\ORM\AbstractModel` 实例，可以**复用**进行模型的其他操作 当没有查询结果时返回 `null` 
- `findOne`返回的是一个数组


- `all`返回的是一个数组，里面的每一个元素都是  `EasySwoole\ORM\AbstractModel` 实例
- `select`、`findAll`方法返回的是一个二维数组，没有查询结果时返回`null`

## 多种传参方式

在以上方法列表中，最重要的是`$where`参数，可以实现多种使用方式

```php
// 通过主键
$res = UserModel::create()->get(1);
// 通过key=>value 数组
$res = UserModel::create()->get([
  'u_id'    => 1,
  'u_state' => 0,
  'is_vip'  => 1
]);
// 通过闭包方式，构造复杂的sql
// 这是一种很强大灵活的方式，闭包的参数是一个mysqli组件的查询构造器，可以调用所有连贯操作
// http://www.easyswoole.com/Components/Mysqli/builder.html
$res = UserModel::create()->get(function(QueryBuilder $queryBuilder){
    $queryBuilder->where('u_state', 1);
    $queryBuilder->where('age', 12, '>');// 各种特殊操作符  between like != 等等都可以完成
    $queryBuilder->order('u_id');
});
// 连贯操作，继续可以往下查看ORM的文档
$res = UserModel::create()->where('u_id', 1)->get();
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