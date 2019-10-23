---
title: 获取器
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|获取器
---


# 获取器


getter，获取器的作用是在获取数据的字段值后自动进行处理

```php
class UserModel extends AbstractModel
{
    /**
     * $value mixed 是原值
     * $data  array 是当前model所有的值 
     */
    protected function getIdAttr($value, $data)
    {
        // id = 1 管理员
        if ($value == 1){
            return '管理员';
        }
        return '普通账号';
    }
    
    protected function getStatusAttr($value)
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

::: warning 
数据表的字段会自动转换为驼峰法
:::
