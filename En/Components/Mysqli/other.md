## Other
The mysqli component also provides other methods:

####  resetDbStatus()
Reset the connection state, empty all query caches (where conditions, execution statements, etc.) and can be used on connection pool reclaim objects. This method can also be invoked when you are not sure whether the connection is cached or not.

####  tableExists($tables)
Determine whether the table exists (transferable array)
####  inc($num)
When updating a field, implement the field=field+$num
Example:
```php
<?php
$table_name = 'xsk_test';
$db->update($table_name, ['num'=>$db->inc(3)]);
$sql = $db->getLastQuery();
var_dump($sql);
```
The generated SQL statement is:
```sql
UPDATE xsk_test SET `num` = num+3;
```
####  dec()
When updating fields, implement fields=fields-$num
####  setInc()
```
setInc($tableName, $filedName, $num = 1)  
```
A field adds itself
####  setDec()
```
setDec($tableName, $filedName, $num = 1)  
```
Directly subtract a field
####  withTotalCount()
Cache the total number of query conditions, and the cached data will be called by the getTotalCount () method
####  getTotalCount()
Total number of strips taken out with Total Count
####  getInsertId()
Get the last inserted ID
####  getLastQuery()
Get the last SQL statement executed
####  getLastError()
Get the content of the last query error
####  getLastErrno()
Get the number of the last query error