---
title: 定义模型
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
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
    
}
```

## 数据表名称

需要在Model中定义 $tableName 属性，指定表名，否则将会产生错误`Table name is require for model`

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
      * @var string 
      */
     protected $tableName = 'user_shop';
}
```
