# fields

主要目的是查询时标识要返回的字段值

## 指定字段

```php
$client->queryBuilder()->fields(['id','title'])->get('user_list');
```

## 设置别名

```php
$client->queryBuilder()->fields(['id','title as notice'])->get('user_list');
```

## 使用SQL函数

```php
$client->queryBuilder()->fields(['id','SUM(score)'])->get('user_list');
```

## 传参说明

方法原型
```php
function fields($fields)
```

- $fields array|string 如果非数组时，只可传入一个字段名