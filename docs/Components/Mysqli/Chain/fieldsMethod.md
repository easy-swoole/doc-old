---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# field

主要目的是查询时标识要返回的字段值

## 指定字段

```php
$builder->field(['id','title'])->get('user_list');
```

## 设置别名

```php
$builder->field(['id','title as notice'])->get('user_list');
```

## 使用SQL函数

```php
$builder->field(['id','SUM(score)'])->get('user_list');
```

## 传参说明

方法原型
```php
function field($fields)
```

- $fields array|string 如果非数组时，只可传入一个字段名
