# http服务
http组件是当`SERVER_TYPE`为`EASYSWOOLE_WEB_SERVER`自动启用的组件,它实现了控制器连接池,url解析以及url路由规则.  
[http组件demo](https://github.com/easy-swoole/demo/tree/3.x-http)
## 命名空间
我们首先需要在`composer.json`中注册应用目录的命名空间(控制器命名空间默认为`App\HttpController`)
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
然后更新一下composer
````
composer update
````

## 默认控制器
创建`App/HttpController/Index.php`文件:
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

启动easyswoole:
````
php easyswoole start
````
访问ip:9501,即可看到输出"hello world";


