---
title: memcache协程连接池
meta:
  - name: description
    content: memcache协程客户端,由swoole 协程client实现
  - name: keywords
    content:  EasySwoole memcache|Swoole memcache协程客户端|memcache连接池
---
# Memcache连接池示例

## 安装 easyswoole/pool 组件:

```shell
composer require easyswoole/pool
```

## 新增MemcachePool管理器
新增文件`/App/Pool/MemcachePool.php`

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
     * 重写构造函数,为了传入memcache配置
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
        //根据传入的memcache配置进行new 一个memcache客户端
        $memcache = new Memcache($this->memcacheConfig);
        return $memcache;
    }
}
```
注册到Manager中(在`initialize`事件中注册):
```php

$config = new \EasySwoole\Pool\Config();

$memcacheConfig1 = new \EasySwoole\Memcache\Config(Config::getInstance()->getConf('MEMCACHE1'));
\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\MemcachePool($config,$memcacheConfig1),'memcache1');

$memcacheConfig2 = new \EasySwoole\Memcache\Config(Config::getInstance()->getConf('MEMCACHE2'));
\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\MemcachePool($config,$memcacheConfig2),'memcache2');
    
```

调用(可在控制器中全局调用):
```php
go(function (){
    $memcachePool1 = Manager::getInstance()->get('memcache1');
    $memcachePool2 = Manager::getInstance()->get('memcache2');
    $memcache1 = $memcachePool1->getObj();
    $memcache2 = $memcachePool2->getObj();
    
    var_dump($memcache1->set('name', '仙士可1'));
    $this->response()->write($memcache1->get('name'));
    var_dump($memcache2->set('name', '仙士可2'));
    $this->response()->write($memcache2->get('name'));
    
    //回收对象
    $memcachePool1->recycleObj($memcache1);
    $memcachePool2->recycleObj($memcache2);
});
```

::: warning
详细用法可查看 [pool通用连接池](../Pool/introduction.md)
:::

::: warning
本文 memcache连接池 基于 [pool通用连接池](../Pool/introduction.md) 实现
:::