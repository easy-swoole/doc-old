# http Server

http component module will be activated when `SERVER_TYPE` is set to`EASYSWOOLE_WEB_SERVER`, it implements
some very useful functions such as controller pool, url parser and url routes.

[http demo](https://github.com/easy-swoole/demo/tree/3.x-http)

## Namespace

First of all, you need to register the application namespace in `composer.json` file. (As the example below, 
the controllers namespace will be `App\HttpController`)

```json
{
    "require": {
        "easyswoole/easyswoole": "^3.1"
    },
    "autoload": {
        "psr-4": {
            "App\\": "App/"
        }
    }
}
````

Then update `Composer`
```bash
composer update
````

## Default application controller

Create `App/HttpController/Index.php` file in App/Controller folder
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/4/11 0011
 * Time: 14:40
 */

namespace App\HttpController;
use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller{
    function index()
    {
        $this->response()->write('hello world');
        // TODO: Implement index() method.
    }
}
```

Start `EasySwoole`:
```bash
php easyswoole start
````

Then visit http://your-host:9501 with your browser, you should see "hello world".