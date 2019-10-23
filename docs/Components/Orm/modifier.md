---
title: 修改器
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|修改器
---

# 修改器

setter，修改器的作用是可以在数据赋值的时候自动进行转换处理，例如：

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
如下代码在设置保存的时候将会被修改内容
```php
$model = new UserModel([
    'name' => 'siam',
    'age'  => 21,
]);
$model->save();
```

::: warning 
数据表的字段会自动转换为驼峰法
:::
