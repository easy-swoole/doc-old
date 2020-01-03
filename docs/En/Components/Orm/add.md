---
title: New
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|New
---

# New

To add a new record to the database, first create a new model instance, set the properties for the instance, and then call the save method:

```php
$model = new UserModel();
// Different ways of setting values
$model->setAttr('id', 7);
$model->name = 'name';
$model['name'] = 'name';

$res = $model->save();
var_dump($res); // Returns the value of the self-incrementing id or primary key. If it fails, it returns null.
```
In this example, we assign `id` and `name` to the `id` and `name` attributes of the UserModel model instance. When the `save` method is called, a new record will be inserted.


### Array assignment

You can pass in the array `[field name=>field value]` and call the `save` method to save it.

```php
$model = UserModel::create([
    'name' => 'siam',
    'age'  => 21,
]);

$res = $model->save();
```

```php
// data($data, $setter = true)  
// The second parameter can determine whether you want to call the modifier (if you want to set it, the documentation below)
$user = UserModel::create()->data([
    'name' => 'siam',
    'age'  => 21,
], false)->save();
```
