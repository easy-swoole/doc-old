---
title: 一对一关联
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|一对一关联
---


# 一对一关联

## 定义

例如，一个 User 模型可能关联一个 Relation 模型。

为了定义这个关联，我们要在 User 模型中写一个 relation 方法。在 relation 方法内部调用 hasOne 方法并返回其结果:

hasOne 方法的第一个参数是关联模型的类名。

```php
public function relation()
{
    return $this->hasOne(Relation::class);
}
```

模型关联方法允许你向关联加入自定义限制

```php
use EasySwoole\Mysqli\QueryBuilder;

public function settingWhere()
{
    return $this->hasOne(Relation::class, function(QueryBuilder $query){
        $query->where('u_id', $this->id);
        $query->where('status', 1);
        return $query;
    });
}
```

ORM 会自动基于关联模型的主键列进行关联。

在这种情况下，会自动使用 Relation id 主键。如果你想覆盖这个约定，可以传递第三个参数和第四个参数给 hasOne 方法：

第三个参数为当前模型的 `column`, 第四个参数为关联模型的对应 `column`

```php
public function settingWhere()
{
    return $this->hasOne(Relation::class, null, 'id', 'user_id');
}
```

## 使用

一旦定义了模型关联，我们就可以使用 ORM 动态属性获得相关的记录。动态属性允许你访问关系方法就像访问模型中定义的属性一样：

如果查询不到则为null  查询得到则为一个模型类的实例 可以继续调用ORM的方式 快速更新 删除等

```php
$res = User::create()->get(1);
$hasOneRelation = $res->relation; //访问实际是 relation 方法处理后的结果; 返回的是Relation模型对象

$userid = $hasOneRelation->user_id;
```
