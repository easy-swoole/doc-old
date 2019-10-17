# 查询数据

## 基本查询

用id查询一条用户数据：

```php
$client->queryBuilder()->where('id', 1)->getOne('user_list');
```

查询多条数据：

```php
$client->queryBuilder()->where('is_vip', 1)->get('user_list');
```

::: warning
get/getOne返回值查看链式操作里的详细文档
:::


::: tip 提醒
在使用 `get` 和 `getOne` 等操作方法前可以任意使用链式操作方法
:::