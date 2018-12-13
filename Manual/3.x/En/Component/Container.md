## Container
Container can store event callback and variables...
In EasySwoole, pipe event callbacks are stored in container:
Example:
```php
<?php
$container = new \EasySwoole\Component\Container();
$container->set("OnOpen",function (){
    echo "onOpen event callback";
});
$container->set("name",'tom');
var_dump($container->all());
call_user_func($container->get("OnOpen"));
$container->delete('name');
```
