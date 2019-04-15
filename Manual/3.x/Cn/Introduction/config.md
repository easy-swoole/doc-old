# 配置文件

EasySwoole框架提供了非常灵活自由的全局配置功能，配置文件采用PHP返回数组方式定义，对于一些简单的应用，无需修改任何配置，对于复杂的要求，还可以自行扩展自己独立的配置文件和进行动态配置。框架安装完成后系统默认的全局配置文件是项目根目录下的 `produce.php`,`dev.php` 文件，(在3.1.2版本之前是dev.env,produce.env)
文件内容如下:

```php
<?php
      /**
       * Created by PhpStorm.
       * User: yf
       * Date: 2019-01-01
       * Time: 20:06
       */
      
      return [
          'SERVER_NAME'   => "EasySwoole",//服务名
          'MAIN_SERVER'   => [
              'LISTEN_ADDRESS' => '0.0.0.0',//监听地址
              'PORT'           => 9501,//监听端口
              'SERVER_TYPE'    => EASYSWOOLE_WEB_SERVER, //可选为 EASYSWOOLE_SERVER  EASYSWOOLE_WEB_SERVER EASYSWOOLE_WEB_SOCKET_SERVER
              'SOCK_TYPE'      => SWOOLE_TCP,//该配置项当为SERVER_TYPE值为TYPE_SERVER时有效
              'RUN_MODEL'      => SWOOLE_PROCESS,// 默认Server的运行模式
              'SETTING'        => [// Swoole Server的运行配置（ 完整配置可见[Swoole文档](https://wiki.swoole.com/wiki/page/274.html) ）
                  'worker_num'       => 8,//运行的  worker进程数量
                  'max_request'      => 5000,// worker 完成该数量的请求后将退出，防止内存溢出
                  'task_worker_num'  => 8,//运行的 task_worker 进程数量
                  'task_max_request' => 1000// task_worker 完成该数量的请求后将退出，防止内存溢出
              ]
          ],
          'TEMP_DIR'      => null,//临时文件存放的目录
          'LOG_DIR'       => null,//日志文件存放的目录
          'CONSOLE'       => [//console控制台组件配置
              'ENABLE'         => true,//是否开启
              'LISTEN_ADDRESS' => '127.0.0.1',//监听地址
              'PORT'           => 9500,//监听端口
              'USER'           => 'root',//验权用户名
              'PASSWORD'       => '123456'//验权用户名
          ],
          'FAST_CACHE'    => [//fastCache组件
              'PROCESS_NUM' => 0,//进程数,大于0才开启
              'BACKLOG'     => 256,//数据队列缓冲区大小
          ],
          'DISPLAY_ERROR' => true,//是否开启错误显示
      ];
```

> EASYSWOOLE_SERVER,EASYSWOOLE_WEB_SOCKET_SERVER类型,都需要在`EasySwooleEvent.php`的`mainServerCreate`自行设置回调(receive或message),否则将出错

## 配置操作类

配置操作类为 `EasySwoole\Config` 类，使用非常简单，见下面的代码例子，操作类还提供了 `toArray` 方法获取全部配置，`load` 方法重载全部配置，基于这两个方法，可以自己定制更多的高级操作

> 设置和获取配置项都支持点语法分隔，见下面获取配置的代码例子

```php
<?php

$instance = \EasySwoole\EasySwoole\Config::getInstance();

// 获取配置 按层级用点号分隔
$instance->getConf('MAIN_SERVER.SETTING.task_worker_num');

// 设置配置 按层级用点号分隔
$instance->setConf('DATABASE.host', 'localhost');

// 获取全部配置
$conf = $instance->getConf();

// 用一个数组覆盖当前配置项
$conf['DATABASE'] = [
    'host' => '127.0.0.1',
    'port' => 13306
];
$instance->load($conf);
```
> 需要注意的是 由于进程隔离的原因 在Server启动后，动态新增修改的配置项，只对执行操作的进程生效，如果需要全局共享配置需要自己进行扩展

## 添加用户配置项

每个应用都有自己的配置项，添加自己的配置项非常简单，其中一种方法是直接在配置文件中添加即可，如下面的例子

```php
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
```

## 生产与开发配置分离
在php easyswoole start命令下,默认为开发模式,加载 `dev.php` (3.1.2之前为 `dev.env`)
运行 php easyswoole start produce 命令时,为生产模式,加载 `produce.php` (3.1.2之前为 `produce.env`)


## DI注入配置
es3.x提供了几个Di参数配置,可自定义配置脚本错误异常处理回调,控制器命名空间,最大解析层级等
```php
<?php
Di::getInstance()->set(SysConst::ERROR_HANDLER,function (){});//配置错误处理回调
Di::getInstance()->set(SysConst::SHUTDOWN_FUNCTION,function (){});//配置脚本结束回调
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_NAMESPACE,'App\\HttpController\\');//配置控制器命名空间
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);//配置http控制器最大解析层级
Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,function (){});//配置http控制器异常回调
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_POOL_MAX_NUM,15);//http控制器对象池最大数量
```

## 动态配置
当你在控制器(worker进程)中修改某一项配置时,由于进程隔离,修改的配置不会在其他进程生效,所以我们可以使用动态配置:  
动态配置将配置数据存储在swoole_table中,取/修改配置数据时是从swoole_table直接操作,所有进程都可以使用  
>但是不适合存储大量\大长度的的配置,建议用于开关存储等小数据型数据存储    

```php
<?php
    Config::getInstance()->setDynamicConf('test_config_value', 0);//配置一个动态配置项
    $test_config_value_1 = Config::getInstance()->getDynamicConf('test_config_value');//获取一个配置
    Config::getInstance()->delDynamicConf('test_config_value');//删除一个配置
```
