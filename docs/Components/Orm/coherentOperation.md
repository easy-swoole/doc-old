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

你可以使用 where 方法。调用 where 最基本的方式是需要传递一个参数

这个参数可以传递多种不同表现:

### 主键

```php
// 主键
$user = UserListModel::create()->where(1)->get();

// 多个主键
$user = UserListModel::create()->where([1,2,3])->all();
```

### 数组

```php
// [字段名=> 字段值]数组方式
$user = UserListModel::create()->where(['state' => 1])->get();

// 复杂条件数组
$user = UserListModel::create()->where([
    'age'  => [[18,23], 'between'],
    'name' => ['siam', 'like', 'or'],
])
```

### 原生sql

```php
$user = UserListModel::create()->where("sql 语句 需要自己注意注入风险")->get();
```

### 其他**Mysqli**链式操作里的where传参

实现 `EasySwoole\Mysqli\QueryBuilder` 中 where 传参

更多操作还可以查阅**Mysqli**链式操作里的where章节

```php
// 走builder原生的where
$getCoherent5 = UserListModel::create()->where('id', 1, '=')->get();
$getCoherent6 = UserListModel::create()->where('id', 1, '!=')->get();
$getCoherent6 = UserListModel::create()->where('id', 1, 'like')->get();
```

## alias

alias用于设置当前数据表的别名

```php
$res = TestUserListModel::create()->alias('siam')->where(['siam.name' => 'test'])->all();
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

## join

join通常有下面几种类型，不同类型的join操作会影响返回的数据结果。

- INNER JOIN: 等同于 JOIN（默认的JOIN类型）,如果表中有至少一个匹配，则返回行
- LEFT JOIN: 即使右表中没有匹配，也从左表返回所有的行
- RIGHT JOIN: 即使左表中没有匹配，也从右表返回所有的行
- FULL JOIN: 只要其中一个表中存在匹配，就返回行

```php
object join ( mixed $joinTable , string $joinCondition = null [, string $type = 'INNER'] )
```

$joinTable 要关联的（完整）表名以及别名
$joinCondition 关联条件.
$type 关联类型。可以为:'LEFT', 'RIGHT', 'OUTER', 'INNER', 'LEFT OUTER', 'RIGHT OUTER', 'NATURAL'，不区分大小写，默认为INNER(数据库软件 默认)。

```php
$join = TestUserListModel::create()->join('table2','table2.col1 = user_list.col2')->get();

$join2 = TestUserListModel::create()->alias('list')->join('table2 as t2','t2.col1 = list.col2')->get();
```