---
title: Defining model
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---

# Defining model
To define a model based model, just create a class and inherit `EasySwoole\ORM\AbstractModel`

```php

<?php

namespace App\Models;

use EasySwoole\ORM\AbstractModel;

/**
 * User product model
 * Class UserShop
 */
class UserShop extends AbstractModel
{
    
}
```

## Datasheet Name

需要在Model中定义 $tableName 属性，指定表名，否则将会产生错误`Table name is require for model`

```php

<?php

namespace App\Models;

use EasySwoole\ORM\AbstractModel;

/**
 * User product model
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
