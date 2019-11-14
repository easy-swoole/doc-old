---
title: EasySwoole Socket
meta:
  - name: description
    content: php利用swoole实现自定义tcp协议，从而可以实现消息推送，和硬件消息交互
  - name: keywords
    content: EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

# EasySwoole Tcp服务
tcp 服务以及tcp客户端 demo

::: tip
https://github.com/easy-swoole/demo/tree/3.x-subtcp
::: 

## 创建tcp服务

这里分为两种情况

- 项目只提供TCP服务器
- 项目单独一个端口开启TCP服务器

如果是第一种情况，我们可以直接在配置文件中，将Swoole的启动类型声明为`EASYSWOOLE_SERVER`。

然后在`EasySwooleEvent.php`框架事件文件中`mainServerCreate`方法，进行TCP相关的回调注册

```php
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onReceive, function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "fd:{$fd} 发送消息:{$data}\n";
    });
}
```

单独端口开启TCP服务器，需要添加子服务。

通过`EasySwooleEvent.php`文件的`mainServerCreate` 事件,进行子服务监听,例如:

````php
<?php
public static function mainServerCreate(EventRegister $register)
{
    $server = ServerManager::getInstance()->getSwooleServer();

    $subPort1 = $server->addlistener('0.0.0.0', 9502, SWOOLE_TCP);
    $subPort1->set(
        [
            'open_length_check' => false, //不验证数据包
        ]
    );
    $subPort1->on('connect', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "fd:{$fd} 已连接\n";
        $str = '恭喜你连接成功';
        $server->send($fd, $str);
    });
    $subPort1->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "fd:{$fd} 已关闭\n";
    });
    $subPort1->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "fd:{$fd} 发送消息:{$data}\n";
    });
}
````

## tcp控制器实现

在TCP中，我们如何实现像Http请求一样的路由，从而将请求分发到不同的控制器。

EasySwoole提供了一个解析的方案参考。（非强制，可自行扩展修改为符合业务所需）

### Installation

引入 socket 包:

```
composer require easyswoole/socket
```

::: danger
警告：请保证你安装的 easyswoole/socket 版本大 >= 1.0.7 否则会导致ws消息发送客户端无法解析的问题
:::

### 协议规则与解析

在本实例中,传输json数据 使用pack N进行二进制处理,json数据有3个参数,例如:

````json
{"controller":"Index","action":"index","param":{"name":"\u4ed9\u58eb\u53ef"}}
````

我们将在`onReceive`消息接收回调中，将数据转发给`解析器`

解析器将按json字段，类似下面去初始化并执行请求。

```php
$bean->setControllerClass($controller);
$bean->setAction($action);
$bean->setArgs($param);
```

TCP控制器需要继承`EasySwoole\Socket\AbstractInterface\Controller`类

其他的一般将按普通控制器一样去编写即可！ 可以在控制器中投递Task任务、转发给其他客户端、客户端下线等等...

::: tip
可以在github的demo中看到完整的实现和代码（复制下来即可在项目中使用）
:::

### 实现解析器[Parser.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Parser.php)

### 解析器接管服务 [EasySwooleEvent.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/EasySwooleEvent.php)

### 实现控制器[Index.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Index.php)

获取参数
```php
public function args()
{
    $this->response()->setMessage('your args is:'.json_encode($this->caller()->getArgs()).PHP_EOL);
}
```

回复数据
```php
public function index(){
    $this->response()->setMessage(time());
}
```

获取当前fd
```php
public function who()
{
    $this->caller()->getClient()->getFd()
}
```

## HTTP往TCP推送

在HTTP控制器，可以通过ServerManager获取Swoole实例，然后发送给指定FD客户端内容。

```php
function method(){
    // 传参fd
    $fd = intval($this->request()->getRequestParam('fd'));

    // 通过Swoole实例拿连接信息
    $info = ServerManager::getInstance()->getSwooleServer()->connection_info($fd);

    if(is_array($info)){
        ServerManager::getInstance()->getSwooleServer()->send($fd,'push in http at '.time());
    }else{
        $this->response()->write("fd {$fd} not exist");
    }
}
```

::: warning 
实际生产中，一般是用户TCP连接上来后，做验证，然后以userName=>fd的格式，存在redis中，需要http，或者是其他地方，
:::

比如定时器往某个连接推送的时候，就是以userName去redis中取得对应的fd，再send。注意，通过addServer形式创建的子服务器，

::: warning 
以再完全注册自己的网络事件，你可以注册onclose事件，然后在连接断开的时候，删除userName=>fd对应。
:::
