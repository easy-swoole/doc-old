<head>
     <title>EasySwoole Http service|swoole Http|swoole Api service</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Http service|swoole Http|swoole Api service"/>
     <meta name="description" content="EasySwoole Http service|swoole Http|swoole Api service"/>
</head>
---<head>---

# Http Server
When you set the `SERVER_TYPE` to `EASYSWOOLE_WEB_SERVER` in your basic configurations file (`dev` or `produce.php`), then your application will be running as a HTTP server.
In HTTP server mode, the following modules are out of box:
* Controllers pool
* URL parser
* URL routes rules

[HTTP component demo](https://github.com/easy-swoole/demo/tree/3.x-http)

## Namespace
We first need to register the namespace of the application directory in `composer.json`. By default, the controllers' namespace is `App\HttpController`.

````json
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
Please make sure all dependencies from the `composer.json` file have been updated by simply executing the following command:
````bash
composer update
````

## The default controller
Once you installed `EasySwoole` from work, the default controller would have created for you in `App/HttpController/Index.php`:
````php
<?php
namespace App\HttpController;
use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller{
    
    /**
     * This is the default action 
     */
    function index()
    {
        $this->response()->withHeader('Content-type', 'text/html;charset=utf-8');
        $this->response()->write('<div style="text-align: center;margin-top: 30px"><h2>欢迎使用EASYSWOOLE</h2></div></br>');
        $this->response()->write('<div style="text-align: center">您现在看到的页面是默认的 Index 控制器的输出</div></br>');
        $this->response()->write('<div style="text-align: center"><a href="https://www.easyswoole.com/Manual/2.x/Cn/_book/Base/http_controller.html">查看手册了解详细使用方法</a></div></br>');
        
        // Do something awesome from here ...
    }
}
````

Start your `EasySwoole` application:
````bash
php easyswoole start
````

Navigate your browser to `http://your-domain-or-ip:9501`, then you shall see the welcome messages, which means the HTTP request is led to the `index()` method in `Index.php`. Now you can start doing something awesome!

