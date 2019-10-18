# get

select 查询

## 查询用法

查询用户数据：

```php
$builder->get("user",null,"*");
```
## 传参说明

方法原型
```php
function get($tableName, $numRows = null, $columns = null): ?QueryBuilder
```

- $tableName 表名
- $numRows  所查询的条数
- $columns 需要查询的字段