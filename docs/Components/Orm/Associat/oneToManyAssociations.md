---
title: 一对多关联
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|一对多关联
---

# 一对多关联

在模型中定义方法

```php
public function orders()
{
    return $this->hasMany(OrdersModel::class, null, null, 'u_id');
}
```

OrdersModel 也是一个Model类，只是定义了一个简单的表结构

使用
```php
$res = UserModel::create()->get(1);

/**
 * 关联 一对多
 */
var_dump($res);
var_dump($res->orders); 
// 如果查询不到则为null  
// 查询得到则为一个数组，每一个子元素都是OrdersModel类的实例
```