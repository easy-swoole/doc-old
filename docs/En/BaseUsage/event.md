---
title: Custom events
meta:
  - name: description
    content: EasySwoole Custom events
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole Custom events|swoole frame|EasySwoole
---

## Custom Events
In easyswoole, custom events can be implemented through the Container

## Add 'App/Event/Event.php' file
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
Register events in the initialize event of the framework:
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

Call anywhere else:
```php
Event::getInstance()->hook('test');
```
Can trigger events
