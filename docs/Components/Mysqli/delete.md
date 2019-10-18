# 删除数据

## LIMIT DELETE
```php
$client->queryBuilder()->delete('user_list', 3);
```

## WHERE DELETE

```php
$client->queryBuilder()->where('whereUpdate', 'whereValue')->delete('user_list');
```
