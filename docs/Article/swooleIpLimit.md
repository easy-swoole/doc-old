---
title: swoole如何对ip限制访问频率
meta:
  - name: description
    content: swoole|swoole学习笔记|swoole Ip访问限制
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|swoole|swoole学习笔记|swoole Ip访问限制
---


# swoole如何对ip限制访问频率

在我们开发api的过程中，有的时候我们还需要考虑单个用户(ip)访问频率控制，避免被恶意调用。

归根到底也就只有两个步骤：

- 用户访问要统计次数
- 执行操作逻辑之前要判断次数频率是否过高，过高则不执行

## easyswoole中实现Ip访问频率限制

本文章举例的是在easyswoole框架中实现的代码，在swoole原生中实现方式是一样的。

只要在对应的回调事件做判断拦截处理即可。

- 使用swoole\Table，储存用户访问情况（也可以使用其他组件、方式储存）
- 使用定时器，将前一周期的访问情况清空，统计下一周期

如以下IpList类，实现了初始化Table、统计IP访问次数、获取一个周期内次数超过一定值的记录
```php
<?php
/**
 * Ip访问次数统计
 * User: Siam
 * Date: 2019/7/8 0008
 * Time: 下午 9:53
 */

namespace App;


use EasySwoole\Component\Singleton;
use EasySwoole\Component\TableManager;
use Swoole\Table;

class IpList
{
    use Singleton;

    /** @var Table */
    protected $table;

    public  function __construct()
    {
        TableManager::getInstance()->add('ipList', [
            'ip' => [
                'type' => Table::TYPE_STRING,
                'size' => 16
            ],
            'count' => [
                'type' => Table::TYPE_INT,
                'size' => 8
            ],
            'lastAccessTime' => [
                'type' => Table::TYPE_INT,
                'size' => 8
            ]
        ], 1024*128);
        $this->table = TableManager::getInstance()->get('ipList');
    }

    function access(string $ip):int
    {
        $key  = substr(md5($ip), 8,16);
        $info = $this->table->get($key);

        if ($info) {
            $this->table->set($key, [
                'lastAccessTime' => time(),
                'count'          => $info['count'] + 1,
            ]);
            return $info['count'] + 1;
        }else{
            $this->table->set($key, [
                'ip'             => $ip,
                'lastAccessTime' => time(),
                'count'          => $info['count'] + 1,
            ]);
            return 1;
        }
    }

    function clear()
    {
        foreach ($this->table as $key => $item){
            $this->table->del($key);
        }
    }

    function accessList($count = 10):array
    {
        $ret = [];
        foreach ($this->table as $key => $item){
            if ($item['count'] >= $count){
                $ret[] = $item;
            }
        }
        return $ret;
    }

}
```

封装完IP统计的操作之后

我们可以在`EasySwooleEvent.php`的mainServerCreate回调事件中初始化IpList和定时器

```php
<?php

public static function mainServerCreate(EventRegister $register)
{
    // 开启IP限流
    IpList::getInstance();
    $class = new class('IpAccessCount') extends AbstractProcess{
        protected function run($arg)
        {
            $this->addTick(5*1000, function (){
                /**
                 * 正常用户不会有一秒超过6次的api请求
                 * 做列表记录并清空
                 */
                $list = IpList::getInstance()->accessList(30);
                // var_dump($list);
                IpList::getInstance()->clear();
            });
        }
    };
}
```

接着我们在OnRequest回调中，判断和统计Ip的访问

```php
<?php

public static function onRequest(Request $request, Response $response): bool
{
    $fd = $request->getSwooleRequest()->fd;
    $ip = ServerManager::getInstance()->getSwooleServer()->getClientInfo($fd)['remote_ip'];
    
    // 如果当前周期的访问频率已经超过设置的值，则拦截
    // 测试的时候可以将30改小，比如3
    if (IpList::getInstance()->access($ip) > 30) {
        /**
         * 直接强制关闭连接
         */
        ServerManager::getInstance()->getSwooleServer()->close($fd);
        // 调试输出 可以做逻辑处理
        echo '被拦截'.PHP_EOL;
        return false;
    }
    // 调试输出 可以做逻辑处理
    echo '正常访问'.PHP_EOL;
}
```

以上就实现了对同一IP访问频率的限制操作。

具体还可以根据自身需求进行扩展，如对具体的某个接口再进行限流。

::: warning 
Easyswoole提供了一个基于Atomic计数器的限流器组件。可以直接使用，使用教程请移步查看限流器文档。
:::
