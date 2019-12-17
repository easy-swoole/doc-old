---
title: 自定义事件
meta:
  - name: description
    content: EasySwoole自定义事件
  - name: keywords
    content: Easyswoole 自定义事件|swoole 框架|swoole
---

## 自定义事件
easyswoole中,通过Container容器可实现自定义事件功能  

## 新增`App/Event/Event.php`文件
```php
<?php
namespace App\Event;

use EasySwoole\Component\Container;
use EasySwoole\Component\Singleton;

class Event extends Container
{
    use Singleton;
    function set($key, $item)
    {
        if (is_callable($item)){
            return parent::set($key, $item);
        }else{
            return false;
        }
    }

    function hook($event,...$arg){
        $call = $this->get($event);
        if (is_callable($call)){
            return call_user_func($call,...$arg);
        }else{
            return null;
        }
    }
}
```
在框架的initialize事件中进行注册事件:
```php
 public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
        \App\Event\Event::getInstance()->set('test', function () {
            echo 'test event';
        });
    }
```

在其他任意位置调用:
```php
Event::getInstance()->hook('test');
```
即可触发事件
