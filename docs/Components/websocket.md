---
title: WebSocket-Client
meta:
  - name: description
    content: EasySwoole 协程HTTPClient组件
  - name: keywords
    content: easyswoole,WebSocket-Client
---
# WebSocket-Client

## 请求实例：
````php
<?php
$client = new \EasySwoole\HttpClient\HttpClient('127.0.0.1:9501');
$upgradeResult = $client->upgrade('cookie1', 'cook');
$frame = new \Swoole\WebSocket\Frame();
//设置发送的消息帧
$frame->data = json_encode(['action' => 'hello','content'=>['a'=>1]]);
$pushResult = $client->push($frame);
$recvFrame = $client->recv();
//将返回bool或一个消息帧，可自行判断
var_dump($recvFrame);
````

::: danger 
 recv只会接收一次服务器的消息，如果需要一直接收，请增加while(1)死循环
:::

