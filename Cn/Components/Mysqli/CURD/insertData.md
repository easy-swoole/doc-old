<head>
     <title>EasySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池</title>
     <meta name="keywords" content="EasySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池"/>
     <meta name="description" content="asySwoole mysqli|swoole mysqli|swoole mysql|swoole 数据库连接池|php连接池"/>
</head>
---<head>---

## 数据写入

### 使用insert方法可写入一条数据
```php
<?php
$insert_id = $db->insert($table_name, $data);
```

### 使用原生语句方法可写入数据 
```php
<?php
$result = $db->rawQuery('insert into xsk_test (`name`)values ("tioncico")',[]);
$id = $db->getInsertId();
```

### insertMulti($tableName, array $multiInsertData, array $dataKeys = null)
使用insertMulti可插入多条数据