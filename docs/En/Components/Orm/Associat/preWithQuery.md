---
title: ORM with Pre query
meta:
  - name: description
    content: Easyswoole ORM Component,
  - name: keywords
    content:  swoole|swoole extand|swoole frame|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli Coroutine client|swoole ORM|ORM with pre query
---

# Associated pre query

In normal association, we can quickly associate query data after defining the relationship in the model class file.

But at this time, we still need to get the association name manually to execute.

Pre query provides a way to automatically query the usage of associated data as soon as the master data is queried.

ORM version requires`>= 1.2.0`

## with method

The with method passes in an array containing the association name already defined in the class file

```php
$res = Model::create()->with(['user_list', 'user_store'])->get(1);

var_dump($res); // At this time, there are already data of two associated fields, user list and user sotre. It is no longer necessary to call them manually first.
```
