---
title: ORM
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|模型事件
---

# 模型事件

模型事件是指模型在执行写入, 修改, 删除操作的时候触发的行为事件

方法列表

| 事件名称           | 事件说明         | 参数           |
|:-------------------|:----------------|:---------------|
| onBeforeInsert     | 插入前事件       |$model          |
| onAfterInsert      | 插入后事件       |$model, $res    |
| onBeforeUpdate     | 更新前事件       |$model          |
| onAfterUpdate      | 更新后事件       |$model, $res    |
| onBeforeDelete     | 删除前事件       |$model          |
| onAfterDelete      | 删除后事件       |$model, $res    |

::: tip
`$model` 当前模型实例

`$res` 当前行为执行结果, 当执行失败时类型统一为`bool`型`false`, 当执行成功时有两种情况:

执行`onAfterDelete`事件: `int`型 影响记录数, 其他事件: `bool`型 `true`
:::

::: warning
如果ORM版本低于1.1.19将无法使用模型事件
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
