# getOne

查询一条数据

## 查询用法

查询用户数据：

```php
$builder->getOne("user", "name");
```
## 传参说明

方法原型
```php
function getOne（$tableName，$columns ='*'）
```

- $tableName 表名
- $columns 需要查询的字段