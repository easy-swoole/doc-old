---
title: ORM组件
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# ORM 连接管理
ORM的链接管理完全依赖```EasySwoole\ORM\DbManager```这个类，它是一个单例类。
## 获取管理器
```php
use EasySwoole\ORM\DbManager;

DbManager::getInstance();
```

## 注册连接
### 函数原型
```php
use EasySwoole\ORM\Db\ConnectionInterface;

DbManager::getInstance()->addConnection(ConnectionInterface $con，string $connectionName = 'default');
```
连接管理器要求注入一个```ConnectionInterface```实例，在EasySwoole的默认实现中，ORM自带了一个基于连接池实现的连接对象，实例代码如下：
```php
use EasySwoole\ORM\DbManager;
use EasySwoole\ORM\Db\Connection;
use EasySwoole\ORM\Db\Config;

$config = new Config();
$config->setDatabase('easyswoole_orm');
$config->setUser('root');
$config->setPassword('');
$config->setHost('127.0.0.1');

DbManager::getInstance()->addConnection(new Connection($config));
```

> 你可以注册多个连接实例，用连接名来区分连接。

## 事务
### 开始事务
```php
DbManager::getInstance()->startTransaction();
```
### 提交
```php
DbManager::getInstance()->commit();
```
### 回滚
```php
DbManager::getInstance()->rollback();
```

::: danger
开启事务之前，必须添加好数据库连接方式。
:::

### 事务例子
```php
$config = new Config();
    $config->setDatabase('cry');
    $config->setUser('root');
    $config->setPassword('root');
    $config->setHost('192.168.75.1');

    DbManager::getInstance()->addConnection(new Connection($config));
    
    try {
        DbManager::getInstance()->startTransaction();
        // 事务逻辑
      
        DbManager::getInstance()->commit();
    } catch (Exception $exception) {
        // 事务失败    
        DbManager::getInstance()->rollback();
    }
```