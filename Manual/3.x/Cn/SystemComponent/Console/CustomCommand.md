## 自定义命令  

> 参考Demo: [Console](https://github.com/easy-swoole/demo/tree/3.x/App/Utility/ConsoleCommand  )

console组件封装自己的自定义命令

### 代码示例
我们需要继承\EasySwoole\EasySwoole\Console\CommandInterface接口:

```php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/7 0007
 * Time: 16:14
 */

namespace App\Utility\ConsoleCommand;


use EasySwoole\EasySwoole\Console\CommandInterface;
use EasySwoole\Socket\Bean\Caller;
use EasySwoole\Socket\Bean\Response;

class Test implements CommandInterface
{

    public function moduleName(): string
    {
        // TODO: Implement moduleName() method.
        // 自定义模块命令名称
        return 'test';
    }

    public function exec(Caller $caller, Response $response)
    {
        //调用命令时,会执行该方法
        $args = $caller->getArgs();//获取命令后面的参数
        $response->setMessage("你调用的命令参数为:".json_encode($args));
        // TODO: Implement exec() method.
    }

    public function help(Caller $caller, Response $response)
    {
        //调用 help Test时,会调用该方法
        $help = <<<HELP

用法 : Test [arg...]

参数 : 
  arg 
 
HELP;

        return $help;

        // TODO: Implement help() method.
    }
}
```

指定鉴权用户模块权限

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2019-01-01
 * Time: 20:06
 */

return [
    'SERVER_NAME' => "EasySwoole",
    'MAIN_SERVER' => [// 默认Server配置
        'LISTEN_ADDRESS' => '0.0.0.0',// 默认Server监听的地址**(3.0.7以前 为 HOST)
        'PORT'           => 9501,//默认Server监听的端口
        'SERVER_TYPE'    => EASYSWOOLE_WEB_SOCKET_SERVER, // 可选为 EASYSWOOLE_SERVER  EASYSWOOLE_WEB_SERVER EASYSWOOLE_WEB_SOCKET_SERVER
        'SOCK_TYPE'      => SWOOLE_TCP,//该配置项当为SERVER_TYPE值为TYPE_SERVER时有效
        'RUN_MODEL'      => SWOOLE_PROCESS,// 默认Server的运行模式
        'SETTING'        => [// Swoole Server的运行配置（ 完整配置可见[Swoole文档](https://wiki.swoole.com/wiki/page/274.html) ）
            'worker_num'               => 8,//运行的 task_worker 进程数量
            'max_request'              => 5000,// task_worker 完成该数量的请求后将退出，防止内存溢出
            'task_worker_num'          => 8,//运行的 worker 进程数量
            'task_max_request'         => 1000,// worker 完成该数量的请求后将退出，防止内存溢出
            'enable_static_handler'    => true,//加入以下两条配置以返回静态文件
            'document_root'            => EASYSWOOLE_ROOT . "/Static",
//            'heartbeat_idle_time'      => 60, // 300没有心跳时则断开
//            'heartbeat_check_interval' => 10,
        ],
    ],
    'TEMP_DIR'    => null,//临时文件存放的目录
    'LOG_DIR'     => null,//日志文件存放的目录
    'CONSOLE'     => [//console组件配置,完整配置可查看:http://easyswoole.com/Manual/3.x/Cn/_book/SystemComponent/Console/Introduction.html
        'ENABLE'         => true,//是否开启console
        'LISTEN_ADDRESS' => '127.0.0.1',//console服务端监听地址
        'HOST'           => '127.0.0.1',//console客户端连接远程地址
        'PORT'           => 9500,//console服务端监听端口,客户端连接远程端口
        'EXPIRE'         => '120',//心跳超时时间
        'AUTH'           => [
            [
                'USER'        => 'root',
                'PASSWORD'    => 'root',
                'MODULES'     => [
                    'auth', 'server', 'help', 'test'
                ],
                'PUSH_LOG'    => true
            ]
        ]
    ],

    /*################ MYSQL CONFIG ##################*/

    'MYSQL' => [
        'host'          => '192.168.75.1',
        'port'          => '3306',
        'user'          => 'root',
        'timeout'       => '5',
        'charset'       => 'utf8mb4',
        'password'      => 'root',
        'database'      => 'cry',
        'POOL_MAX_NUM'  => '20',
        'POOL_TIME_OUT' => '0.1',
    ],
    /*################ REDIS CONFIG ##################*/
    'REDIS' => [
        'host'          => '127.0.0.1',
        'port'          => '6379',
        'auth'          => '',
        'POOL_MAX_NUM'  => '20',
        'POOL_MIN_NUM'  => '5',
        'POOL_TIME_OUT' => '0.1',
    ],
    'FAST_CACHE'=>[
        'PROCESS_NUM'=>5
    ]
];
```

在EasySwooleEvent.php的initialize事件中进行注册:
```
 \EasySwoole\EasySwoole\Console\CommandContainer::getInstance()->set(new Test());
```

使用php easyswoole console打开控制台,验证鉴权用户，输入test blank,结果
```
[root@0 demo]# php easyswoole console
#!/usr/bin/env php
  ______                          _____                              _
 |  ____|                        / ____|                            | |
 | |__      __ _   ___   _   _  | (___   __      __   ___     ___   | |   ___
 |  __|    / _` | / __| | | | |  \___ \  \ \ /\ / /  / _ \   / _ \  | |  / _ \
 | |____  | (_| | \__ \ | |_| |  ____) |  \ V  V /  | (_) | | (_) | | | |  __/
 |______|  \__,_| |___/  \__, | |_____/    \_/\_/    \___/   \___/  |_|  \___|
                          __/ |
                         |___/
connect to tcp://127.0.0.1:9500 succeed 
Welcome to EasySwoole !,please auth : auth {user} {password}
auth root root
auth success
test blank
你调用的命令参数为:["blank"]

```

### 在控制器中如何发送消息给console控制台  

```
if (\EasySwoole\EasySwoole\Config::getInstance()->getDynamicConf('CONSOLE.PUSH_LOG')) {
    \EasySwoole\EasySwoole\Console\TcpService::push('主动推送给控制台');
}
```
