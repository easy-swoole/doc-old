## 会话管理
在[http协议](../NetworkrPotocol/tcp/http.md)中,我们了解到了,http每次请求都是握手/挥手,第二次和第一次请求时没有任何关联的,属于无状态协议,那么问题来了,既然http是无状态协议,那服务器是怎么区分不同的用户的呢?,这就是会话了  

### 基础讲解
服务器能区分用户的原理主要就是在于会话,每次发起http请求时,都附加上一条身份识别数据,例如下面这个http请求头:   

```
GET / HTTP/1.1
Host: www.easyswoole.com
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 UBrowser/6.2.4094.1 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8 
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.8
Cookie: Hm_lvt_4c8d895ff3b25bddb6fa4185c8651cc3=1541986142,1542074627,1542158990,1542252497; Hm_lpvt_4c8d895ff3b25bddb6fa4185c8651cc3=1542252498
```
抛开http本身需要的数据,我们讲解下:
```
User-Agent: 用户端信息,浏览器的各种信息
Cookie: cookie会话
```
服务端可以通过User-Agent获得用户的浏览器信息,可以通过cookie获取自定义的信息  
所以我们可以:  
 * 用户A第一次进入,没有附带cookie
 * 服务端记录这个用户,响应头增加一个set_cookie:id=1的cookie
 * 浏览器获得响应头,解析到set_cookie动作,把id=1存进cookie
 * 第二次请求服务端,带上id=1的cookie,服务端就可以知道:这次请求时用户A请求的
 * 同理,用户B第一次进入,服务端响应set_cookie:id=2
 * ...
 
可以看出,只要用户端每次请求,跟服务端约定好一个参数作为用户标识,服务端就可以通过这个标识区分不同的用户了