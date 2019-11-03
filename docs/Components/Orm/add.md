---
title: 新增
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|新增
---

# 新增

要往数据库新增一条记录，先创建新模型实例，给实例设置属性，然后调用 save 方法：

```php
$model = new UserModel();
// 不同设置值的方式
$model->setAttr('id', 7);
$model->name = 'name';
$model['name'] = 'name';

$res = $model->save();
var_dump($res); // 返回自增id 或者主键的值  失败则返回null
```
在这个示例中，我们将 `id` 和 `name` 赋值给了 UserModel 模型实例的 `id` 和 `name` 属性。当调用 `save` 方法时，将会插入一条新记录


### 数组赋值

可以传入数组`[字段名=>字段值]` 再调用 `save` 方法保存

```php
$model = UserModel::create([
    'name' => 'siam',
    'age'  => 21,
]);

$res = $model->save();
```

```php
// data($data, $setter = true)  
// 第二个参数 可以决定是否要调用修改器（如果要设置的话   下面的文档有说明）
$user = UserModel::create()->data([
    'name' => 'siam',
    'age'  => 21,
], false)->save();
```