---
title: 指定连接名
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|指定连接名
---


# 指定连接名

从 [配置信息注册](/Components/Orm/configurationRegister) 章节，我们已经知道了，在注册配置信息的时候，可以给这份配置指定一个`连接名`


可以通过模型类自定义属性 `connectionName` 来指定使用的连接配置，默认为 `default`


假设已经通过 配置信息注册 章节注册了一个 `read` 连接名的配置

那么我们可以在Model中定义指定``` read ```连接名

```php
Class AdminModel extends \EasySwoole\ORM\AbstractModel 
{
    protected $connectionName = 'read';
}
```


可以继续查看 [读写分离](/Components/Orm/readWriteSeparation) 章节，进一步查看如何使用不同数据库配置。
