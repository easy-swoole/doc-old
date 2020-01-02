---
title: Websocket custom handshake
meta:
  - name: description
    content: Websocket custom handshake
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

### Custom handshake

In a common business scenario, we usually need to verify the identity of the client, so it can be done by customizing the WebSocket handshake rule.

**Create an App/WebSocket/WebSocketEvent.php file and write the following**

```php
namespace App\WebSocket;

/**
 * Class WebSocketEvent
 *
 * This class is some non-mandatory custom event handling in WebSocket
 *
 * @package App\WebSocket
 */
class WebSocketEvent
{
    /**
     * Handshake event
     *
     * @param \swoole_http_request  $request
     * @param \swoole_http_response $response
     * @return bool
     */
    public function onHandShake(\swoole_http_request $request, \swoole_http_response $response)
    {
        /** Here the custom handshake rule returns false when the handshake is aborted */
        if (!$this->customHandShake($request, $response)) {
            $response->end();
            return false;
        }

        /** Here is the WebSocket handshake verification process in the RFC specification. It must be executed. Otherwise, the handshake cannot be performed correctly. */
        if ($this->secWebsocketAccept($request, $response)) {
            $response->end();
            return true;
        }

        $response->end();
        return false;
    }

    /**
     * Custom handshake event
     *
     * @param \swoole_http_request  $request
     * @param \swoole_http_response $response
     * @return bool
     */
    protected function customHandShake(\swoole_http_request $request, \swoole_http_response $response): bool
    {
        /**
         * Here you can get the corresponding data through http request
         * After custom verification
         * (Note) JavaScript does not support custom handshake request headers in the browser. You can only choose other methods such as get parameters.
         */
        $headers = $request->header;
        $cookie = $request->cookie;

        // if (If I don't meet some of my custom requirements, return false, the handshake fails.) {
        //    return false;
        // }
        return true;
    }

    /**
     * WebSocket handshake verification process in RFC specification
     * The following must be mandatory
     *
     * @param \swoole_http_request  $request
     * @param \swoole_http_response $response
     * @return bool
     */
    protected function secWebsocketAccept(\swoole_http_request $request, \swoole_http_response $response): bool
    {
        // The verification process agreed in the ws rfc specification
        if (!isset($request->header['sec-websocket-key'])) {
            // Requires Sec-WebSocket-Key if no handshake is refused
            var_dump('shake fai1 3');
            return false;
        }
        if (0 === preg_match('#^[+/0-9A-Za-z]{21}[AQgw]==$#', $request->header['sec-websocket-key'])
            || 16 !== strlen(base64_decode($request->header['sec-websocket-key']))
        ) {
            //Do not accept handshake
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

        // Send verified header
        foreach ($headers as $key => $val) {
            $response->header($key, $val);
        }

        // Accepting the handshake also requires a 101 status code to switch status
        $response->status(101);
        var_dump('shake success at fd :' . $request->fd);
        return true;
    }
}
```


** Add the following code under the mainServerCreate method of the EasySwooleEvent.php file in the root directory**

```php
//Note: Introduce the following namespace in this file
use EasySwoole\Socket\Dispatcher;
use App\WebSocket\WebSocketParser;
use App\WebSocket\WebSocketEvent;

public static function mainServerCreate(EventRegister $register): void
{
    /**
     * **************** Websocket controller **********************
     */
    // Create a Dispatcher configuration
    $conf = new \EasySwoole\Socket\Config();
    // Set Dispatcher to WebSocket mode
    $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
    // Set the parser object
    $conf->setParser(new WebSocketParser());
    // Create a Dispatcher object and inject the config object
    $dispatch = new Dispatcher($conf);
    
    // Register the relevant event for the server In the WebSocket mode, the on message event must be registered and passed to the Dispatcher object for processing.
    $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
        $dispatch->dispatch($server, $frame->data, $frame);
    });
    
    // Custom handshake event
    $websocketEvent = new WebSocketEvent();
    $register->set(EventRegister::onHandShake, function (\swoole_http_request $request, \swoole_http_response $response) use ($websocketEvent) {
        $websocketEvent->onHandShake($request, $response);
    });
}
```
### Custom Close Event

In a common business scenario, we usually need to set a callback event when the user disconnects or the server actively disconnects.

**Create the App/WebSocket/WebSocketEvent.php file and add the following**

```php
/**
 * Closing event
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
     * Determine if this fd is a valid websocket connection
     * See https://wiki.swoole.com/wiki/page/490.html
     */
    if ($info && $info['websocket_status'] === WEBSOCKET_STATUS_FRAME) {
        /**
         * Determine if the connection is server actively closed
         * see https://wiki.swoole.com/wiki/page/p-event/onClose.html
         */
        if ($reactorId < 0) {
            echo "server close \n";
        }
    }
}
```

** Add the following code under the mainServerCreate method of the EasySwooleEvent.php file in the root directory**

```php
    /**
     * **************** Websocket controller **********************
     */
    //Create a Dispatcher configuration
    $conf = new \EasySwoole\Socket\Config();
    // Set Dispatcher to WebSocket mode
    $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
    // Set the parser object
    $conf->setParser(new WebSocketParser());
    // Create a Dispatcher object and inject the config object
    $dispatch = new Dispatcher($conf);

    // Register the relevant event for the server In the WebSocket mode, the on message event must be registered and passed to the Dispatcher object for processing.
    $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
        $dispatch->dispatch($server, $frame->data, $frame);
    });

    //Custom handshake event
    $websocketEvent = new WebSocketEvent();
    $register->set(EventRegister::onHandShake, function (\swoole_http_request $request, \swoole_http_response $response) use ($websocketEvent) {
        $websocketEvent->onHandShake($request, $response);
    });

    //Custom close event
    $register->set(EventRegister::onClose, function (\swoole_server $server, int $fd, int $reactorId) use ($websocketEvent) {
        $websocketEvent->onClose($server, $fd, $reactorId);
    });
```

