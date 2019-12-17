---
title: 事务操作
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|事务操作
---

# 事务操作

## 开启事务
传参说明

| 参数名          | 是否必须 | 参数说明                                                     |
| --------------- | -------- | ------------------------------------------------------------ |
| connectionNames | 否       | 开启事务的连接名称; string或者array<br/>在addConnection时指定。一般情况下无需特别设置 |



返回说明：bool  开启成功则返回true，开启失败则返回false




```php
DbManager::getInstance()->startTransaction($connectionNames = 'default');
```

## 提交事务

传参说明

| 参数名      | 是否必须 | 参数说明                                                     |
| ----------- | -------- | ------------------------------------------------------------ |
| connectName | 否       | 指定提交一个连接名，若不传递，则自动提交当前协程内获取的事务连接。<br/>一般情况下无需特别设置 |



返回说明：bool  提交成功则返回true，失败则返回false

```php
DbManager::getInstance()->commit($connectName = null);
```

## 回滚事务

传参说明

| 参数名      | 是否必须 | 参数说明                                                     |
| ----------- | -------- | ------------------------------------------------------------ |
| connectName | 否       | 指定提交一个连接名，若不传递，则自动提交当前协程内获取的事务连接。<br/>一般情况下无需特别设置 |



返回说明：bool  提交成功则返回true，失败则返回false

```php
DbManager::getInstance()->rollback();
```



## 事务用例

```php 
$user = UserModel::create()->get(4);

$user->age = 4;
// 开启事务
$strat = DbManager::getInstance()->startTransaction();

// 更新操作
$res = $user->update();

// 不管更新成功还是失败，直接回滚
$rollback = DbManager::getInstance()->rollback();

// 返回false 因为连接已经回滚。事务关闭。
$commit = DbManager::getInstance()->commit();
var_dump($commit);
```

