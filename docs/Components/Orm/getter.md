---
title: 获取器
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|获取器
---


# 获取器

获取器的作用是在获取数据的字段值后自动进行处理

若要定义一个获取器，则须在你的模型上创建一个 「`get` 字段名 `Attr`」 方法。

要访问的字段的获取器方法需使用「小驼峰」来命名。在这个例子中，我们将为 `status` 属性定义一个访问器。

::: tip
数据表的字段会在使用获取器时自动转换为驼峰法访问
:::

当 ORM实例 尝试获取 status 的值时，将会自动调用此访问器：
```php
class UserModel extends AbstractModel
{ 
    /**
     * $value mixed 是原值
     * $data  array 是当前model所有的值 
     */
    protected function getStatusAttr($value, $data)
    {
        $status = [-1=>'删除',0=>'禁用',1=>'正常',2=>'待审核'];
        return $status[$value];
    }
}
```

获取器还可以定义数据表中不存在的字段，例如：
```php
protected function getEasyswooleAttr($value,$data)
{
  return 'Easyswoole用户-'.$data['id'];
}
```
那么在外部我们就可以使用这个easyswoole字段了
```php
$res = UserModel::create()->get(4);
var_dump($res->easyswoole);
```


