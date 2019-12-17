---
title: Redis coroutine client
meta:
  - name: description
    content: Redis coroutine client,Implemented by swoole coroutine client,Covers the method of redis 99%
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole redis| Swoole Redis coroutine client|swoole Redis|Redis coroutine
---
# Redis Connection Pool Example
## redis-pool component
The connection pool can be implemented by directly installing [redis-pool component] (../redisPool.md):

```shell
composer require easyswoole/redis-pool
```


## Install the easyswoole/pool component custom implementation:

```shell
composer require easyswoole/pool
```

## Add redisPool manager
Add file `/App/Pool/RedisPool.php`

```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/10/15 0015
 * Time: 14:46
 */

namespace App\Pool;

use EasySwoole\Pool\Config;
use EasySwoole\Pool\AbstractPool;
use EasySwoole\Redis\Config\RedisConfig;
use EasySwoole\Redis\Redis;

class RedisPool extends AbstractPool
{
    protected $redisConfig;

    /**
     * Override the constructor in order to pass in the redis configuration
     * RedisPool constructor.
     * @param Config      $conf
     * @param RedisConfig $redisConfig
     * @throws \EasySwoole\Pool\Exception\Exception
     */
    public function __construct(Config $conf,RedisConfig $redisConfig)
    {
        parent::__construct($conf);
        $this->redisConfig = $redisConfig;
    }

    protected function createObject()
    {
        //New redis based on the incoming redis configuration
        $redis = new Redis($this->redisConfig);
        return $redis;
    }
}
```
Register to the Manager:
```php
$config = new \EasySwoole\Pool\Config();

$redisConfig1 = new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS1'));

$redisConfig2 = new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS2'));

\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig1),'redis1');

\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig2),'redis2');

```

Call (can be called globally in the controller):
```php
go(function (){
   
    $redis1=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();
    $redis2=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();

    $redis1->set('name','Alan');
    var_dump($redis1->get('name'));

    $redis2->set('name','Allan');
    var_dump($redis2->get('name'));

    //Recycling object
    \EasySwoole\Pool\Manager::getInstance()->get('redis1')->recycleObj($redis1);
    \EasySwoole\Pool\Manager::getInstance()->get('redis2')->recycleObj($redis2);
});
```

::: warning
For detailed usage, see [pool universal connection pool] (../Pool/introduction.md)
:::

::: warning
This article redis connection pool is based on [pool universal connection pool] (../Pool/introduction.md)
:::
