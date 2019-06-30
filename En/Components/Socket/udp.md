## UDP application

### The UDP server opens and creates services in EasySwooleEvent.php
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


### UDP client
```php

public static function mainServerCreate(EventRegister $register)
{
  //Add custom process to send timed UDP
    $server->addProcess(new \swoole_process(function (\swoole_process $process){
        //Normal shutdown of services
        $process::signal(SIGTERM,function ()use($process){
            $process->exit(0);
        });
        //Default 5 seconds broadcast once
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



