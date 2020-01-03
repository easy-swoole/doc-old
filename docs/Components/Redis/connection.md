---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## 连接方法
连接方法包括一些auth,echo,ping,类似的方法,列表如下:    



| 方法名称   | 参数      | 说明       | 备注 |
|:-----------|:----------|:----------|:----|
| connect    | $timeout  | 连接       |     |
| disconnect |           | 断开连接   |     |
| auth       | $password | auth认证   |     |
| echo       | $str      | echo      |     |
| ping       |           | ping      |     |
| select     | $db       | 选择数据库 |     |


## 实例
```php
go(function () {
    $redis = new \EasySwoole\Redis\Redis(new \EasySwoole\Redis\Config\RedisConfig([
        'host'      => '127.0.0.1',
        'port'      => '6379',
        'auth'      => 'easyswoole',
        'serialize' => \EasySwoole\Redis\Config\RedisConfig::SERIALIZE_NONE
    ]));
    $data = $redis->connect();
    var_dump($data);
    $data = $redis->auth('easyswoole');
    var_dump($data);
    $data = $redis->echo('test echo');
    var_dump($data);
    $data = $redis->ping();
    var_dump($data);
    $data = $redis->select(1);
    var_dump($data);
    $redis->disconnect();
});
```
