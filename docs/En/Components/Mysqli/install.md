# Mysqli

---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---


## Installation

```php
composer require easyswoole/mysqli
```

## Client usage
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
    //Build sql
    $client->queryBuilder()->get('user_list');
    //Execute SQL
    var_dump($client->execBuilder());
});
```

::: danger
Need to call execBuilder () to execute
:::
