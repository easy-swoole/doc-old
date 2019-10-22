---
title: 配置信息注册
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---

# 配置信息注册
ORM 的配置信息注册需要先获取**连接管理器**,然后传入实现了 `\EasySwoole\ORM\Db\ConnectionInterface` 的数据库连接对象 和 本次数据库连接别名(有默认名)

## 获取连接管理器
ORM的连接管理完全依赖```EasySwoole\ORM\DbManager```这个类，它是一个单例类。

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
连接管理器要求注入一个```ConnectionInterface```接口实例，在EasySwoole的默认实现中，ORM自带了一个基于连接池实现的连接对象，实例代码如下：
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
你可以在框架 `mainServerCreate` 主服务创建事件中注册连接, 之后你就可以使用你创建的ORM模型实例化后的对象进行数据库操作了(必须要先进行注册连接)

### 连接多个数据库

```php
DbManager::getInstance()->addConnection(ConnectionInterface $con，string $connectionName = 'default');
```
可以存在多个连接,而多个连接通过不同的 `$connectionName` 值来当做唯一连接名,默认为源码中所定义的名称. 
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

### 自带连接池

<!--Easyswoole中已经实现了 `\EasySwoole\ORM\Db\ConnectionInterface` 接口的数据库连接类: `EasySwoole\ORM\Db\Connection`
`EasySwoole\ORM\Db\Connection`类实例化需要传入 `EasySwoole\ORM\Db\Config` 对象, 而`EasySwoole\ORM\Db\Config` 对象 继承了连接池配置`\EasySwoole\Pool\Config`
-->
在创建`EasySwoole\ORM\Db\Config`对象后可对连接池进行设置
详细的连接池属性介绍[点击查看](../Pool/config.md)

```php
use EasySwoole\ORM\DbManager;
use EasySwoole\ORM\Db\Connection;
use EasySwoole\ORM\Db\Config;

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
```
::: tip
你可以注册多个连接实例，修改 `$connectionName` 用不同的连接名来区分数据库连接。
:::

