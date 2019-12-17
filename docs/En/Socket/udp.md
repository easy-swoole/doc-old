---
title: EasySwoole Socket
meta:
  - name: description
    content: Php uses swoole to enable message push and hardware message interaction
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

## udp application

### udp server is enabled, create sub-services in EasySwooleEvent.php

```php

public static function mainServerCreate(EventRegister $register)
{
    $server = ServerManager::getInstance()->getSwooleServer();
    $subPort = $server->addListener('0.0.0.0','9601',SWOOLE_UDP);
    $subPort->on('packet',function (\swoole_server $server, string $data, array $client_info){
        var_dump($data);
    });
}
```


### Udp client
```php

public static function mainServerCreate(EventRegister $register)
{
  //Add a custom process to do regular udp send
    $server->addProcess(new \swoole_process(function (\swoole_process $process){
        //Service is closed normally
        $process::signal(SIGTERM,function ()use($process){
            $process->exit(0);
        });
        //Broadcast by default 5 seconds
        \Swoole\Timer::tick(5000,function (){
            if($sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP))
            {
                socket_set_option($sock,SOL_SOCKET,SO_BROADCAST,true);
                $msg= '123456';
                socket_sendto($sock,$msg,strlen($msg),0,'255.255.255.255',9602);//Broadcast address
                socket_close($sock);
            }
        });
    }));
}
```



