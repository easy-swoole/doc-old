---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# orHaving

用于配合group方法完成从分组的结果中筛选（通常是聚合条件）数据。


## 使用

```php
$builder->groupBy('user_id')->orHaving('times', 3,'>')->get('getTable');
```

## 等同于


```php
$builder->groupBy('user_id')->having('times', 3,'>'，'OR')->get('getTable');
```

## 传参说明

方法原型
```php
function orHaving($havingProp, $havingValue = 'DBNULL', $operator = '=')
```

- $havingProp 条件
- $havingValue 值
- $operator string 操作符
