---
title: websocket协议
meta:
  - name: description
    content: websocket协议可以实现浏览器与服务端的互相通信协议
  - name: keywords
    content: websocket|websocket协议|聊天室|easyswoole websocket
---
# websocket
websocket是html5中提出的一个协议规范,它允许浏览器与服务器中相互主动通信.  

## http
在讲websocket之前,我们必须先了解http协议  
http协议是基于tcp实现的协议,它的请求步骤为: 
- 浏览器与服务器建立tcp协议
- 浏览器发送请求
- 服务端接收请求,回复消息
- 浏览器接收消息
- tcp连接关闭

http协议的特点就是即连即关,每次接收到消息就关闭连接,并且需要浏览器主动请求服务器才能获取到消息

## http痛点
在平常需求中,http协议并没有什么问题,用户输入链接,浏览器请求服务器,服务器返回数据,浏览器获得消息,用户查看网页.是一个很正常的步骤.  
但是,http协议限制了,用户获得数据必须主动去请求服务器,才能获取到数据,在聊天室,网页对战游戏中,并不是只有用户与服务器的交互,还存在了用户与用户之间的交互.  
那么,在websocket之前,http是怎么实现用户与用户之间的交互的呢?  
举个例子,在聊天室需求中,A和B互相通信的实现:  
- A不断的请求服务器,B有没有给我发送消息(主动请求服务器,询问有没有新消息)
- B不断的请求服务器,A有没有给我发送消息(主动请求服务器,询问有没有新消息)
- A请求服务器,发送数据:"向B发送一条消息XXXX"
- B不断的请求服务器,服务器返回:"A向你发送了一条消息"
- ...

在这个例子中,我们发现,A和B如果需要获取到对方是否有没有发送消息,必须不断的请求服务器,主动询问服务器是否有消息.   
那么,不断的间隔是多少呢?1秒10次?10秒一次?1秒10次不断的请求服务器,服务器能承受住吗?10秒一次?那A发送一条消息,B就得10秒后才能收到,消息延时太过于厉害.  
那么,有没有办法,使得服务器主动给浏览器发消息呢?这就是websocket了

## websocket 
websocket作为全双工通信协议,只要连接成功之后,浏览器和服务器就可以互相主动发送消息,那么,刚刚的聊天室需求就会变成:  
- A与服务器建立连接
- B与服务器建立连接
- A请求服务器,发送数据:"向B发送一条消息XXXX"
- 服务器接收到消息,主动向B推送:"A向你发送了一条消息"
- B收到服务器推送

websocket 的应用场景就是如此,在需要即时返回消息/频繁请求 的需求中,  
websocket协议可以长连接保持当前连接,不用像http一样每次请求都得重新发起一次消息.  
双方可以相互主动推送消息,消息可以即时送达,避免了消息延迟  

## websocket协议 
前面讲到了websocket的应用场景,那么为什么websocket可以做即时消息呢?那websocket为什么可以做即时消息,http却不能呢?  
websocket协议实现步骤为:  
- 先使用http协议连接服务端(没错,websocket是基于http协议的)
- 第一个步骤额外补充,在使用http协议时,附带了(我要升级websocket协议)的数据
- 服务端如果支持websocket,将会给客户端返回(升级成功),如果不支持,则会输出正常的http数据
- 客户端接收服务端返回的消息,如果支持,则连接保持,不支持则报错并断开
- 连接保持,这时候,客户端和服务端即可互相发消息  


::: warning
  websocket详细协议了解可查看: http://noobcourse.php20.cn/NoobCourse/NetworkrPotocol/tcp/websocket.html 
:::

## websocket示例 
### 前端示例
websocket代码该怎么写呢?以下是前端的简单例子实现:  
```javascript
//先new 一个websocket对象,地址是localhost+端口9501 ws是前面的协议声明,类似于http://xx.cn
var ws = new WebSocket("ws://localhost:9501");
//定义 打开事件 的回调,当连接ws成功后,会调用执行这个回调函数
ws.onopen = function() {
  console.log("client：打开连接");
  ws.send("client：hello，服务端");
};
//定义 服务器发送消息 的回调,当服务器主动发送消息到客户端时,会调用执行这个回调函数
ws.onmessage = function(e) {
  console.log("client：接收到服务端的消息 " + e.data);
  setTimeout(() => {
    ws.close();
  }, 5000);
};
//定义 关闭连接 的回调,当连接关闭(服务端关闭,客户端关闭,网络断开等原因),会调用执行这个回调函数 
ws.onclose = function(params) {
  console.log("client：关闭连接");
};
```

### php实现websocket服务端 
本文采用swoole扩展,实现websocket服务端:
```php
<?php
$server = new Swoole\WebSocket\Server("0.0.0.0", 9501);

$server->on('open', function (Swoole\WebSocket\Server $server, $request) {
    echo "握手成功 fd{$request->fd}\n";
});

$server->on('message', function (Swoole\WebSocket\Server $server, $frame) {
    echo "接收客户端消息: {$frame->fd}:{$frame->data},opcode:{$frame->opcode},fin:{$frame->finish}\n";
    $server->push($frame->fd, "this is server");
});

$server->on('close', function ($ser, $fd) {
    echo "客户端 {$fd} 关闭\n";
});
echo  "websocket服务器启动成功\n";

$server->start();
```

### 测试情况
php cli模式执行php代码,启动服务器
```
[root@localhost IM]# php websocket.php 
websocket服务器启动成功
```
在浏览器中运行js代码,将输出:   
```
client：打开连接
VM93:10 client：接收到服务端的消息 this is server
VM93:17 client：关闭连接
```
服务端将输出:   
```
[root@localhost IM]# php websocket.php 
websocket服务器启动成功
握手成功 fd1
接收客户端消息: 1:client：hello，服务端,opcode:1,fin:1
客户端 1 关闭
```   
