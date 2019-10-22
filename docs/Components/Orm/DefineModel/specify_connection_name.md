---
title: 定义模型
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---


# 指定连接名

当 ORM 存在多个数据库连接时,模型的属性`$connectionName`可以修改为不同的连接名称来连接不同数据库
```php
class UserShop extends AbstractModel
{
    /**
     * 模型使用连接器的名称 当没用做定义的时候, 自动使用父类中默认的名称(default)
     * @var string 
     */
    protected $connectionName = 'default';
}
```
