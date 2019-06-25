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

> https://wiki.swoole.com/wiki/page/p-connection_list.html

## How to Get Link Information

```php
use EasySwoole\EasySwoole\ServerManager;
$server = ServerManager::getInstance()->getSwooleServer();
$fdinfo = $server->getClientInfo($fd);
```
> https://wiki.swoole.com/wiki/page/p-connection_info.html

## What development scenarios does Socket have?

### H5 Instant Game

### Web Chat Room

### Development of Internet of Things

### Server UDP broadcasting

### Vehicle Networking

### Smart Home

### Web page server