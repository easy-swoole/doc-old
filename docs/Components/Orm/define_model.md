---
title: 定义模型
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---

# 定义模型
定义一个模型基础的模型，只需要创建一个类，并且继承`EasySwoole\ORM\AbstractModel`即可

```php

<?php

namespace App\Models;

use EasySwoole\ORM\AbstractModel;

/**
 * 用户商品模型
 * Class UserShop
 */
class UserShop extends AbstractModel
{
    /**
     * 表名 当没有做定义的时候,自动将类名转为下划线格式作为表名
     * @var string 
     */
    protected $tableName = 'user_shop';
    
}
```