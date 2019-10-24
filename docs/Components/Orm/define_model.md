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
    
}
```

## 数据表名称

请注意，我们并没有告诉 ORM 我们的 `UserShop` 模型使用哪个数据表。
除非明确地指定了其它名称，否则将使用类的**下划线**形式来作为表名。

因此，在这种情况下，ORM 将假设 `UserShop` 模型存储的是 `user_shop` 数据表中的数据。
你可以通过在模型上定义 `tableName` 属性来指定自定义数据表名称：

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
      * 数据表名 当没有做定义的时候,自动将类名转为下划线格式作为表名
      * @var string 
      */
     protected $tableName = 'user_shop';
}
```