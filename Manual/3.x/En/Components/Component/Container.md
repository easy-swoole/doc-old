## Container容器
Container containers can store events, variables, etc. In EasySwoole, pipe communication callback events use the way Container containers are inherited: examples of usage:
```php
<?php
$container = new \EasySwoole\Component\Container();
$container->set("OnOpen",function (){
    echo "onOpen event callbacks";
});
$container->set("name",'huizhang');
var_dump($container->all());
call_user_func($container->get("OnOpen"));
$container->delete('name');
```
