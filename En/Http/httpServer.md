<head>
     <title>EasySwoole Http service|swoole Http|swoole Api service</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Http service|swoole Http|swoole Api service"/>
     <meta name="description" content="EasySwoole Http service|swoole Http|swoole Api service"/>
</head>
---<head>---

# Http server
The HTTP component is automatically enabled when `SERVER_TYPE'is `EASYSWOOLE_WEB_SERVER'. It implements the controller connection pool, URL parsing and URL routing rules.
[HTTP component demo](https://github.com/easy-swoole/demo/tree/3.x-http)
## Namespace
We first need to register the namespace of the application directory in `composer.json'(the controller namespace defaults to `App\HttpController')

````
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
Then update composer
````
composer update
````

## Default controller
Create `App/HttpController/Index.php` file:
````php
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
````

Start easyswoole:
````
php easyswoole start
````
Access ip: 9501, you can see the output "hello world";

