# limit

limit方法主要用于指定查询和操作的数量，特别在分页查询的时候使用较多。

## 查询数量

查询10个用户数据：

```php
$client->queryBuilder()->limit(10)->get('user_list');
```

## 传参说明

方法原型
```php
function limit(int $one, ?int $two = null)
```

- $one 若第二个参数不传，则代表取多少条数据；若第二个参数传递，则代表从第几行开始
- $tow 可不传，若传递，则代表从$one开始，取$tow行数据