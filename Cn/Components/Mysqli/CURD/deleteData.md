<head>
     <title>EasySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池</title>
     <meta name="keywords" content="EasySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池"/>
     <meta name="description" content="asySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池"/>
</head>
---<head>---

## 删除数据
删除数据使用delete方法:

### delete($tableName, $numRows = null) 
示例:
```php
<?php
$table_name = 'xsk_test';
$result = $db->where('id',1)->delete($table_name,1);
$sql = $db->getLastQuery();
var_dump($result,$sql);
```
生成的sql语句为:
```sql
DELETE FROM xsk_test WHERE  id = '1'  LIMIT 1;
```

>注意,删除时需要注意是否存在where条件和删除条数,避免造成全表删除