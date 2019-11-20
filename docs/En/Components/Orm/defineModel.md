---
title: Defining model
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
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

Please note that we did not tell ORM which data table our 'UserShop` model uses.
The class's **underscore** form is used as the table name unless other names are explicitly specified.

Therefore, in this case, the ORM will assume that the `UserShop` model stores the data in the `user_shop` data table.
You can specify a custom data table name by defining the `tableName` attribute on the model:

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
      * Data table name When the definition is not made, the class name is automatically converted to the underline format as the table name.
      * @var string 
      */
     protected $tableName = 'user_shop';
}
```