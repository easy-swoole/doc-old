---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# orWhere

快速完成条件语句构建

下面两种方法等价

```php
$builder->where('is_vip', 1)->where('id', [1,2], '=', 'OR')->get('getTable');
```

```php
$builder->where('is_vip', 1)->orWhere('id', [1,2])->get('getTable');
```

## 传参说明

方法原型

```php
function orWhere($whereProp, $whereValue = 'DBNULL', $operator = '=')
```

- $whereProp string 支持索引数组、kv数组、或直接传递字符串
- $whereValue string 条件值
- $operator string 操作符
