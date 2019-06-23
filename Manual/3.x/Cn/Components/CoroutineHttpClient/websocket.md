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
> recv只会接收一次服务器的消息，如果需要一直接收，请增加while(1)死循环

