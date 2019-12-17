---
title: EasySwoole universal connection pool
meta:
  - name: description
    content: EasySwoole universal connection pool,Coroutine connection pool, easyswoole connection pool
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|connection pool|swoole connection pool|universal connection pool
---
## Pool manager

The pool manager can do global connection pool management, for example, register in `initialize` in `EasySwooleEvent.php`, and then get the connection pool in the controller to get the connection:
```php
public static function initialize()
{
    // TODO: Implement initialize() method.
    date_default_timezone_set('Asia/Shanghai');

    $config = new \EasySwoole\Pool\Config();

    $redisConfig1 = new \EasySwoole\Redis\Config\RedisConfig(Config::getInstance()->getConf('REDIS1'));
    $redisConfig2 = new \EasySwoole\Redis\Config\RedisConfig(Config::getInstance()->getConf('REDIS2'));
    //Register connection pool management object
    \EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig1),'redis1');
    \EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig2),'redis2');

}
```

The controller gets the connection pool connection:
```php
public function index()
{
    //Take out the connection pool management object and getObj
   
    $redis1=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();
    $redis2=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();

    $redis1->set('name','Alan');
    var_dump($redis1->get('name'));

    $redis2->set('name','Allan');
    var_dump($redis2->get('name'));

    //Recycling object
    \EasySwoole\Pool\Manager::getInstance()->get('redis1')->recycleObj($redis1);
    \EasySwoole\Pool\Manager::getInstance()->get('redis2')->recycleObj($redis2);
}
```

