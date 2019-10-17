# Join

join通常有下面几种类型，不同类型的join操作会影响返回的数据结果。

- INNER JOIN: 等同于 JOIN（默认的JOIN类型）,如果表中有至少一个匹配，则返回行
- LEFT JOIN: 即使右表中没有匹配，也从左表返回所有的行
- RIGHT JOIN: 即使左表中没有匹配，也从右表返回所有的行
- FULL JOIN: 只要其中一个表中存在匹配，就返回行

## 基本使用

```php
$builder->join('table2','table2.col1 = getTable.col2')->get('getTable');
```

## 指定类型

```php
$builder->join('table2','table2.col1 = getTable.col2','LEFT')->get('getTable');
```

## 传参说明

方法原型
```php
function join($joinTable, $joinCondition, $joinType = '')
```

- $joinTable 表名
- $joinCondition 条件
- $joinType 类型