## Container容器
Container容器可实现存储事件,变量等.
在EasySwoole中,pipe通信回调事件使用的就是继承Container容器的存储方式:
用法示例:
```php
<?php
$container = new \EasySwoole\Component\Container();
$container->set("OnOpen",function (){
    echo "onOpen事件回调";
});
$container->set("name",'仙士可');
var_dump($container->all());
call_user_func($container->get("OnOpen"));
$container->delete('name');
```
