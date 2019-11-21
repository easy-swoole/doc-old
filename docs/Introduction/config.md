---
title: 配置文件
meta:
  - name: description
    content: EasySwoole提供了非常灵活的全局配置功能，可自行扩展独立的配置文件和进行动态配置。
  - name: keywords
    content: easyswoole|配置文件|动态配置
---


# 配置文件

EasySwoole框架提供了非常灵活自由的全局配置功能，配置文件采用PHP返回数组方式定义，对于一些简单的应用，无需修改任何配置，对于复杂的要求，还可以自行扩展自己独立的配置文件和进行动态配置。  
框架安装完成后系统默认的全局配置文件是项目根目录下的 `produce.php`,`dev.php` 文件，(在3.1.2版本之前是dev.env,produce.env)
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
                  'reload_async' => true,//设置异步重启开关。设置为true时，将启用异步安全重启特性，Worker进程会等待异步事件完成后再退出。
                  'task_enable_coroutine' => true,//开启后自动在onTask回调中创建协程
                  'max_wait_time'=>3
              ],
              'TASK'=>[
                  'workerNum'=>4,
                  'maxRunningNum'=>128,
                  'timeout'=>15
              ]
          ],
          'TEMP_DIR'      => null,//临时文件存放的目录
          'LOG_DIR'       => null,//日志文件存放的目录
      ];
```

::: warning 
 EASYSWOOLE_SERVER,EASYSWOOLE_WEB_SOCKET_SERVER类型,都需要在`EasySwooleEvent.php`的`mainServerCreate`自行设置回调(receive或message),否则将出错
:::

::: warning 
 框架的配置驱动默认为 swoole_table,特性为多进程共享,快速存储,但只能存储少量配置文件,自定义配置驱动可查看本文最后章节
:::

## 配置操作类

配置操作类为 `EasySwoole\Config` 类，使用非常简单，见下面的代码例子，操作类还提供了 `toArray` 方法获取全部配置，`load` 方法重载全部配置，基于这两个方法，可以自己定制更多的高级操作


::: warning 
 设置和获取配置项都支持点语法分隔，见下面获取配置的代码例子
:::

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

::: warning 
 需要注意的是 由于进程隔离的原因 在Server启动后，动态新增修改的配置项，只对执行操作的进程生效，如果需要全局共享配置需要自己进行扩展
:::

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
::: waring
 由于swoole_table的特性,不适合存储大量/大长度的配置,如果是存储支付秘钥,签名等大长度字符串,建议使用类常量方法定义,而不是通过dev.php存储
:::

::: waring
 如果你非得用配置文件存储,请看本文下文的  自定义config驱动
:::

## 自定义Config驱动
EasySwoole在3.2.5版本后,默认配置驱动存储 从SplArray改为了swoole_table,修改配置之后,所有进程同时生效

### \EasySwoole\Config\AbstractConfig
AbstractConfig 抽象类提供了以下几个方法,用于给其他config驱动继承
- __construct(bool $isDev = true)
  传入是否为开发环境的参数,根据该参数去加载dev.php或者produce.php
- isDev() 
 可通过该方法获得当前运行环境是否为开发环境
- abstract function getConf($key = null);
  获取一个配置
- abstract function setConf($key,$val):bool ;
  设置一个参数
- abstract function load(array $array):bool ;
  重新加载配置项
- abstract function merge(array $array):bool ;
  合并配置项
- abstract function clear():bool ;
  清除所有配置项
  
### 自定义配置
在EasySwoole中,自带了SplArray和swoole_table驱动实现,可自行查看源码了解.   
默认驱动为swoole_table  

如需要修改存储驱动,步骤如下:  
* 继承 AbstractConfig 实现各个方法
* 在[bootstrap事件](../Core/event/bootstrap.md)事件中修改config驱动(直接在文件中加入这行代码即可)

````php 
<?php
\EasySwoole\EasySwoole\Config::getInstance(new \EasySwoole\Config\SplArrayConfig());
````
::: warning
由于bootstrap事件是由easyswoole启动脚本执行,当你需要写cli脚本需要初始化easyswoole框架基础组件时,需要自行引入bootstrap.php文件
:::

### 动态配置问题
由于swoole是多进程的,如果使用SplArray方式存储,在单个进程修改配置后,其他进程将不会生效,使用swoole_table方式的则会全部生效,需要注意

## 其他

- QQ交流群
    - VIP群 579434607 （本群需要付费599元）
    - EasySwoole官方一群 633921431(已满)
    - EasySwoole官方二群 709134628
    
- 商业支持：
    - QQ 291323003
    - EMAIL admin@fosuss.com
        
- 作者微信

     ![](/resources/authWx.png)
    
- [捐赠](../Preface/donation.md)
    您的捐赠是对Swoole项目开发组最大的鼓励和支持。我们会坚持开发维护下去。 您的捐赠将被用于:
        
  - 持续和深入地开发
  - 文档和社区的建设和维护
  
- **easySwoole** 的文档采用 **GitBook** 作为文档撰写工具，若您在使用过程中，发现文档有需要纠正 / 补充的地方，请 **fork** 项目的文档仓库，进行修改补充，提交 **Pull Request** 并联系我们
