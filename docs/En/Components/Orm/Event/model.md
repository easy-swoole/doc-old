---
title: ORM
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---

# Model events

Model event refers to the behavior event triggered when the model performs write, modify, and delete operations

Method list

| Event name         | Event description         | parameter           |
|:-------------------|:----------------|:---------------|
| onBeforeInsert     | Pre insert event       |$model          |
| onAfterInsert      | Post insert event       |$model, $res    |
| onBeforeUpdate     | Events before update       |$model          |
| onAfterUpdate      | Post update events      |$model, $res    |
| onBeforeDelete     | Event before deleting       |$model          |
| onAfterDelete      | Event after deletion       |$model, $res    |

::: tip
`$model` Current model instance

`$res` The execution result of the current behavior is the same as `bool` type `false` when the execution fails. There are two situations when the execution succeeds:

Execution of `onafterdelete` event: `Int` affects the number of records, other events: `bool` type `true`:::

::: warning
Model events will not be available if ORM version is less than 1.1.19
:::

```php
class User extends AbstractModel
{
    /**
     * @var string
     */
    protected $tableName = 'users';

    public static $insert = false;
    public static $update = false;
    public static $delete = false;

    protected static function onBeforeInsert($model)
    {
        return self::$insert;
    }

    protected static function onAfterInsert($model, $res)
    {
        
    }

    protected static function onBeforeUpdate($model)
    {
        return self::$update;
    }

    protected static function onAfterUpdate($model, $res)
    {
        
    }

    protected static function onBeforeDelete($model)
    {
        return self::$delete;
    }

    public static function onAfterDelete($model, $res)
    {
        
    }
}
```
