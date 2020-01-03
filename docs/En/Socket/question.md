---
title: EasySwoole Socket
meta:
  - name: description
    content: EasySwoole Socket,swoole tcp, swoole websocket, swoole udp,php websocket
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole Socket|swoole tcp| swoole websocket| swoole udp|php websocket
---

## How to traverse all links
```php
use EasySwoole\EasySwoole\ServerManager;
$server = ServerManager::getInstance()->getSwooleServer();
$start_fd = 0;
while(true)
{
    $conn_list = $server->getClientList($start_fd, 10);
    if ($conn_list===false or count($conn_list) === 0)
    {
        echo "finish\n";
        break;
    }
    $start_fd = end($conn_list);
    var_dump($conn_list);
    foreach($conn_list as $fd)
    {
        $server->send($fd, "broadcast");
    }
}
```


::: warning 
 https://wiki.swoole.com/wiki/page/p-connection_list.html
:::

## How to get the link information

```php
Use EasySwoole\EasySwoole\ServerManager;
$server = ServerManager::getInstance()->getSwooleServer();
$fdinfo = $server->getClientInfo($fd);
```

::: warning
  Https://wiki.swoole.com/wiki/page/p-connection_info.html
:::

## What are the development scenarios for Socket?

### h5 instant game

### Web chat room

### IoT development

### Server udp broadcast

### Car Networking

### Smart Home

### web web server
