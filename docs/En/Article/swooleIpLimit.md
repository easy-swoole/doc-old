---
title: How does swoole limit access frequency to ip
meta:
  - name: description
    content: Swoole|swoole study notes|swoole Ip access restrictions
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|swoole|swoole study notes|swoole Ip access restrictions
---


# How does swoole limit access frequency to ip

In the process of developing our api, sometimes we also need to consider the single user (ip) access frequency control to avoid being maliciously called.

In the final analysis, there are only two steps:

- User access statistics
- Before executing the operation logic, determine whether the frequency is too high. If it is too high, it will not be executed.

## Ip access frequency limit in easyswoole

This article is an example of the code implemented in the easyswoole framework, which is implemented the same way in swoole native.

Just make a judgment interception process in the corresponding callback event.

- Use swoole\Table to store user access (can also be stored using other components and methods)
- Use the timer to clear the access situation of the previous cycle and count the next cycle.

For example, the following IpList class implements initialization of the Table, counts the number of IP accesses, and obtains records whose number of times exceeds a certain value within a period.
```php
<?php
/**
 * Ip visit statistics
 * User: Siam
 * Date: 2019/7/8 0008
 * Time: 9:53 PM
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

After the operation of encapsulating the IP statistics

We can initialize IpList and timer in the mainServerCreate callback event of `EasySwooleEvent.php`

```php
<?php

public static function mainServerCreate(EventRegister $register)
{
    // Enable IP current limit
    IpList::getInstance();
    $class = new class('IpAccessCount') extends AbstractProcess{
        protected function run($arg)
        {
            $this->addTick(5*1000, function (){
                /**
                 * Normal users won't have api requests more than 6 times a second.
                 * Do list recording and empty
                 */
                $list = IpList::getInstance()->accessList(30);
                // var_dump($list);
                IpList::getInstance()->clear();
            });
        }
    };
}
```

Then we judge and count the access of Ip in the OnRequest callback.

```php
<?php

public static function onRequest(Request $request, Response $response): bool
{
    $fd = $request->getSwooleRequest()->fd;
    $ip = ServerManager::getInstance()->getSwooleServer()->getClientInfo($fd)['remote_ip'];
    
    // Intercept if the access frequency of the current period has exceeded the set value
    // When testing, you can change 30, such as 3
    if (IpList::getInstance()->access($ip) > 30) {
        /**
         * Directly forcibly close the connection
         */
        ServerManager::getInstance()->getSwooleServer()->close($fd);
        // Debug output can be logically processed
        echo 'Blocked'.PHP_EOL;
        return false;
    }
    // Debug output can do logic processing
    echo 'Normal access'.PHP_EOL;
}
```

The above implements the restriction operation on the same IP access frequency.

Specifically, it can be extended according to its own needs, such as limiting traffic to a specific interface.

::: warning 
Easyswoole provides a current limiter component based on the Atomic counter. Can be used directly, use the tutorial, please step to view the flow restrictor documentation.
:::
