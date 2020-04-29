---
title: EasySwoole Socket
meta:
  - name: description
    content: Php uses swoole to enable message push and hardware message interaction
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

# WebSocket controller


::: warning 
 Reference Demo: [WebSocketController](https://github.com/easy-swoole/demo/tree/3.x-websocketcontroller)
:::

EasySwoole 3.x supports developing your code in controller mode.

First, modify the configuration file dev.php in the root directory of the project, and modify the SERVER_TYPE to:
```php
'SERVER_TYPE' => EASYSWOOLE_WEB_SOCKET_SERVER,
```
And introduce the easyswoole/socket composer package:

::: warning
*composer require easyswoole/socket*
:::

*Warning: Please ensure that the version of easyswoole/socket you installed is large >= 1.0.7 Otherwise it will cause the problem that the ws message sending client cannot be resolved*

## Newcomer help

* This article follows the PSR-4 autoloading class specification. If you don't know the specification yet, please learn the rules first.
* The basic namespace app in this section defaults to the App folder in the project root directory. If your App points to a different location, please replace it yourself.
* As long as you follow the PSR-4 specification, no matter how you organize the file structure, this section is only a simple example.

::: warning
The command parsing here means that the request information is parsed into a specific execution command;
:::

::: warning
In easyswoole, TCP and WebSocket can be used to parse requests in the same way as the traditional framework in the controller->method;
:::

::: danger
Please read the TCP controller implementation chapter first, and the principle will be described in concise text. The following codes are more, mainly providing examples.
:::

::: warning
The parser needs to implement the decode and encode methods in the EasySwoole\Socket\AbstractInterface\ParserInterface interface;
:::

## Implement command parsing


**Create the App/WebSocket/WebSocketParser.php file and write the following code**

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
 * The design used here is to use json string as the message format
 * When the client message arrives at the server, the decode method is called for message parsing.
 * will convert the websocket message into a concrete Class -> Action call and inject the parameters
 *
 * @package App\WebSocket
 */
class WebSocketParser implements ParserInterface
{
    /**
     * decode
     * @param string $raw client raw message
     * @param WebSocket $client WebSocket Client object
     * @return Caller Socket call object
     */
    public function decode($raw, $client) : ? Caller
    {
        // Parse the client raw message
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            echo "decode message error! \n";
            return null;
        }

        // New caller object
        $caller =  new Caller();
        /**
         * Set the called class. This will resolve the class parameter in the ws message to the controller you want to access.
         * If you prefer the event method, you can customize the event and the map of the specific class.
         * Note Currently, easyswoole 3.0.4 and below does not support direct pass class string can be used this way
         */
        $class = '\\App\\WebSocket\\'. ucfirst($data['class'] ?? 'Index');
        $caller->setControllerClass($class);

        // Provide an event style
//         $eventMap = [
//             'index' => Index::class
//         ];
//         $caller->setControllerClass($eventMap[$data['class']] ?? Index::class);

        // Set the method to be called
        $caller->setAction($data['action'] ?? 'index');
        // Check for the presence of args
        if (!empty($data['content'])) {
            // Content cannot be resolved to array when returning content => string format
            $args = is_array($data['content']) ? $data['content'] : ['content' => $data['content']];
        }

        // Set the called Args
        $caller->setArgs($args ?? []);
        return $caller;
    }
    /**
     * encode
     * @param  Response     $response Socket Response Object
     * @param  WebSocket    $client   WebSocket Client Object
     * @return string             Message sent to the client
     */
    public function encode(Response $response, $client) : ? string
    {
        /**
         * This returns information that is sent to the client.
         * This should only be a unified encode operation. The specific state should be handled by the Controller.
         */
        return $response->getMessage();
    }
}

```

::: warning 
 *Note, please follow your actual rules, this test code corresponds to the front-end code. *
:::

## Registration service

**Newcomer tips**

::: warning 
If you don't understand the easyswoole operating mechanism, then you simply understand that when easyswoole runs to a certain moment, the following methods will be executed.
:::

::: warning 
 This refers to registering the parser you implemented above.
:::

**In the root directory, add the following code under the mainServerCreate method of the EasySwooleEvent.php file.**

```php
//Note: The following namespace is introduced in this file
use EasySwoole\Socket\Dispatcher;
use App\WebSocket\WebSocketParser;

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
}
```


::: warning 
 Register the service in EasySwooleEvent.
:::

## Front End Test

**friendly reminder**

::: warning
  Easyswoole provides a powerful WebSocket debugging tool: [WEBSOCKET CLIEN] (https://www.easyswoole.com/wstool.html);
:::

## WebSocket Controller

**Newcomer tips**

::: warning
The WebSocket controller must inherit EasySwoole\Socket\AbstractInterface\Controller;
:::

::: warning
  The actionNotFound method provides a return message when the method is not found. By default, the actionName of this request is passed.
:::

**Create an App/WebSocket/Index.php file and write the following**

```php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/1 0001
 * Time: 14:42
 */
namespace App\WebSocket;

use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\EasySwoole\Task\TaskManager;
use EasySwoole\Socket\AbstractInterface\Controller;

/**
 * Class Index
 *
 * This class is the default websocket message that is accessed after parsing the controller
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

        // Asynchronous push, here directly use fd is also possible
        TaskManager::getInstance()->async(function () use ($client){
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


::: warning 
The controller uses the task component: https://www.easyswoole.com/Cn/Components/task.html
:::


::: warning
Composer require easyswoole/task
:::

##test

* If you follow the configuration of this article, then your file structure should be in the following form*

```
App
├── HttpController
│   ├── websocket.html
│   └── WebSocket.php
├── Websocket
│   └── Index.php
└── └── WebSocketParser.php
```

First run easyswoole in the root directory

```shell
Php easyswoole start
```

If there is no error, the easyswoole service has been started at this time;
Visit 127.0.0.1:9501/WebSocket/index to see the test html file written before;

::: warning
* Newcomer Tip: This access method will request the index method in Index.php under the HttpController controller.
:::

## Extension

### Custom parser

In the above WebSocketParser.php, a simple parser has been implemented;
We can implement the scenario we need through a custom parser.

```php
/**
 * decode
 * @param string $raw client raw message
 * @param WebSocket $client WebSocket Client object
 * @return Caller Socket call object
 */
public function decode($raw, $client) : ? Caller
{
    // Parse the client raw message
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        echo "decode message error! \n";
        return null;
    }

    // new caller object
    $caller = new Caller();
    /**
     * Set the called class. This will resolve the class parameter in the ws message to the controller you want to access.
     * If you prefer the event method, you can customize the event and the map of the specific class.
     * Note Currently, easyswoole 3.0.4 and below does not support direct pass class string can be used this way
     */
    $class = '\\App\\WebSocket\\'. ucfirst($data['class'] ?? 'Index');
    $caller->setControllerClass($class);

    // Provide an event style
    // $eventMap = [
    //     'index' => Index::class
    // ];
    // $caller->setControllerClass($eventMap[$data['class']] ?? Index::class);

    // Set the method to be called
    $caller->setAction($data['action'] ?? 'index');
    // Check for the presence of args
    if (!empty($data['content'])) {
        // Content cannot be resolved to array when returning content => string format
        $args = is_array($data['content']) ? $data['content'] : ['content' => $data['content']];
    }

    // Set the called Args
    $caller->setArgs($args ?? []);
    return $caller;
}
/**
 * encode
 * @param  Response     $response Socket Response Object
 * @param  WebSocket    $client   WebSocket Client Object
 * @return string             Message sent to the client
 */
public function encode(Response $response, $client) : ? string
{
    /**
     * This returns information that is sent to the client.
     * Here should only do a unified encode operation. The specific state should be handled by the Controller.
     */
    return $response->getMessage();
}
```


::: warning 
 E.g: {"class":"Index","action":"hello"}  
:::


::: warning 
 Will access App/WebSocket/WebSocket/Index.php and execute the hello method
:::

::: tip
 **Of course, here is an example, you can design according to your own business scenario.**
:::
