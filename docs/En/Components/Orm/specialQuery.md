---
title: Special Query
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---

# Special Query

## find_in_set

Generating conditions  find_in_set(1, name)

? represents parameter binding. You can write the conditions directly. The second parameter is not passed, but you need to pay attention to prevent injection risk

```php
$data = Model::create()->where("find_in_set(?, name)", [1])->get();
```

## complex where or

```php
// Generate approximate statements：where status = 1 AND (id > 10 or id < 2)
Model::create()->where('status', 1)->where(' (id > 10 or id <2) ')->get();
```
