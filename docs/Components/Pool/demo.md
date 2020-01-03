---
title: EasySwoole通用连接池
meta:
  - name: description
    content: EasySwoole通用连接池,协程连接池,easyswoole连接池
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|连接池|swoole 连接池|通用连接池
---

## Redis连接池示例

### 安装easyswoole/redis组件:

```shell
composer require easyswoole/redis
```

### 新增redisPool管理器
新增文件`/App/Pool/RedisPool.php`

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
     * 重写构造函数,为了传入redis配置
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
        //根据传入的redis配置进行new 一个redis
        $redis = new Redis($this->redisConfig);
        return $redis;
    }
}
```
注册到Manager中:
```php
$config = new \EasySwoole\Pool\Config();

$redisConfig1 = new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS1'));

$redisConfig2 = new \EasySwoole\Redis\Config\RedisConfig(\EasySwoole\EasySwoole\Config::getInstance()->getConf('REDIS2'));

\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig1),'redis1');

\EasySwoole\Pool\Manager::getInstance()->register(new \App\Pool\RedisPool($config,$redisConfig2),'redis2');

```

调用(可在控制器中全局调用):
```php
go(function (){
   
    $redis1=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();
    $redis2=\EasySwoole\Pool\Manager::getInstance()->get('redis1')->getObj();

    $redis1->set('name','仙士可');
    var_dump($redis1->get('name'));

    $redis2->set('name','仙士可2号');
    var_dump($redis2->get('name'));

    //回收对象
    \EasySwoole\Pool\Manager::getInstance()->get('redis1')->recycleObj($redis1);
    \EasySwoole\Pool\Manager::getInstance()->get('redis2')->recycleObj($redis2);
});
```
