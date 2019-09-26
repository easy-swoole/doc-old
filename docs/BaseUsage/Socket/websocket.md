---
title: EasySwoole Socket
meta:
  - name: description
    content: php利用swoole，从而可以实现消息推送，和硬件消息交互
  - name: keywords
    content: EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

# WebSocket控制器


::: warning 
 参考Demo: [WebSocketController](https://github.com/easy-swoole/demo/tree/3.x-websocketcontroller)
:::

EasySwoole 3.x支持以控制器模式来开发你的代码。

首先，修改项目根目录下配置文件dev.php，修改SERVER_TYPE为:
```php
'SERVER_TYPE'    => EASYSWOOLE_WEB_SOCKET_SERVER,
```
并且引入 easyswoole/socket composer 包:

::: warning 
*composer require easyswoole/socket*
:::

*警告：请保证你安装的 easyswoole/socket 版本大 >= 1.0.7 否则会导致ws消息发送客户端无法解析的问题*

## 新人帮助

* 本文遵循PSR-4自动加载类规范，如果你还不了解这个规范，请先学习相关规则。
* 本节基础命名空间App 默认指项目根目录下App文件夹，如果你的App指向不同，请自行替换。
* 只要遵循PSR-4规范，无论你怎么组织文件结构都没问题，本节只做简单示例。

::: warning   
这里的命令解析，其意思为根据请求信息解析为具体的执行命令;
:::

::: warning 
在easyswoole中，可以让TCP、WebSocket像传统框架那样按照控制器->方法这样去解析请求; 
:::

::: danger
请先阅读TCP控制器实现章节，将以简明的文字讲述原理，以下代码较多，主要提供示例。
:::

::: warning 
解析器需要实现EasySwoole\Socket\AbstractInterface\ParserInterface 接口中的decode 和encode方法;
:::

## 实现命令解析


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

::: warning 
 *注意，请按照你实际的规则实现，本测试代码与前端代码对应。*
:::

## 注册服务

**新人提示**

::: warning 
如果你尚未明白easyswoole运行机制，那么这里你简单理解为，当easyswoole运行到一定时刻，会执行以下方法。
:::

::: warning 
 这里是指注册你上面实现的解析器。
:::

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


::: warning 
 在EasySwooleEvent中注册该服务。
:::

## 前端测试

**友情提示**

::: warning 
 easyswoole 提供了强大的WebSocket调试工具:[WEBSOCKET CLIEN](https://www.easyswoole.com/wstool.html)；
:::

## WebSocket 控制器

**新人提示**

::: warning 
WebSocket控制器必须继承EasySwoole\Socket\AbstractInterface\Controller;
:::

::: warning 
 actionNotFound方法提供了当找不到该方法时的返回信息，默认会传入本次请求的actionName。
:::

**创建App/WebSocket/Index.php文件，写入以下内容**

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
该控制器使用了task组件:https://www.easyswoole.com/Cn/Components/task.html
:::


::: warning 
composer require easyswoole/task
:::

##测试

*如果你按照本文配置，那么你的文件结构应该是以下形式*

```
App
├── HttpController
│   ├── websocket.html
│   └── WebSocket.php
├── Websocket
│   └── Index.php
└── └── WebSocketParser.php
```

首先在根目录运行easyswoole

```shell
php easyswoole start
```

如果没有错误此时已经启动了easyswoole服务;  
访问 127.0.0.1:9501/WebSocket/index 可以看到之前写的测试html文件;

::: warning
*新人提示：这种访问方式会请求HttpController控制器下Index.php中的index方法*  
:::

## 扩展

### 自定义解析器

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
    // $eventMap = [
    //     'index' => Index::class
    // ];
    // $caller->setControllerClass($eventMap[$data['class']] ?? Index::class);

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


::: warning 
例如{"class":"Index","action":"hello"}  
:::


::: warning 
 则会访问App/WebSocket/WebSocket/Index.php 并执行hello方法
:::

::: tip
 **当然这里是举例，你可以根据自己的业务场景进行设计**
:::