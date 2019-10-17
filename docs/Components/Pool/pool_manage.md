---
title: EasySwoole通用连接池
meta:
  - name: description
    content: EasySwoole通用连接池,协程连接池,easyswoole连接池
  - name: keywords
    content: easyswoole的通用连接池
---

## 池管理器

池管理器可以做全局的连接池管理,例如在`EasySwooleEvent.php`中的`initialize`中注册,然后可以在控制器中获取连接池进行获取连接:
```php
public static function initialize()
{
    // TODO: Implement initialize() method.
    date_default_timezone_set('Asia/Shanghai');

    $config = new \EasySwoole\Pool\Config();

    $redisConfig1 = new \EasySwoole\Redis\Config\RedisConfig(Config::getInstance()->getConf('REDIS1'));
    $redisConfig2 = new \EasySwoole\Redis\Config\RedisConfig(Config::getInstance()->getConf('REDIS2'));
    //注册连接池管理对象
    \EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig1),'redis1');
    \EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig2),'redis2');

}
```

控制器获取连接池连接:
```php
public function index()
{
    //取出连接池管理对象,并getObj
   
    $redis1=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();
    $redis2=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();

    $redis1->set('name','仙士可');
    var_dump($redis1->get('name'));

    $redis2->set('name','仙士可2号');
    var_dump($redis2->get('name'));

    //回收对象
    \EasySwoole\Pool\Manager::getInstance()->get('redis1')->recycleObj($redis1);
    \EasySwoole\Pool\Manager::getInstance()->get('redis2')->recycleObj($redis2);
}
```

