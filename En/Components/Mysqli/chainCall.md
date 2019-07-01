## Chain-operation
Mysqli component provides a series of coherent operation (chain operation) methods, which can effectively improve the code clarity and development efficiency of data access, and support all CURD operations.

### where()
Add a condition, example:
```php
<?php
$table_name = 'xsk_test';
$db ->where('name',666,'=','and')
    ->where('id',1,'>','or')
    ->where('id',10,'<','and');
$data = $db->get($table_name);
$sql = $db->getLastQuery();
```
The generated SQL statement is:
```sql
SELECT  * FROM xsk_test WHERE  name = '666'  or id > '1'  and id < '10';
```
###orWhere()
Equivalent to where($whereProp, $whereValue = 'DBNULL', $operator = '=', $cond = 'OR');
###orderBy()
The order method belongs to one of the coherent operation methods of the model and is used to sort the results of the operation.
```php
<?php
$table_name = 'xsk_test';
$db->orderBy('id','desc');
$db->orderBy('code','asc');
$data = $db->get($table_name);
$sql = $db->getLastQuery();
var_dump($data,$sql);
```
The generated SQL statement is:
```sql
SELECT  * FROM xsk_test ORDER BY id DESC, code ASC;
```

###groupBy()
GROUP method is also one of the coherent operation methods. It is usually used to group result sets according to one or more columns in combination with the aggregate function. Example:
```php
<?php
$table_name = 'xsk_test';
$db->groupBy('name,code');
$data = $db->get($table_name);
$sql = $db->getLastQuery();
var_dump($data,$sql);
```
The generated SQL statement is:
```sql
SELECT  * FROM xsk_test GROUP BY name,code;
```

### join() join table
Used for querying and updating joined tables, etc.
Examples of join table queries:
```php
<?php
$table_name = '`xsk_test` as b';
$data = $db->join('`xsk_test_b` as a','a.id = b.id')->get($table_name,null,'*');
$sql = $db->getLastQuery();
var_dump($data,$sql);
```
The generated SQL statement is:
```sql
SELECT  * FROM `xsk_test` as b  JOIN `xsk_test_b` as a on a.id = b.id;
```

