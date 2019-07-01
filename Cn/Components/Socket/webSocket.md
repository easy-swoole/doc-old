# WebSocket控制器

> 参考Demo: [WebSocketController](https://github.com/easy-swoole/demo/tree/3.x-websocketcontroller)

EasySwoole 3.x支持以控制器模式来开发你的代码。

首先，修改项目根目录下配置文件dev.php，修改SERVER_TYPE为:
```php
'SERVER_TYPE'    => EASYSWOOLE_WEB_SOCKET_SERVER,
```
并且引入 easyswoole/socket composer 包:
>  *composer require easyswoole/socket*
*警告：请保证你安装的 easyswoole/socket 版本大 >= 1.0.7 否则会导致ws消息发送客户端无法解析的问题*

## 新人帮助

* 本文遵循PSR-4自动加载类规范，如果你还不了解这个规范，请先学习相关规则。
* 本节基础命名空间App 默认指项目根目录下App文件夹，如果你的App指向不同，请自行替换。
* 只要遵循PSR-4规范，无论你怎么组织文件结构都没问题，本节只做简单示例。

## 实现命令解析

**新人提示**
> 这里的命令解析，其意思为根据请求信息解析为具体的执行命令;
>
> 在easyswoole中，可以让WebSocket像传统框架那样按照控制器->方法这样去解析请求;
>
> 需要实现EasySwoole\Socket\AbstractInterface\ParserInterface;接口中的decode 和encode方法;

**创建App/WebSocket/WebSocketParser.php文件，写入以下代码**

```php
namespace App\WebSocket;


use EasySwoole\Socket\AbstractInterface\ParserInterface;
use EasySwoole\Socket\Client\WebSocket;
use EasySwoole\Socket\Bean\Caller;
use EasySwoole\Socket\Bean\Response;

/**
 * Class WebSocketParser
 *
 * 此类是自定义的 websocket 消息解析器
 * 此处使用的设计是使用 json string 作为消息格式
 * 当客户端消息到达服务端时，会调用 decode 方法进行消息解析
 * 会将 websocket 消息 转成具体的 Class -> Action 调用 并且将参数注入
 *
 * @package App\WebSocket
 */
class WebSocketParser implements ParserInterface
{
    /**
     * decode
     * @param  string         $raw    客户端原始消息
     * @param  WebSocket      $client WebSocket Client 对象
     * @return Caller         Socket  调用对象
     */
    public function decode($raw, $client) : ? Caller
    {
        // 解析 客户端原始消息
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            echo "decode message error! \n";
            return null;
        }

        // new 调用者对象
        $caller =  new Caller();
        /**
         * 设置被调用的类 这里会将ws消息中的 class 参数解析为具体想访问的控制器
         * 如果更喜欢 event 方式 可以自定义 event 和具体的类的 map 即可
         * 注 目前 easyswoole 3.0.4 版本及以下 不支持直接传递 class string 可以通过这种方式
         */
        $class = '\\App\\WebSocket\\'. ucfirst($data['class'] ?? 'Index');
        $caller->setControllerClass($class);

        // 提供一个事件风格的写法
//         $eventMap = [
//             'index' => Index::class
//         ];
//         $caller->setControllerClass($eventMap[$data['class']] ?? Index::class);

        // 设置被调用的方法
        $caller->setAction($data['action'] ?? 'index');
        // 检查是否存在args
        if (!empty($data['content'])) {
            // content 无法解析为array 时 返回 content => string 格式
            $args = is_array($data['content']) ? $data['content'] : ['content' => $data['content']];
        }

        // 设置被调用的Args
        $caller->setArgs($args ?? []);
        return $caller;
    }
    /**
     * encode
     * @param  Response     $response Socket Response 对象
     * @param  WebSocket    $client   WebSocket Client 对象
     * @return string             发送给客户端的消息
     */
    public function encode(Response $response, $client) : ? string
    {
        /**
         * 这里返回响应给客户端的信息
         * 这里应当只做统一的encode操作 具体的状态等应当由 Controller处理
         */
        return $response->getMessage();
    }
}

```
> *注意，请按照你实际的规则实现，本测试代码与前端代码对应。*

## 注册服务

**新人提示**
> 如果你尚未明白easyswoole运行机制，那么这里你简单理解为，当easyswoole运行到一定时刻，会执行以下方法。
>
> 这里是指注册你上面实现的解析器。

**在根目录下EasySwooleEvent.php文件mainServerCreate方法下加入以下代码**

```php
//注意：在此文件引入以下命名空间
use EasySwoole\Socket\Dispatcher;
use App\WebSocket\WebSocketParser;

public static function mainServerCreate(EventRegister $register): void
{
    /**
     * **************** websocket控制器 **********************
     */
    // 创建一个 Dispatcher 配置
    $conf = new \EasySwoole\Socket\Config();
    // 设置 Dispatcher 为 WebSocket 模式
    $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
    // 设置解析器对象
    $conf->setParser(new WebSocketParser());
    // 创建 Dispatcher 对象 并注入 config 对象
    $dispatch = new Dispatcher($conf);
    // 给server 注册相关事件 在 WebSocket 模式下  on message 事件必须注册 并且交给 Dispatcher 对象处理
    $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
        $dispatch->dispatch($server, $frame->data, $frame);
    });
}
```

> 在EasySwooleEvent中注册该服务。

## 测试前端代码

**友情提示**
> easyswoole 提供了更强大的WebSocket调试工具，[foo]: http://easyswoole.com/wstool.html  'WEBSOCKET CLIENT'；

**创建App/HttpController/websocket.html文件，写入以下代码**

```html
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<div>
    <div>
        <p>info below</p>
        <ul  id="line">
         </ul>
    </div>
    <div>
        <select id="action">
            <option value="who">who</option>
            <option value="hello">hello</option>
            <option value="delay">delay</option>
            <option value="404">404</option>
        </select>
        <input type="text" id="says">
        <button onclick="say()">发送</button>
    </div>
</div>
</body>
<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script>
    var wsServer = 'ws://127.0.0.1:9501';
    var websocket = new WebSocket(wsServer);
    window.onload = function () {
        websocket.onopen = function (evt) {
            addLine("Connected to WebSocket server.");
        };
         websocket.onclose = function (evt) {
            addLine("Disconnected");
        };
         websocket.onmessage = function (evt) {
            addLine('Retrieved data from server: ' + evt.data);
        };
         websocket.onerror = function (evt, e) {
            addLine('Error occured: ' + evt.data);
        };
    };
    function addLine(data) {
        $("#line").append("<li>"+data+"</li>");
    }
    function say() {
        var content = $("#says").val();
        var action = $("#action").val();
        $("#says").val('');
        websocket.send(JSON.stringify({
            action:action,
            content:content
        }));
    }
</script>
</html>
```

## 测试用HttpController 视图控制器

**新人提示**
> 这里仅提供了前端基本的示例代码，更多需求根据自己业务逻辑设计

**创建App/HttpController/WebSocket.php文件，写入以下代码**

```php
namespace App\HttpController;

use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\EasySwoole\ServerManager;

/**
 * Class WebSocket
 *
 * 此类是通过 http 请求来调用具体的事件
 * 实际生产中需要自行管理 fd -> user 的关系映射，这里不做详细解释
 *
 * @package App\HttpController
 */
class WebSocket extends Controller
{
    /**
     * 默认的 websocket 测试页
     */
    public function index()
    {
        $content = file_get_contents(__DIR__ . '/websocket.html');
        $this->response()->write($content);
        $this->response()->end();
    }
}
```
> 本控制器主要为方便你获得前端页面和从HTTP请求中对websocket 做推送。

## WebSocket 控制器

**新人提示**
> WebSocket控制器必须继承EasySwoole\Socket\AbstractInterface\Controller;
>
> actionNotFound方法提供了当找不到该方法时的返回信息，默认会传入本次请求的actionName。

**创建App/WebSocket/Index.php文件，写入以下内容**

```php
namespace App\WebSocket;

use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\EasySwoole\Swoole\Task\TaskManager;
use EasySwoole\Socket\AbstractInterface\Controller;

/**
 * Class Index
 *
 * 此类是默认的 websocket 消息解析后访问的 控制器
 *
 * @package App\WebSocket
 */
class Index extends Controller
{
    function hello()
    {
        $this->response()->setMessage('call hello with arg:'. json_encode($this->caller()->getArgs()));
    }

    public function who(){
        $this->response()->setMessage('your fd is '. $this->caller()->getClient()->getFd());
    }

    function delay()
    {
        $this->response()->setMessage('this is delay action');
        $client = $this->caller()->getClient();

        // 异步推送, 这里直接 use fd也是可以的
        TaskManager::async(function () use ($client){
            $server = ServerManager::getInstance()->getSwooleServer();
            $i = 0;
            while ($i < 5) {
                sleep(1);
                $server->push($client->getFd(),'push in http at '. date('H:i:s'));
                $i++;
            }
        });
    }
}

```
##测试

*如果你按照本文配置，那么你的文件结构应该是以下形式*

App
├── HttpController
│   ├── websocket.html
│   └── WebSocket.php
├── Websocket
│   └── Index.php
└── └── WebSocketParser.php

> 首先在根目录运行easyswoole
>
> > *php easyswoole start*
>
> 如果没有错误此时已经启动了easyswoole服务;  
> 访问 127.0.0.1:9501/WebSocket/index 可以看到之前写的测试html文件;
> *新人提示：这种访问方式会请求HttpController控制器下Index.php中的index方法*  

##扩展

###自定义解析器

在上文的 WebSocketParser.php 中，已经实现了一个简单解析器；
我们可以通过自定义解析器，实现自己需要的场景。

```php
/**
 * decode
 * @param  string         $raw    客户端原始消息
 * @param  WebSocket      $client WebSocket Client 对象
 * @return Caller         Socket  调用对象
 */
public function decode($raw, $client) : ? Caller
{
    // 解析 客户端原始消息
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        echo "decode message error! \n";
        return null;
    }

    // new 调用者对象
    $caller =  new Caller();
    /**
     * 设置被调用的类 这里会将ws消息中的 class 参数解析为具体想访问的控制器
     * 如果更喜欢 event 方式 可以自定义 event 和具体的类的 map 即可
     * 注 目前 easyswoole 3.0.4 版本及以下 不支持直接传递 class string 可以通过这种方式
     */
    $class = '\\App\\WebSocket\\'. ucfirst($data['class'] ?? 'Index');
    $caller->setControllerClass($class);

    // 提供一个事件风格的写法
//         $eventMap = [
//             'index' => Index::class
//         ];
//         $caller->setControllerClass($eventMap[$data['class']] ?? Index::class);

    // 设置被调用的方法
    $caller->setAction($data['action'] ?? 'index');
    // 检查是否存在args
    if (!empty($data['content'])) {
        // content 无法解析为array 时 返回 content => string 格式
        $args = is_array($data['content']) ? $data['content'] : ['content' => $data['content']];
    }

    // 设置被调用的Args
    $caller->setArgs($args ?? []);
    return $caller;
}
/**
 * encode
 * @param  Response     $response Socket Response 对象
 * @param  WebSocket    $client   WebSocket Client 对象
 * @return string             发送给客户端的消息
 */
public function encode(Response $response, $client) : ? string
{
    /**
     * 这里返回响应给客户端的信息
     * 这里应当只做统一的encode操作 具体的状态等应当由 Controller处理
     */
    return $response->getMessage();
}
  ```
  > 例如{"class":"Index","action":"hello"}  
  > 则会访问App/WebSocket/WebSocket/Index.php 并执行hello方法

  **当然这里是举例，你可以根据自己的业务场景进行设计**

###自定义握手

在常见业务场景中，我们通常需要验证客户端的身份，所以可以通过自定义WebSocket握手规则来完成。

**创建App/WebSocket/WebSocketEvent.php文件，写入以下内容**  

```php
namespace App\WebSocket;

/**
 * Class WebSocketEvent
 *
 * 此类是 WebSocket 中一些非强制的自定义事件处理
 *
 * @package App\WebSocket
 */
class WebSocketEvent
{
    /**
     * 握手事件
     *
     * @param \swoole_http_request  $request
     * @param \swoole_http_response $response
     * @return bool
     */
    public function onHandShake(\swoole_http_request $request, \swoole_http_response $response)
    {
        /** 此处自定义握手规则 返回 false 时中止握手 */
        if (!$this->customHandShake($request, $response)) {
            $response->end();
            return false;
        }

        /** 此处是  RFC规范中的WebSocket握手验证过程 必须执行 否则无法正确握手 */
        if ($this->secWebsocketAccept($request, $response)) {
            $response->end();
            return true;
        }

        $response->end();
        return false;
    }

    /**
     * 自定义握手事件
     *
     * @param \swoole_http_request  $request
     * @param \swoole_http_response $response
     * @return bool
     */
    protected function customHandShake(\swoole_http_request $request, \swoole_http_response $response): bool
    {
        /**
         * 这里可以通过 http request 获取到相应的数据
         * 进行自定义验证后即可
         * (注) 浏览器中 JavaScript 并不支持自定义握手请求头 只能选择别的方式 如get参数
         */
        $headers = $request->header;
        $cookie = $request->cookie;

        // if (如果不满足我某些自定义的需求条件，返回false，握手失败) {
        //    return false;
        // }
        return true;
    }

    /**
     * RFC规范中的WebSocket握手验证过程
     * 以下内容必须强制使用
     *
     * @param \swoole_http_request  $request
     * @param \swoole_http_response $response
     * @return bool
     */
    protected function secWebsocketAccept(\swoole_http_request $request, \swoole_http_response $response): bool
    {
        // ws rfc 规范中约定的验证过程
        if (!isset($request->header['sec-websocket-key'])) {
            // 需要 Sec-WebSocket-Key 如果没有拒绝握手
            var_dump('shake fai1 3');
            return false;
        }
        if (0 === preg_match('#^[+/0-9A-Za-z]{21}[AQgw]==$#', $request->header['sec-websocket-key'])
            || 16 !== strlen(base64_decode($request->header['sec-websocket-key']))
        ) {
            //不接受握手
            var_dump('shake fai1 4');
            return false;
        }

        $key = base64_encode(sha1($request->header['sec-websocket-key'] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', true));
        $headers = array(
            'Upgrade'               => 'websocket',
            'Connection'            => 'Upgrade',
            'Sec-WebSocket-Accept'  => $key,
            'Sec-WebSocket-Version' => '13',
            'KeepAlive'             => 'off',
        );

        if (isset($request->header['sec-websocket-protocol'])) {
            $headers['Sec-WebSocket-Protocol'] = $request->header['sec-websocket-protocol'];
        }

        // 发送验证后的header
        foreach ($headers as $key => $val) {
            $response->header($key, $val);
        }

        // 接受握手 还需要101状态码以切换状态
        $response->status(101);
        var_dump('shake success at fd :' . $request->fd);
        return true;
    }
}
  ```


**在根目录下EasySwooleEvent.php文件mainServerCreate方法下加入以下代码**

```php
//注意：在此文件引入以下命名空间
use EasySwoole\Socket\Dispatcher;
use App\WebSocket\WebSocketParser;
use App\WebSocket\WebSocketEvent;

public static function mainServerCreate(EventRegister $register): void
{
    /**
       * **************** websocket控制器 **********************
       */
      // 创建一个 Dispatcher 配置
      $conf = new \EasySwoole\Socket\Config();
      // 设置 Dispatcher 为 WebSocket 模式
      $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
      // 设置解析器对象
      $conf->setParser(new WebSocketParser());
      // 创建 Dispatcher 对象 并注入 config 对象
      $dispatch = new Dispatcher($conf);

      // 给server 注册相关事件 在 WebSocket 模式下  on message 事件必须注册 并且交给 Dispatcher 对象处理
      $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
          $dispatch->dispatch($server, $frame->data, $frame);
      });

      //自定义握手事件
      $websocketEvent = new WebSocketEvent();
      $register->set(EventRegister::onHandShake, function (\swoole_http_request $request, \swoole_http_response $response) use ($websocketEvent) {
          $websocketEvent->onHandShake($request, $response);
      });
}
```

###自定义关闭事件

在常见业务场景中，我们通常需要在用户断开或者服务器主动断开连接时设置回调事件。

**创建App/WebSocket/WebSocketEvent.php文件，增加以下内容**  

```php
/**
 * 关闭事件
 *
 * @param \swoole_server $server
 * @param int            $fd
 * @param int            $reactorId
 */
public function onClose(\swoole_server $server, int $fd, int $reactorId)
{
    /** @var array $info */
    $info = $server->getClientInfo($fd);
    /**
     * 判断此fd 是否是一个有效的 websocket 连接
     * 参见 https://wiki.swoole.com/wiki/page/490.html
     */
    if ($info && $info['websocket_status'] === WEBSOCKET_STATUS_FRAME) {
        /**
         * 判断连接是否是 server 主动关闭
         * 参见 https://wiki.swoole.com/wiki/page/p-event/onClose.html
         */
        if ($reactorId < 0) {
            echo "server close \n";
        }
    }
}
```

**在根目录下EasySwooleEvent.php文件mainServerCreate方法下加入以下代码**

```php
/**
     * **************** websocket控制器 **********************
     */
    // 创建一个 Dispatcher 配置
    $conf = new \EasySwoole\Socket\Config();
    // 设置 Dispatcher 为 WebSocket 模式
    $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
    // 设置解析器对象
    $conf->setParser(new WebSocketParser());
    // 创建 Dispatcher 对象 并注入 config 对象
    $dispatch = new Dispatcher($conf);

    // 给server 注册相关事件 在 WebSocket 模式下  on message 事件必须注册 并且交给 Dispatcher 对象处理
    $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
        $dispatch->dispatch($server, $frame->data, $frame);
    });

    //自定义握手事件
    $websocketEvent = new WebSocketEvent();
    $register->set(EventRegister::onHandShake, function (\swoole_http_request $request, \swoole_http_response $response) use ($websocketEvent) {
        $websocketEvent->onHandShake($request, $response);
    });

    //自定义关闭事件
    $register->set(EventRegister::onClose, function (\swoole_server $server, int $fd, int $reactorId) use ($websocketEvent) {
        $websocketEvent->onClose($server, $fd, $reactorId);
    });
```

### 支持Wss

这里推荐使用Nginx反向代理解决wss问题。

即客户端通过wss协议连接 `Nginx` 然后 `Nginx` 通过ws协议和server通讯。
**也就是说Nginx负责通讯加解密，Nginx到server是明文的，swoole不用开启ssl，而且还能隐藏服务器端口和负载均衡(何乐不为)。**

```nginx
server {

    # 下面这个部分和你https的配置没有什么区别，如果你是 宝塔 或者是 oneinstack 这里用生成的也是没有任何问题的
    listen 443;
    server_name 这里是你申请的域名;

    ssl on;

    # 这里是你申请域名对应的证书(一定要注意路径的问题，建议绝对路径)
    ssl_certificate 你的证书.crt;
    ssl_certificate_key 你的密匙.key;

    ssl_session_timeout 5m;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 SSLv2 SSLv3;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;
    ssl_verify_client off;

    # 下面这个部分其实就是反向代理 如果你是 宝塔 或者是 oneinstack 请把你后续检查.php相关的 和重写index.php的部分删除
    location / {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:9501;      # 转发到你本地的9501端口 这里要根据你的业务情况填写 谢谢
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr:$remote_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;   # 升级协议头
        proxy_set_header Connection upgrade;
    }
}
```

重启nginx 如果没有错误
[点我打开ws调试工具](http://easyswoole.com/wstool.html);

**服务地址输入wss://你上面的域名不加端口号谢谢**

点击开启连接 恭喜你 wss成了
