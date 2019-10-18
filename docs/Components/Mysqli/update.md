# 更新数据

## WHERE UPDATE

```php
$client->queryBuilder()->where('whereUpdate', 'whereValue')->update('updateTable', ['a' => 1]);
```

## LIMIT UPDATE

```php
$client->queryBuilder()->update('updateTable', ['a' => 1], 5);
```

## 快捷更新

```php
$client->queryBuilder()
    ->where('whereUpdate', 'whereValue')
    ->update('updateTable', [
        'age'    => QueryBuilder::inc(1),
        'number' => QueryBuilder::dec(3),
    ]);
```

