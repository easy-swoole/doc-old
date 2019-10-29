---
title: 一对一关联
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|一对一关联
---


# 一对一关联

在模型中定义方法

```php
public function setting()
{
    return $this->hasOne(UserSettingModel::class);
}

public function settingWhere()
{
    return $this->hasOne(UserSettingModel::class, function(QueryBuilder $query){
        $query->where('u_id', $this->id);
        $query->where('status', 1);
        return $query;
    });
}
```

UserSettingModel 也是一个Model类，只是定义了一个简单的表结构

使用
```php
$res = UserModel::create()->get(1);

/**
 * 关联 一对一
 */
var_dump($res);

var_dump($res->setting); 
var_dump($res->settingWhere); 
// 如果查询不到则为null  查询得到则为一个UserSettingModel类的实例 可以继续调用ORM的方式 快速更新 删除等
```

