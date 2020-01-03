---
title: redis协程客户端
meta:
  - name: description
    content: redis协程客户端,由swoole 协程client实现,覆盖了redis 99%的方法
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole redis| Swoole redis协程客户端|swoole Redis|redis协程
---
## 自定义命令
redis客户端提供了`rawCommand`方法以供使用自定义命令:  

```php
$data = $redis->rawCommand(['set','a','1']);
var_dump($data);
$data = $redis->rawCommand(['get','a']);
var_dump($data);
$redis->del('a');
```
rawCommand将返回一个`EasySwoole\Redis\Response`对象
```
object(EasySwoole\Redis\Response)#8 (4) {
  ["status":protected]=>
  int(0)
  ["data":protected]=>
  string(2) "OK"
  ["msg":protected]=>
  NULL
  ["errorType":protected]=>
  NULL
}
object(EasySwoole\Redis\Response)#9 (4) {
  ["status":protected]=>
  int(0)
  ["data":protected]=>
  string(1) "1"
  ["msg":protected]=>
  NULL
  ["errorType":protected]=>
  NULL
}
```
