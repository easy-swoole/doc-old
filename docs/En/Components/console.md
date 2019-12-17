---
title: Console远程控制台
meta:
  - name: description
    content: 利用swoole子服务，通过telnet 客户端实现远程控制交互
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Console|swoole console|swoole 远程控制台
---

# Console

Easyswoole 提供了一个基于tcp的基础远程控制台，方便用户做开发阶段的调试或者是线上的一些远程管理。

## Installation
```
composer require easyswoole/console
```
## Server
```php
use EasySwoole\Console\Console;
use EasySwoole\Console\ModuleInterface;
$http = new swoole_http_server("127.0.0.1", 9501);

$http->on("request", function ($request, $response) {
    $response->header("Content-Type", "text/plain");
    $response->end("Hello World\n");
});

/*
 * 开一个tcp端口给console 用
 */
$tcp = $http->addlistener('0.0.0.0',9600,SWOOLE_TCP);
/*
 * 实例化一个控制台，设置密码为123456
 */
$console = new Console('myConsole','123456');

/*
 * 定义自己的一个命令
 */

class Test implements ModuleInterface
{

    public function moduleName(): string
    {
        return 'test';
    }

    public function exec(array $arg, int $fd, Console $console)
    {
       return 'this is test exec';
    }

    public function help(array $arg, int $fd, Console $console)
    {
        return 'this is test help';
    }
}

/*
 * 命令注册
 */

$console->moduleContainer()->set(new Test());
/*
 * 依附给server
 */
$console->protocolSet($tcp)->attachToServer($http);

$http->start();

```

## Client 
```
telnet 127.0.0.1 9600
```

### 鉴权

```
auth {PASSWORD}
```

### 执行命令

```
{MODULE} {ARG1} {ARG2}
```

## 例子-如何在Easyswoole中实现日志推送

### 模型定义
```php
namespace App\Utility;


use EasySwoole\Console\Console;
use EasySwoole\Console\ModuleInterface;
use EasySwoole\EasySwoole\Config;

class LogPusher implements ModuleInterface
{

    public function moduleName(): string
    {
        return 'log';
    }

    public function exec(array $arg, int $fd, Console $console)
    {
        /*
         * 此处能这样做是因为easyswoole3.2.5后的版本改为swoole table存储配置了，因此配置不存在进程隔离
         */
        $op = array_shift($arg);
        switch ($op){
            case 'enable':{
                Config::getInstance()->setConf('logPush',true);
                break;
            }
            case "disable":{
                Config::getInstance()->setConf('logPush',false);
                break;
            }
        }
        $status = Config::getInstance()->getConf('logPush');
        $status = $status ? 'enable' : 'disable';
        return "log push is {$status}";
    }

    public function help(array $arg, int $fd, Console $console)
    {
        return 'this is log help';
    }
}
```

### Service Registration
重点是在easyswoole 全局的事件中进行注册

```php
namespace EasySwoole\EasySwoole;


use App\Utility\LogPusher;
use EasySwoole\Console\Console;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        ServerManager::getInstance()->addServer('consoleTcp','9600',SWOOLE_TCP,'0.0.0.0',[
            'open_eof_check'=>false
        ]);
        $consoleTcp = ServerManager::getInstance()->getSwooleServer('consoleTcp');
        /**
            密码为123456
        */
        $console = new Console("MyConsole",'123456');
        /*
         * 注册日志模块
         */
        $console->moduleContainer()->set(new LogPusher());
        $console->protocolSet($consoleTcp)->attachToServer(ServerManager::getInstance()->getSwooleServer());
        /*
         * 给es的日志推送加上hook
         */
        Logger::getInstance()->onLog()->set('remotePush',function ($msg,$logLevel,$category)use($console){
            if(Config::getInstance()->getConf('logPush')){
                /*
                 * 可以在 LogPusher 模型的exec方法中，对loglevel，category进行设置，从而实现对日志等级，和分类的过滤推送
                 */
                foreach ($console->allFd() as $item){
                    $console->send($item['fd'],$msg);
                }
            }
        });
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```

### 测试
链接远程服务器
```
telnet {IP} 9600
```
鉴权登录
```
auth 123456
```
打开日志推送
```
log enable
```

后续程序中的日志都会推送到你的控制台
