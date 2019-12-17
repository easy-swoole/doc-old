---
title: 特殊条件查询
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|查询|特殊sql语句
---

# 特殊条件查询

## find_in_set

生成条件  find_in_set(1, name)

? 代表参数绑定，可以直接写明条件，第二个参数不传递即可，但需要注意防范注入风险

```php
$data = Model::create()->where("find_in_set(?, name)", [1])->get();
```

## 复杂where or

```php
// 生成大概语句：where status = 1 AND (id > 10 or id < 2)
Model::create()->where('status', 1)->where(' (id > 10 or id <2) ')->get();
```
