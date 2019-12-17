---
title: EasySwooleUniversal connection pool
meta:
  - name: description
    content: EasySwooleUniversal connection pool,Universal connection pool,easyswooleUniversal connection pool
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Universal connection pool|swoole Universal connection pool|Universal connection pool
---
## Universal connection pool

EasySwoole universal coroutine connection pool management.

## Installation
```php
composer require easyswoole/pool
```


## Base instance code
### Defining pool objects
```php
class Std implements \EasySwoole\Pool\ObjectInterface {
    function gc()
    {
        /*
         * When this object is unset by the pool
         */
    }

    function objectRestore()
    {
        /*
         * When returning to the connection pool
         */
    }

    function beforeUse(): ?bool
    {
        /*
         * When the connection pool is taken out, if false is returned, the current object is discarded for recycling.
         */
        return true;
    }

    public function who()
    {
        return spl_object_id($this);
    }
}
```
### Definition pool
```php

class StdPool extends \EasySwoole\Pool\AbstractPool{
    
    protected function createObject()
    {
        return new Std();
    }
}

```
> It is not necessary to create a return `EasySwoole\Pool\ObjectInterface` object, any type of object can

After the pool component version `> = 1.0.2`, the `Magic Pool` support is provided, and the definition pool can be quickly defined.

```php
use \EasySwoole\Pool\MagicPool;
$magic = new MagicPool(function (){
    return new \stdClass(); // For example, you can return an object that implements ObjectInterface
});

// Get after registration
$test = $magic->getObj();
// return
$magic->recycleObj($test);
```

The second parameter of the magic pool constructor can receive a config (EasySwoole\Pool\Config class) to define the number of pools and other configurations.


### Use
```php

$config = new \EasySwoole\Pool\Config();
$pool = new StdPool($config);

go(function ()use($pool){
    $obj = $pool->getObj();
    $obj2 = $pool->getObj();
    var_dump($obj->who());
    var_dump($obj2->who());
});
```
