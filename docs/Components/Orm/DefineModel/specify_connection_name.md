---
title: 指定连接名
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|指定连接名
---


# 指定连接名

```php
DbManager::getInstance()->addConnection(ConnectionInterface $con，string $connectionName = 'default');
```
可以存在多个连接,而多个连接通过模型类自定义属性 `connectionName` 值来当做唯一连接名,默认为源码中所定义的名称. 
在模型类中 可以更改 `connectionName`属性，将当前模型指向不同的数据库连接(已注册连接)使用

指定``` blank ```连接方式

```php
Class AdminModel extends \EasySwoole\ORM\AbstractModel {

    protected $connectionName = 'blank';
}
```

添加``` blank ```连接方式

```php
\co::create(function() {
    $config = new Config();
    $config->setDatabase('cry');
    $config->setUser('root');
    $config->setPassword('root');
    $config->setHost('192.168.75.1');

    DbManager::getInstance()->addConnection(new Connection($config), 'blank');

    $admin = AdminModel::create()->get(1);

    print_r($admin->toArray());

});
```