## Data fetch
Data reading is divided into two types: reading multiple data, reading single data, data reading support where and other coherent operations, specific coherent operations can be seen [coherent operations](../continuous_operation.md). This article will not explain.

### getOne($tableName, $columns = '*')
Using the getOne method to read a single piece of data
Usage:
```php
<?php
$table_name = 'xsk_test';
$data = $db->getOne($table_name,'name,code');
```
The generated SQL statement is:
```sql
SELECT  name,code FROM xsk_test LIMIT 1
```

### get($tableName, $numRows = null, $columns = '*')
#### Read multiple data using get method  
Usage:
```php
<?php
$table_name = 'xsk_test';
$data = $db->get($table_name,null,'*');
$sql = $db->getLastQuery();
var_dump($data,$sql);
```
The generated SQL statement is:
```sql
SELECT  * FROM xsk_test;
```
#### Implementing Paging:
```php
<?php
$table_name = 'xsk_test';
$page=3;
$page_size=20;
$data = $db->get($table_name,[($page-1)*$page_size,$page_size],'*');
$sql = $db->getLastQuery();
var_dump($data,$sql);
```
The generated SQL statement is:
```sql
SELECT  * FROM xsk_test LIMIT 40, 20;
```

### getValue($tableName, $column, $limit = 1)
Get the value of a field using getValue()

### getColumn($tableName, $column, $limit = 1)
Getting data for a column using getColumn()

### has($tableName)
Judging whether data exists under this query condition

### Aggregate Query Method
  - count()
  - max()
  - min()
  - sum()
  - avg()


