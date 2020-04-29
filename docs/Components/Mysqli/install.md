---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# Mysqli

## 安装

```php
composer require easyswoole/mysqli
```

## Client 用法
```php
$config = new \EasySwoole\Mysqli\Config([
    'host'          => '',
    'port'          => 3300,
    'user'          => '',
    'password'      => '',
    'database'      => '',
    'timeout'       => 5,
    'charset'       => 'utf8mb4',
]);

$client = new \EasySwoole\Mysqli\Client($config);

go(function ()use($client){
    //构建sql
    $client->queryBuilder()->get('user_list');
    //执行sql
    var_dump($client->execBuilder());
});
```

::: danger
需要调用execBuilder()才会执行
:::
