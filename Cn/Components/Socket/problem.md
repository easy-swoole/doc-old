## 如何遍历全部链接
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

## 如何获取链接信息

```php
use EasySwoole\EasySwoole\ServerManager;
$server = ServerManager::getInstance()->getSwooleServer();
$fdinfo = $server->getClientInfo($fd);
```
> https://wiki.swoole.com/wiki/page/p-connection_info.html

## Socket有哪些开发场景?

### h5即时游戏

### 网页聊天室

### 物联网开发

### 服务器udp广播

### 车联网

### 智能家居

### web网页服务器