---
title: One-to-one association
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|One-to-one association
---


# One-to-one association

Define methods in the model

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

UserSettingModel is also a Model class, just defines a simple table structure

use
```php
$res = UserModel::create()->get(1);

/**
  * Association One-to-one
  */
Var_dump($res);

Var_dump($res->setting);
Var_dump($res->settingWhere);
// If the query is not available, it is null. The query is an instance of the UserSettingModel class. You can continue to call the ORM. Quick update Delete, etc.
```

