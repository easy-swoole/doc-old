---
title: 自定义SQL执行
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|自定义SQL执行
---


# 自定义SQL执行

有时候你可能需要在查询中使用原生表达式。你可以使用 `QueryBuilder` 构造一个原生 `SQL` 表达式

ORM 内部依赖的是 `mysqli` 组件的`QueryBuilder`

```php
use EasySwoole\Mysqli\QueryBuilder;


$queryBuild = new QueryBuilder();
$queryBuild->raw("show tables");

$data = DbManager::getInstance()->query($queryBuild, $raw = true, $connectionName = 'default');

```

::: warning
原生 SQL 表达式将会被当做字符串注入到查询中，因此你应该小心使用，避免创建 SQL 注入的漏洞。
:::