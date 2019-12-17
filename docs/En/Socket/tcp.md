---
title: EasySwoole Socket
meta:
  - name: description
    content: Php uses swoole to implement custom tcp protocol, which can implement message push and hardware message interaction.
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

# EasySwoole Tcp Service
Tcp service and tcp client demo

::: tip
https://github.com/easy-swoole/demo/tree/3.x-subtcp
::: 

## Create tcp service

There are two cases here.

- The project only provides a TCP server
- Open a TCP server on a separate port of the project

In the first case, we can declare the Swoole startup type as `EASYSWOOLE_SERVER` directly in the configuration file.

Then in the `EasySwooleEvent.php` framework event file `mainServerCreate` method, TCP related callback registration

```php
Public static function mainServerCreate(EventRegister $register)
{
     $register->add($register::onReceive, function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
         Echo "fd:{$fd} Send a message: {$data}\n";
     });
}
```

A separate port opens the TCP server and you need to add a subservice.

Subservice listening via the `mainServerCreate` event of the `EasySwooleEvent.php` file, for example:

````php
<?php
public static function mainServerCreate(EventRegister $register)
{
    $server = ServerManager::getInstance()->getSwooleServer();

    $subPort1 = $server->addlistener('0.0.0.0', 9502, SWOOLE_TCP);
    $subPort1->set(
        [
            'open_length_check' => false, //Do not verify the packet
        ]
    );
    $subPort1->on('connect', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "fd:{$fd} connected\n";
        $str = 'Congratulations on your successful connection';
        $server->send($fd, $str);
    });
    $subPort1->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "fd:{$fd} closed\n";
    });
    $subPort1->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "fd:{$fd} Send a message:{$data}\n";
    });
}
````

## tcpController Implementation

In TCP, how do we implement the same route as an Http request to distribute the request to different controllers.

EasySwoole provides a solution for a solution. (not mandatory, can be extended and modified to meet the needs of the business)

### Installation

Introducing the socket package:

```
Composer require easyswoole/socket
```

::: danger
Warning: Please ensure that the version of easyswoole/socket you installed is large >= 1.0.7. Otherwise, the problem that the ws message sending client cannot be resolved will be caused.
:::

### Protocol Rules and Resolution

In this example, the json data is transferred using pack N for binary processing. The json data has three parameters, for example:

````json
{"controller":"Index","action":"index","param":{"name":"\u4ed9\u58eb\u53ef"}}
````

We will forward the data to the `parser in the `onReceive` message receiving callback.

The parser will press the json field, similar to the following to initialize and execute the request.

```php
$bean->setControllerClass($controller);
$bean->setAction($action);
$bean->setArgs($param);
```

The TCP controller needs to inherit the `EasySwoole\Socket\AbstractInterface\Controller` class.

Others will generally be written as a normal controller! You can post Task tasks in the controller, forward them to other clients, go offline, etc...

::: tip
You can see the complete implementation and code in the github demo (copy it and use it in your project)
:::

### Implement the parser [Parser.php] (https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Parser.php)

### Parser Takeover Service [EasySwooleEvent.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/EasySwooleEvent.php)

### Implement Controller [Index.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Index.php)

Get parameters
```php
Public function args()
{
     $this->response()->setMessage('your args is:'.json_encode($this->caller()->getArgs()).PHP_EOL);
}
```

Reply data
```php
Public function index(){
     $this->response()->setMessage(time());
}
```

Get the current fd
```php
Public function who()
{
     $this->caller()->getClient()->getFd()
}
```

## HTTP to TCP push

In the HTTP controller, the Swoole instance can be obtained through the ServerManager and then sent to the specified FD client content.

```php
Function method(){
    // pass the reference fd
    $fd = intval($this->request()->getRequestParam('fd'));

    // Take the connection information through the Swoole instance
    $info = ServerManager::getInstance()->getSwooleServer()->connection_info($fd);

    If(is_array($info)){
        ServerManager::getInstance()->getSwooleServer()->send($fd,'push in http at '.time());
    }else{
        $this->response()->write("fd {$fd} not exist");
    }
}
```

::: warning
In actual production, it is usually after the user TCP connection comes up, do the verification, and then in the format of userName=>fd, there is redis, need http, or other places,
:::

For example, when the timer pushes to a connection, it is to use the userName to get the corresponding fd in redis, and then send. Note that the child server created by the addServer form,

::: warning
To register your own network event completely, you can register the onclose event and then delete the userName=>fd when the connection is broken.
:::
