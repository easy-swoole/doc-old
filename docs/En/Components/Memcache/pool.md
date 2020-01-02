---
title: Memcache coroutine connection pool
meta:
  - name: description
    content: Memcache coroutine client, implemented by swoole coroutine client
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole memcache|Swoole Memcache coroutine client|Memcache connection pool
---
# Memcache connection pool example

## Install the easyswoole/pool component:

```shell
composer require easyswoole/pool
```

## Add MemcachePool Manager
New file`/App/Pool/MemcachePool.php`

```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/10/15 0015
 * Time: 14:46
 */

namespace App\Pool;

use EasySwoole\Memcache\Memcache;
use EasySwoole\Pool\Config;
use EasySwoole\Pool\AbstractPool;
use EasySwoole\Memcache\Config as MemcacheConfig;

class MemcachePool extends AbstractPool
{
    protected $memcacheConfig;

    /**
     * Override the constructor in order to pass in the memcache configuration
     * RedisPool constructor.
     * @param Config      $conf
     * @param MemcacheConfig $memcacheConfig
     * @throws \EasySwoole\Pool\Exception\Exception
     */
    public function __construct(Config $conf,MemcacheConfig $memcacheConfig)
    {
        parent::__construct($conf);
        $this->memcacheConfig = $memcacheConfig;
    }

    protected function createObject():Memcache
    {
        //New a memcache client based on the incoming memcache configuration
        $memcache = new Memcache($this->memcacheConfig);
        return $memcache;
    }
}
```
Register into the Manager (registered in the `initialize` event):
```php

$config = new \EasySwoole\Pool\Config();

$memcacheConfig1 = new \EasySwoole\Memcache\Config(Config::getInstance()->getConf('MEMCACHE1'));
\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\MemcachePool($config,$memcacheConfig1),'memcache1');

$memcacheConfig2 = new \EasySwoole\Memcache\Config(Config::getInstance()->getConf('MEMCACHE2'));
\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\MemcachePool($config,$memcacheConfig2),'memcache2');
    
```

Call (can be called globally in the controller):
```php
go(function (){
    $memcachePool1 = Manager::getInstance()->get('memcache1');
    $memcachePool2 = Manager::getInstance()->get('memcache2');
    $memcache1 = $memcachePool1->getObj();
    $memcache2 = $memcachePool2->getObj();
    
    var_dump($memcache1->set('name', 'Alan'));
    $this->response()->write($memcache1->get('name'));
    var_dump($memcache2->set('name', 'Allan'));
    $this->response()->write($memcache2->get('name'));
    
    //Recycling object
    $memcachePool1->recycleObj($memcache1);
    $memcachePool2->recycleObj($memcache2);
});
```

::: warning
For detailed usage, see [pool universal connection pool] (../Pool/introduction.md)
:::

::: warning
This article memcache connection pool is based on [pool universal connection pool] (../Pool/introduction.md)
:::
