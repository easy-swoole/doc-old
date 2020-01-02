---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# getOne

查询一条数据

## 查询用法

查询用户数据：

```php
$builder->getOne("user", "name");
```
## 传参说明

方法原型
```php
function getOne（$tableName，$columns ='*'）
```

- $tableName 表名
- $columns 需要查询的字段
