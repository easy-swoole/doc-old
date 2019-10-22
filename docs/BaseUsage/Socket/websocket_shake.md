
### 自定义握手

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

### 自定义关闭事件

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

