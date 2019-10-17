# groupBy

通常用于结合合计函数，根据一个或多个列对结果集进行分组 。

group方法只有一个参数，并且只能使用字符串。

## 使用

```php
$builder->groupBy('is_vip')->get('getTable');
$builder->groupBy('is_vip,level')->get('getTable');
```


## 传参说明

方法原型
```php
function groupBy($groupByField)
```

- $groupByField string 分组字段