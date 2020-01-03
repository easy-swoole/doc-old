---
title: Swoole Table
meta:
  - name: description
    content: EasySwoole has a basic package for Swoole table for shared memory
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|TableManager|Swoole Table
---

# TableManager
`EasySwoole\Component\TableManager`
EasySwoole has a basic package for Swoole table for shared memory

## Method list

### getInstance()
This method is used to get the TableManager manager instance.

### add($name,array $columns,$size = 1024)
This method is used to create a table

### get($name):?Table
This method is used to get the table that has been created.

## Sample code

```php
TableManager::getInstance()->add(
    self::TABLE_NAME,
    [
        'currentNum'=>['type'=>Table::TYPE_INT,'size'=>2],
    ],
    1024
);
```


::: warning 
Note: Do not create a swoole table in callback locations such as onRequest, OnReceive, etc. The swoole table should be created before the service is started, for example in the mainServerCreate event.
:::
