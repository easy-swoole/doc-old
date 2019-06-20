## Data Writing

### Using insert method to write a data
```php
<?php
$insert_id = $db->insert($table_name, $data);
```

### Write data using native statement methods 
```php
<?php
$result = $db->rawQuery('insert into xsk_test (`name`)values ("tioncico")',[]);
$id = $db->getInsertId();
```

### insertMulti($tableName, array $multiInsertData, array $dataKeys = null)
Multiple data can be inserted using insertMulti