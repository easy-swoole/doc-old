---
title: 修改器
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|修改器
---

# 修改器

修改器的作用是在模型实例修改字段赋值时自动进行处理

若要定义一个修改器，则须在你的模型上创建一个 「`set` 字段名 `Attr`」 方法。

要定义的修改器方法需使用「小驼峰」来命名。在这个例子中，我们将为 `name` 属性定义一个修改器。

::: tip
数据表的字段会在使用获取器时自动转换为驼峰法访问
:::

当 模型实例 尝试修改 `name`字段的值时，将会自动调用此修改器：

```php
class UserModel extends AbstractModel
{
    /**
     * $value mixed 是原值
     * $data  array 是当前model所有的值 
     */
    protected function setNameAttr($value, $data)
    {
        return $value."_加一个统一后缀";
    }
}
```
如下代码在设置保存的时候将会被修改器处理后保存
```php
$model = new UserModel([
    'name' => 'siam',
    'age'  => 21,
]);
$model->save();
//name 存入后值为: siam_加一个统一后缀
```
