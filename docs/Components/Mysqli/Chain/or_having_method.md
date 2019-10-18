# orHaving

用于配合group方法完成从分组的结果中筛选（通常是聚合条件）数据。


## 使用

```php
$builder->groupBy('user_id')->orHaving('times', 3,'>')->get('getTable');
```

## 等同于


```php
$builder->groupBy('user_id')->having('times', 3,'>'，'OR')->get('getTable');
```

## 传参说明

方法原型
```php
function orHaving($havingProp, $havingValue = 'DBNULL', $operator = '=')
```

- $havingProp 条件
- $havingValue 值
- $operator string 操作符