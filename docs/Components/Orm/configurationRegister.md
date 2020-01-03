---
title: 配置信息注册
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---

# 配置信息注册

ORM 的连接配置信息（数据库连接信息）需要注册到`连接管理器`中。

## 数据库连接管理器

ORM的连接管理由```EasySwoole\ORM\DbManager```类完成，它是一个单例类。

```php
use EasySwoole\ORM\DbManager;

DbManager::getInstance();
```


## 注册数据库连接配置

你**可以**在框架 `mainServerCreate` 主服务创建事件中注册连接

```php
use EasySwoole\ORM\DbManager;
use EasySwoole\ORM\Db\Connection;
use EasySwoole\ORM\Db\Config;


public static function mainServerCreate($register)
{
    $config = new Config();
    $config->setDatabase('easyswoole_orm');
    $config->setUser('root');
    $config->setPassword('');
    $config->setHost('127.0.0.1');

    DbManager::getInstance()->addConnection(new Connection($config));
}
```


## 数据库连接自带连接池说明

在默认实现中，ORM自带了一个`基于连接池`实现的连接类

`EasySwoole\ORM\Db\Connection` 实现了连接池的使用

```php
use EasySwoole\ORM\DbManager;
use EasySwoole\ORM\Db\Connection;
use EasySwoole\ORM\Db\Config;


public static function mainServerCreate($register)
{
    $config = new Config();
    $config->setDatabase('easyswoole_orm');
    $config->setUser('root');
    $config->setPassword('');
    $config->setHost('127.0.0.1');
    //连接池配置
    $config->setGetObjectTimeout(3.0); //设置获取连接池对象超时时间
    $config->setIntervalCheckTime(30*1000); //设置检测连接存活执行回收和创建的周期
    $config->setMaxIdleTime(15); //连接池对象最大闲置时间(秒)
    $config->setMaxObjectNum(20); //设置最大连接池存在连接对象数量
    $config->setMinObjectNum(5); //设置最小连接池存在连接对象数量

    DbManager::getInstance()->addConnection(new Connection($config));
}
```

::: tip 提示
详细的连接池属性介绍[点击查看](../Pool/config.md)
:::



