---
title: Http service
meta:
  - name: description
    content: easyswoole,Http service
  - name: keywords
    content: easyswoole|Http service
---

# Http service

The http component is a component that is automatically enabled when `SERVER_TYPE` is `EASYSWOOLE_WEB_SERVER`. It implements the controller connection pool, url parsing, and url routing rules.
[http component demo] (https://github.com/easy-swoole/demo/tree/3.x-http)

## Namespaces
We first need to register the namespace of the application directory in `composer.json` (the controller namespace defaults to `App\HttpController`)
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
```
Then update the composer
````
Composer update
````

## Convention specification

- The class name and class file (folder) in the project are named, both are big hump, and the variable and class method are small hump.
- In the HTTP response, echo $var in the business logic code does not output the $var content to the corresponding content. Please call the wirte() method in the Response instance.

## Default controller
Create the `App/HttpController/Index.php` file:
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
Php easyswoole start
````
Access ip:9501, you can see the output "hello world";


