---
title: WebSocket-Client
meta:
  - name: description
    content: EasySwoole Coroutine HTTPClient component
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Coroutine HTTPClient|websocket Client|Websocket client
---
# WebSocket-Client

## Request instance:
````php
<?php
$client = new \EasySwoole\HttpClient\HttpClient('127.0.0.1:9501');
$upgradeResult = $client->upgrade('cookie1', 'cook');
$frame = new \Swoole\WebSocket\Frame();
//Set the sent message frame
$frame->data = json_encode(['action' => 'hello','content'=>['a'=>1]]);
$pushResult = $client->push($frame);
$recvFrame = $client->recv();
//Will return bool or a message frame, you can judge
var_dump($recvFrame);
````

::: warning 
 Recv will only receive the server's message once, if you need to receive it all the time, please increase the while(1) infinite loop
:::

