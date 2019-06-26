## Update data
Update data using update method

### update($tableName, $tableData, $numRows = null)
Example:
```php
<?php
$table_name = 'xsk_test';
$result = $db->where('id',1)->update($table_name,['name'=>'231']);
$sql = $db->getLastQuery();
var_dump($result,$sql);
```
The generated Sql statement is:
```sql
UPDATE xsk_test SET `name` = '231' WHERE  id = '1'
```

>Note that when updating, you need to pay attention to the existence of where conditions and the number of updates to avoid causing full table updates

### setValue($tableName, $filedName, $value)
Use setValue to quickly update the value of a field