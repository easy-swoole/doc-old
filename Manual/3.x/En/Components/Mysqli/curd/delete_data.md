## Delete data
Delete data using delete method:

### delete($tableName, $numRows = null) 
Example:
```php
<?php
$table_name = 'xsk_test';
$result = $db->where('id',1)->delete($table_name,1);
$sql = $db->getLastQuery();
var_dump($result,$sql);
```
The generated SQL statement is:
```sql
DELETE FROM xsk_test WHERE  id = '1'  LIMIT 1;
```

>Note that when deleting, you need to pay attention to the existence of where conditions and the number of deleted items, so as to avoid deleting the whole table.