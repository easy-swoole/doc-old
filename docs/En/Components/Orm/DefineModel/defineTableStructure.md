---
title: Defining the table structure
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Defining the table structure
---


# Defining the table structure

## Automatically generate table structure
```php
$model = new User();
$table = $model->schemaInfo();
```
Use the `schemaInfo()` method in the model to get the structure of the current model specified data table and return an ʻEasySwoole\ORM\Utility\Schema\Table` object.

::: tip
The model itself will automatically generate the table structure, but each time you start Easyswoole, it will re-acquire the table structure information and cache it in this service until the Easyswoole service stops or restarts.
If you don't want to request the database every time you restart, you can define the method and return the Table object.
:::

## Custom Table Structure

In the model class, we implement a `getSchemaInfo` method that returns an ʻEasySwoole\ORM\Utility\Schema\Table` instantiated object.

```php
use EasySwoole\ORM\Utility\Schema\Table;

class User extends AbstractModel
{
    /**
     * Acquisition of the table
     * Here you need to return an EasySwoole\ORM\Utility\Schema\Table
     * @return Table
     */
    public function schemaInfo(bool $isCache = true): Table
    {
        $table = new Table();
        $table->colInt('id')->setIsPrimaryKey(true);
        $table->colChar('name', 255);
        $table->colInt('age');
        return $table;
    }
}

```
### Table Field

In the Table, there is a colX series method for representing the type of the table field, such as the Int, Char of the above example.

```php
$table->colInt('id');
$table->colChar('name', 255);
```

### Table primary key

If you need to specify a field as the primary key, you can use the continuous operation mode and continue to specify it later.

```php
$table->colInt('id')->setIsPrimaryKey(true);
```

