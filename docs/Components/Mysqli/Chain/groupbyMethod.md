---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# groupBy

通常用于结合合计函数，根据一个或多个列对结果集进行分组 。

group方法只有一个参数，并且只能使用字符串。

## 使用

```php
$builder->groupBy('is_vip')->get('getTable');
$builder->groupBy('is_vip,level')->get('getTable');
```


## 传参说明

方法原型
```php
function groupBy($groupByField)
```

- $groupByField string 分组字段
