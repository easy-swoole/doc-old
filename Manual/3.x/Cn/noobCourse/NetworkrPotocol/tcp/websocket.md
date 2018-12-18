## WebSocket协议

WebSocket协议是基于TCP的一种新的网络协议。它实现了浏览器与服务器全双工(full-duplex)通信——允许服务器主动发送信息给客户端。


### 产生背景  
在没有WebSocket协议之前,在网页中,实现一个聊天室只能使用ajax 不断轮询,请求服务器是否有数据产生,而这样的实现方法会出现一系列的问题:  
 * 如果轮询时间间隔太短,会导致客户端和服务端在一个时间段内不断的进行http tcp的握手/挥手动作和http 请求头,响应头的传输,大量消耗服务器资源,如果用户量大的情况,会造成服务器的繁忙以至于宕机
 * 客户端每次只能通过发送http 请求获得服务器是否有数据返回,且数据的及时性无法保证
 
正因为在这种情况下,所以WebSocket出现了,它只需要一次http握手,就可以保持一个长连接,使得服务器可以主动发送消息给客户端,大大减少了轮询机制的消耗 
 
### 实现原理
 
 在实现websocket连线过程中，需要通过浏览器发出websocket连线请求，然后服务器发出回应，这个过程通常称为“握手” 。在 WebSocket API，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。在此WebSocket 协议中，为我们实现即时服务带来了两大好处：
  * Header: 互相沟通的Header是很小的-大概只有 2 Bytes
  * Server Push: 服务器的推送，服务器不再被动的接收到浏览器的请求之后才返回数据，而是在有新数据时就主动推送给浏览器。
  

### 握手协议
![websocket握手](websocket.jpg)  

首先,浏览器发起一个http协议的websocket握手请求:  
```
GET /websocket/HTTP/1.1

Host: localhost
Upgrade: websocket          #表示希望将http协议升级到Websocket协议。
Connection: Upgrade         #表示希望将http协议升级到Websocket协议。
Sec-WebSocket-Key: xqBt3ImNzJbYqRINxEFlkg==   #浏览器随机生成的base64 encode的值，用来询问服务器是否是支持WebSocket。
Origin: http://服务器地址
Sec-WebSocket-Version: 13
```

websocket服务器响应:  
```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket                #告诉浏览器已经升级到websocket
Connection: Upgrade               #告诉浏览器已经升级到websocket
Sec-WebSocket-Accept: K7DJLdLooIwIG/MOpvWFB3y3FE8=   #将请求包“Sec-WebSocket-Key”的值，与” 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 ″这个字符串进行拼接，然后对拼接后的字符串进行sha-1运算，再进行base64编码得到的。用来说明自己是WebSocket助理服务器。
```

这样就已经是握手成功了,浏览器和服务端已经建立了一个websocket通道,发送数据不再需要tcp握手,也不需要发送http请求头,服务端也可自动下发数据到浏览器

###HTML5 Web Socket API
在HTML5中内置有一些API，用于响应应用程序发起的请求。基本API语句如下：

```javascript
var ws = new WebSocket(url,name);//创建对象
ws.send(msg);//发送文本消息
ws.onmessage = (function(evt/*服务器发送数据的对象*/){})();//接收消息回调事件
ws.onerror = (function(evt/*错误对象*/){})();//错误处理
ws.close();//关闭连接
```

## 其他
可自行搜索了解详细内容





