## Cookie
Cookie 是在 HTTP 协议下，服务器或脚本可以维护客户工作站上信息的一种方式。  

Cookie 是由 Web 服务器保存在用户浏览器（客户端）上的小文本文件，它可以包含有关用户的信息。无论何时用户链接到服务器，Web 站点都可以访问 Cookie 信息 。  

目前有些 Cookie 是临时的，有些则是持续的。临时的 Cookie 只在浏览器上保存一段规定的时间，一旦超过规定的时间，该 Cookie 就会被系统清除 。  

持续的 Cookie 则保存在用户的 Cookie 文件中，下一次用户返回时，仍然可以对它进行调用。在 Cookie 文件中保存 Cookie，有些用户担心 Cookie 中的用户信息被一些别有用心的人窃取，而造成一定的损害。其实，网站以外的用户无法跨过网站来获得 Cookie 信息。如果因为这种担心而屏蔽 Cookie，肯定会因此拒绝访问许多站点页面。因为，当今有许多 Web 站点开发人员使用 Cookie 技术，例如 Session 对象的使用就离不开 Cookie 的支持

### 存储  
cookie存储在用户端(通常是浏览器端),可通过JavaScript脚本,服务端response头进行设置/修改/删除操作  
一个cookie,存在以下信息:  
```
name   一个唯一确定的cookie名称,通常来讲cookie的名称是不区分大小写的。

value  存储在cookie中的字符串值。

domain  cookie对于哪个域是有效的。所有向该域发送的请求中都会包含这个cookie信息。这个值可以包含子域(如：
yq.aliyun.com)，也可以不包含它(如：.aliyun.com，则对于aliyun.com的所有子域都有效).

path   表示这个cookie影响到的路径，浏览器跟会根据这项配置，像指定域中匹配的路径发送cookie。

expires  失效时间，表示cookie何时应该被删除的时间戳(也就是，何时应该停止向服务器发送这个cookie)。如果不设置这个时间戳，浏览器会在页面关闭时即将删除所有cookie；不过也可以自己设置删除时间。这个值是GMT时间格式，如果客户端和服务器端时间不一致，使用expires就会存在偏差。

max-age 与expires作用相同，用来告诉浏览器此cookie多久过期（单位是秒），而不是一个固定的时间点。正常情况下，max-age的优先级高于expires。

HttpOnly  告知浏览器不允许通过脚本document.cookie去更改这个值，同样这个值在document.cookie中也不可见。但在http请求张仍然会携带这个cookie。注意这个值虽然在脚本中不可获取，但仍然在浏览器安装目录中以文件形式存在。这项设置通常在服务器端设置。

secure   安全标志，指定后，只有在使用SSL链接时候才能发送到服务器，如果是http链接则不会传递该信息。就算设置了secure 属性也并不代表他人不能看到你机器本地保存的 cookie 信息，所以不要把重要信息放cookie就对了服务器端设置
 ```
cookie不仅仅只作为session会话,也可存储一些不重要的会员个性化设置,例如:  
 * 用户A通过设置cookie type:red 
 * 用户A请求服务端,想获取一个页面
 * 服务端接收到请求,并解析到type:red,给用户A返回一个红色风格的首页 
 
### 安全  

#### 服务端安全  
首先,cookie是存储在用户端的,可以被用户修改,所以服务端不能直接通过一个cookie来确定用户身份,需要用一定的方式加密或者对等存储(cookie作为凭证,在服务端记录对应数据),服务端session就是使用这种方法存储的

#### 用户端安全
在通常情况下,用户端的cookie安全的,网站以外的用户无法跨过网站来获取用户的cookie信息,但是有心之人可能会通过ajax方法,让用户访问A网站,却使用B网站的脚本进行敏感操作.(详细内容可自行搜索"跨站点脚本攻击")

### phper中的cookie
在php  web网站中,用户端cookie是必不可少的,没有cookie就无法启用session会话,无法识别用户身份,php中的session_start()函数就是向用户端设置一个cookie值用于session会话.
