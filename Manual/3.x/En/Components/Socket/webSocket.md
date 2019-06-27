# WebSocket Controller

> Reference Demo: [WebSocketController](https://github.com/easy-swoole/demo/tree/3.x-websocketcontroller)

EasySwoole 3.x supports developing your code in controller mode.

First, modify the configuration file dev.php in the project root directory, and modify SERVER_TYPE as follows:
```php
'SERVER_TYPE'    => EASYSWOOLE_WEB_SOCKET_SERVER,
```
And introduce easyswoole/socket composer package

>  *composer require easyswoole/socket*
*Warning: Make sure that the easyswoole/socket version you installed is large >= 1.0.7 or it will cause problems that the WS message sending client cannot resolve*

## New Person Help

* This article follows the PSR-4 Automatic Loading Class Specification. If you don't understand this specification, please learn the relevant rules first.
* The base namespace App in this section defaults to the App folder in the project root directory. If your App points differently, replace it yourself.
* As long as you follow the PSR-4 specification, no matter how you organize the file structure, this section is just a simple example.

## Implementing command parsing

**New person tips**
> The command parsing here means that the request information is parsed into specific execution commands.
>
> In easyswoole, WebSocket can parse requests according to the controller->method, just like traditional frameworks.
>
> We need to implement EasySwoole\Socket\AbstractInterface\ParserInterface; decode and encode methods in the interface;

** Create the App/WebSocket/WebSocketParser.php file and write the following code **

```php
namespace App\WebSocket;


use EasySwoole\Socket\AbstractInterface\ParserInterface;
use EasySwoole\Socket\Client\WebSocket;
use EasySwoole\Socket\Bean\Caller;
use EasySwoole\Socket\Bean\Response;

/**
 * Class WebSocketParser
 *
 * This class is a custom websocket message parser
 * The design used here is to use JSON string as the message format
 * When the client message arrives at the server, the decode method is called to parse the message.
 * Converts websocket messages to specific Class - > Action calls and injects parameters
 *
 * @package App\WebSocket
 */
class WebSocketParser implements ParserInterface
{
    /**
     * decode
     * @param  string         $raw    Client raw message
     * @param  WebSocket      $client WebSocket Client object
     * @return Caller         Socket  Call object
     */
    public function decode($raw, $client) : ? Caller
    {
        // Parsing client raw message
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            echo "decode message error! \n";
            return null;
        }

        // New caller object
        $caller =  new Caller();
        /**
         * Setting the called class resolves the class parameter in the WS message to the controller that you want to access
         * If you prefer event mode, you can customize event and map of specific classes.
         * Note Current easyswoole version 3.0.4 and below does not support direct class string delivery.
         */
        $class = '\\App\\WebSocket\\'. ucfirst($data['class'] ?? 'Index');
        $caller->setControllerClass($class);

        // Provide an event-style description
//         $eventMap = [
//             'index' => Index::class
//         ];
//         $caller->setControllerClass($eventMap[$data['class']] ?? Index::class);

        // Setting the method to be invoked
        $caller->setAction($data['action'] ?? 'index');
        // Check for args
        if (isset($data['content']) && is_array($data['content'])) {
            $args = $data['content'];
        }

        // Setting the Args to be called
        $caller->setArgs($args ?? []);
        return $caller;
    }
    /**
     * encode
     * @param  Response     $response Socket Response object
     * @param  WebSocket    $client   WebSocket Client object
     * @return string             Message sent to client
     */
    public function encode(Response $response, $client) : ? string
    {
        /**
         * Here returns information that responds to the client
         * Here we should only do the unified encode operation, the specific state, etc. should be handled by Controller.
         */
        return $response->getMessage();
    }
}

```
> *Note that follow your actual rules. This test code corresponds to the front-end code.*

## Registration Service

**New person tips**
> If you haven't yet understood the mechanism of easyswoole, here you simply understand that when easyswoole runs to a certain point, the following methods will be performed.
>
> This means registering the parser you implemented above.

**Add the following code under the mainServerCreate method of the EasySwooleEvent.php file under the root directory**

```php
//Note: The following namespaces are introduced into this file
use EasySwoole\Socket\Dispatcher;
use App\WebSocket\WebSocketParser;

public static function mainServerCreate(EventRegister $register): void
{
    /**
     * **************** Websocket controller **********************
     */
    // Create a Dispatcher configuration
    $conf = new \EasySwoole\Socket\Config();
    //Set Dispatcher to WebSocket mode
    $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
    // Setting parser objects
    $conf->setParser(new WebSocketParser());
    // Create Dispatcher objects and inject config objects
    $dispatch = new Dispatcher($conf);
    // Register related events for server. In WebSocket mode, on message events must be registered and handed over to Dispatcher objects for processing.
    $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
        $dispatch->dispatch($server, $frame->data, $frame);
    });
}
```

> Register the service in EasySwooleEvent.

## Test front-end code

**Friendship Tips**
> Easyswoole provides a more powerful WebSocket debugging tool.[foo]: http://www.evalor.cn/websocket.html  'WEBSOCKET CLIENT'；

**Create the App/HttpController/websocket.html file and write the following code**

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
        <button onclick="say()">send</button>
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

## HttpController View Controller for Testing

**New person tips**
>Only the basic sample code of the front-end is provided here, and more requirements are designed according to their own business logic.

** Create the App/HttpController/WebSocket.php file and write the following code **

```php
namespace App\HttpController;

use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\EasySwoole\ServerManager;

/**
 * Class WebSocket
 *
 * This class invokes specific events through HTTP requests
 * The mapping of fd -> user relationship needs to be managed by oneself in actual production, which is not explained in detail here.
 *
 * @package App\HttpController
 */
class WebSocket extends Controller
{
    /**
     * Default websocket test page
     */
    public function index()
    {
        $content = file_get_contents(__DIR__ . '/websocket.html');
        $this->response()->write($content);
        $this->response()->end();
    }
}
```
> The main purpose of this controller is to facilitate your access to front-end pages and push websocket from HTTP requests.

## WebSocket controller

**New person tips**
> The websocket controller must inherit Easywoole\Socket\Abstractinterface\Controller；
>
> The actionNotFound method provides the return information when the method cannot be found, and by default the actionName of the request is passed in.

** Create the App/WebSocket/Index.php file and write it to the following **

```php
namespace App\WebSocket;

use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\EasySwoole\Swoole\Task\TaskManager;
use EasySwoole\Socket\AbstractInterface\Controller;

/**
 * Class Index
 *
 * This class is the default controller accessed after parsing websocket messages
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

        // Asynchronous push, where direct use fd is also possible
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
##Test

*If you follow the configuration in this article, then your file structure should be in the following form*

App
├── HttpController
│   ├── websocket.html
│   └── WebSocket.php
├── Websocket
│   └── Index.php
└── └── WebSocketParser.php

> First run easyswoole in the root directory
>
> > *php easyswoole start*
>
> If there are no errors, the easyswoole service has been started.
> Visit 127.0.0.1:9501/WebSocket/index to see the test HTML file written before.
> *New person tips: This access method will request index method in Index.php under HttpController controller*

##extend

###Custom parser

In WebSocketParser.php above, a simple parser has been implemented.
We can customize the parser to achieve the scenarios we need.

```php
/**
 * decode
 * @param  string         $raw    Client raw message
 * @param  WebSocket      $client WebSocket Client object
 * @return Caller         Socket  call object
 */
public function decode($raw, $client) : ? Caller
{
    // Parsing client raw message
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        echo "decode message error! \n";
        return null;
    }

    // new caller object
    $caller =  new Caller();
    /**
     * Setting the called class resolves the class parameter in the WS message to the controller that you want to access
     * If you prefer event mode, you can customize event and map of specific classes.
     * Note Current easyswoole version 3.0.4 and below does not support direct class string delivery.
     */
    $class = '\\App\\WebSocket\\'. ucfirst($data['class'] ?? 'Index');
    $caller->setControllerClass($class);

    // Provide an event-style description
//         $eventMap = [
//             'index' => Index::class
//         ];
//         $caller->setControllerClass($eventMap[$data['class']] ?? Index::class);

    // Setting the method to be invoked
    $caller->setAction($data['action'] ?? 'index');
    // Check for args
    if (isset($data['content']) && is_array($data['content'])) {
        $args = $data['content'];
    }

    // Setting the Args to be called
    $caller->setArgs($args ?? []);
    return $caller;
}
/**
 * encode
 * @param  Response     $response Socket Response object
 * @param  WebSocket    $client   WebSocket Client object
 * @return string             Message sent to client
 */
public function encode(Response $response, $client) : ? string
{
    /**
     * Here returns information that responds to the client
     * Here we should only do the unified encode operation, the specific state, etc. should be handled by Controller.
     */
    return $response->getMessage();
}
  ```
  > Example{"class":"Index","action":"hello"}  
  > Access App/WebSocket/WebSocket/Index.php and execute the Hello method

  **Here's an example, of course. You can design according to your business scenario.**

###Custom handshake

In common business scenarios, we usually need to verify the identity of the client, so we can do this by customizing the WebSocket handshake rule.

**Create App/WebSocket/WebSocketEvent.php file，Write the following**  

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
        /** This custom handshake rule stops handshake when it returns to false */
        if (!$this->customHandShake($request, $response)) {
            $response->end();
            return false;
        }

        /** Here is the WebSocket handshake validation process in the RFC specification that must be executed otherwise the handshake cannot be correctly handshake */
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
        * Here you can get the corresponding data through HTTP request
        * Custom validation is done
        * (Note) JavaScript in browsers does not support custom handshake request headers and can only choose other ways such as get parameters
         */
        $headers = $request->header;
        $cookie = $request->cookie;

        // if (If some of my custom requirements are not met, return false and the handshake fails) {
        //    return false;
        // }
        return true;
    }

    /**
     * WebSocket Handshake Verification Process in RFC Specification
     * The following must be enforced
     *
     * @param \swoole_http_request  $request
     * @param \swoole_http_response $response
     * @return bool
     */
    protected function secWebsocketAccept(\swoole_http_request $request, \swoole_http_response $response): bool
    {
        // Verification process agreed in WS RFC specification
        if (!isset($request->header['sec-websocket-key'])) {
            // Need Sec-WebSocket-Key if you don't refuse to shake hands
            var_dump('shake fai1 3');
            return false;
        }
        if (0 === preg_match('#^[+/0-9A-Za-z]{21}[AQgw]==$#', $request->header['sec-websocket-key'])
            || 16 !== strlen(base64_decode($request->header['sec-websocket-key']))
        ) {
            //Do not accept handshakes
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

        // Send an authenticated header
        foreach ($headers as $key => $val) {
            $response->header($key, $val);
        }

        // Accepting a handshake also requires 101 status codes to switch states
        $response->status(101);
        var_dump('shake success at fd :' . $request->fd);
        return true;
    }
}
  ```


**Add the following code under the main Server Create method of the EasySwooleEvent.php file under the root directory**

```php
//Note: The following namespaces are introduced into this file
use EasySwoole\Socket\Dispatcher;
use App\WebSocket\WebSocketParser;
use App\WebSocket\WebSocketEvent;

public static function mainServerCreate(EventRegister $register): void
{
    /**
       * **************** Websocket controller **********************
       */
      //Create a Dispatcher configuration
      $conf = new \EasySwoole\Socket\Config();
      //Set Dispatcher to WebSocket mode
      $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
      // Setting parser objects
      $conf->setParser(new WebSocketParser());
      // Create Dispatcher objects and inject config objects
      $dispatch = new Dispatcher($conf);

      //Register related events for server. In WebSocket mode, onMessage events must be registered and handed over to Dispatcher objects for processing.
      $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
          $dispatch->dispatch($server, $frame->data, $frame);
      });

      //Custom handshake event
      $websocketEvent = new WebSocketEvent();
      $register->set(EventRegister::onHandShake, function (\swoole_http_request $request, \swoole_http_response $response) use ($websocketEvent) {
          $websocketEvent->onHandShake($request, $response);
      });
}
```

###Custom Close Event

In common business scenarios, we usually need to set up callback events when the user disconnects or the server actively disconnects.

**Create the App/WebSocket/WebSocketEvent.php file and add the following**  

```php
/**
 * Closing events
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
     * Determine whether this fd is a valid websocket connection
     * See also https://wiki.swoole.com/wiki/page/490.html
     */
    if ($info && $info['websocket_status'] === WEBSOCKET_STATUS_FRAME) {
        /**
         * Determine whether the connection is actively closed by server
         * See also https://wiki.swoole.com/wiki/page/p-event/onClose.html
         */
        if ($reactorId < 0) {
            echo "server close \n";
        }
    }
}
```

**Add the following code under the mainServerCreate method of the EasySwooleEvent.php file under the root directory**

```php
/**
     * **************** Websocket controller **********************
     */
    // Create a Dispatcher configuration
    $conf = new \EasySwoole\Socket\Config();
    // Set Dispatcher to WebSocket mode
    $conf->setType(\EasySwoole\Socket\Config::WEB_SOCKET);
    // Setting parser objects
    $conf->setParser(new WebSocketParser());
    // Create Dispatcher objects and inject config objects
    $dispatch = new Dispatcher($conf);

    // Register related events for server. In WebSocket mode, onMessage events must be registered and handed over to Dispatcher objects for processing.
    $register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) use ($dispatch) {
        $dispatch->dispatch($server, $frame->data, $frame);
    });

    //Custom handshake event
    $websocketEvent = new WebSocketEvent();
    $register->set(EventRegister::onHandShake, function (\swoole_http_request $request, \swoole_http_response $response) use ($websocketEvent) {
        $websocketEvent->onHandShake($request, $response);
    });

    //Custom Close Event
    $register->set(EventRegister::onClose, function (\swoole_server $server, int $fd, int $reactorId) use ($websocketEvent) {
        $websocketEvent->onClose($server, $fd, $reactorId);
    });
```

### Support for Wss

It is recommended to use Nginx reverse proxy to solve WSS problem.

That is, the client connects `Nginx'through the WSS protocol and then `Nginx' communicates with server through the WS protocol.
** That is to say, Nginx is responsible for communication encryption and decryption, Nginx to server is plaintext, swoole does not need to open ssl, but also can hide server ports and load balancing (why not). * *

```nginx
server {

    # The following section is no different from your HTTPS configuration, and if you're a pagoda or one instack, there's no problem with generating it here.
    listen 443;
    server_name Here is the domain name you applied for.;

    ssl on;

    # Here is the certificate for your domain name (be sure to pay attention to the problem of path, recommend absolute path)
    ssl_certificate Your certificate.crt;
    ssl_certificate_key Your key.key;

    ssl_session_timeout 5m;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 SSLv2 SSLv3;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;
    ssl_verify_client off;

    # The following section is actually the reverse proxy. If you are a pagoda or one instack, please delete the sections related to .php and rewriting index.php.
    location / {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:9501;      # Forwarding to your local port 9501, please fill in here according to your business situation. Thank you.
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr:$remote_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;   # Upgrade protocol header
        proxy_set_header Connection upgrade;
    }
}
```

Restart nginx if there are no errors
[Click on me to open the WS debugging tool](http://easyswoole.com/wstool.html);

**Enter the service address into wss://the domain name above you without the port number, thank you.**

Click Open Connection Congratulations on WSS