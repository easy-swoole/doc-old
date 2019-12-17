---
title: onReceive
meta:
  - name: description
    content: 当接收到客户端数据时,会触发此事件
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole|swoole|onReceive
---
## onReceive

主服务为SERVER时有效,当接收到客户端数据时,会触发此事件

###函数原型  
```php
public static function onReceive(\swoole_server $server, int $fd, int $reactor_id, string $data): void
{
}
```
