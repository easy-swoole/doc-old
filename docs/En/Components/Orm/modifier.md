---
title: modifier
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|modifier
---

# modifier

The role of the modifier is to automatically process when the model instance modifies the field assignment

To define a modifier, you must create a "`set` field name `Attr`" method on your model.

The modifier method to be defined needs to be named using "Little Hump". In this example, we will define a modifier for the `name` property.

::: tip
The fields of the data table are automatically converted to hump method access when using the getter
:::

This modifier is called automatically when the model instance attempts to modify the value of the `name` field:

```php
Class UserModel extends AbstractModel
{
     /**
      * $value mixed is the original value
      * $data array is the current model all values
      */
     Protected function setNameAttr($value, $data)
     {
         Return $value."_plus a uniform suffix";
     }
}
```
The following code will be saved by the modifier when the settings are saved.
```php
$model = new UserModel([
     'name' => 'siam',
     'age' => 21,
]);
$model->save();
//name is stored as: siam_ plus a uniform suffix
```
