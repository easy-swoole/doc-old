---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# 查询数据

## 基本查询

用id查询一条用户数据：

```php
$client->queryBuilder()->where('id', 1)->getOne('user_list');
```

查询多条数据：

```php
$client->queryBuilder()->where('is_vip', 1)->get('user_list');
```

::: warning
get/getOne返回值查看链式操作里的详细文档
:::


::: tip 提醒
在使用 `get` 和 `getOne` 等操作方法前可以任意使用链式操作方法
:::
