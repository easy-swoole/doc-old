# Configuration File

EasySwoole provides a very flexible way for the developers to config the application based on the environment where it is running. 
All configuration values are stored in the PHP file and returned as an array. 
For those simple applications, nothing needs to be modified. 
For complex cases, these preferences can come from the default config files (`dev.php`, `produce.php`) or from your own custom config files.

By default, the global configuration files are `dev.php` and `produce.php` located in the project root directory.
The file contents are as follows:

```php
<?php
return [
    'SERVER_NAME' => "EasySwoole",              // service name
    'MAIN_SERVER' => [
        'LISTEN_ADDRESS'    => '0.0.0.0',       // listening address
        'PORT'        => 9501,                  // listening port
        'SERVER_TYPE' => EASYSWOOLE_WEB_SERVER, // eg： EASYSWOOLE_SERVER  EASYSWOOLE_WEB_SERVER EASYSWOOLE_WEB_SOCKET_SERVER
        'SOCK_TYPE'   => SWOOLE_TCP,            // the configuration is valid when the value of SERVER_TYPE id TYPE_SERVER
        'RUN_MODEL'   => SWOOLE_PROCESS,        // application running mode
        'SETTING' => [                          // Swoole extension settings (Refer to Swoole documentation at https://wiki.swoole.com/wiki/page/274.html)
            'worker_num' => 8,                  // worker's processes number
            'max_request' => 5000,              // to prevent memory leak, maximum number of requests per worker
            'task_worker_num' => 8,             // task_worker's processes number
            'task_max_request' => 1000,         // to prevent memory leak, maximum number of requests per task_worker
            'reload_async' => true,             // set the asynchronous restart switch. the `asynchronous safely restart` feature will be enabled and the worker process will wait for the asynchronous event to complete before exiting when reload_async is set to true
            'task_enable_coroutine' => true     // automatically create coroutines in onTask callback
        ],
    ],
    'TEMP_DIR' => null,                         // temporary file storage directory
    'LOG_DIR' => null,                          // log file storage directory
];
```
> If you set the [`MAIN_SERVER`][`SERVER_TYPE`] to `EASYSWOOLE_SERVER` or `EASYSWOOLE_WEB_SOCKET_SERVER`, 
please ensure you manually assign the callback (receive or message) in `EasySwooleEvent.php` -> `mainServerCreate`, otherwise, it will cause the error.

## Configuration operation class

Configuration operation class is `EasySwoole\Config`, which is very simple to use. See the code example below. The operation class also provides `toArray` method to get all configurations and `load` method to overload all configurations. Based on these two methods, you can customize more advanced operations by yourself.

> Setting and getting configuration items both support point segregation, as shown in the following code example for retrieving configuration

```php
<?php

$instance = \EasySwoole\EasySwoole\Config::getInstance();

// The configuration values may be accessed using "dot" syntax
$instance->getConf('MAIN_SERVER.SETTING.task_worker_num');

// To set configuration values may be accessed using "dot" syntax
$instance->setConf('DATABASE.host', 'localhost');

// get all configurations
$conf = $instance->getConf();   // or $instance->toArray()

// overwrite the current configuration item with an array
$conf['DATABASE'] = [
    'host' => '127.0.0.1',
    'port' => 13306
];
$instance->load($conf);
```

> Note that the process is isolated. The newly added configuration items are valid only for the process performing the operation after the server is started. If the configuration values need to be shared for all, please extend the functionality by yourself.

## Adding your own configuration items

Each application may have its own configuration items. 
Adding your own configuration items is very simple. 
The easiest way is to put them directly in the configuration file, as in the following example.

```php
/* ################ MYSQL CONFIG ################## */
'MYSQL' => [
    'host' => '192.168.75.1',
    'port' => '3306',
    'user' => 'root',
    'timeout' => '5',
    'charset' => 'utf8mb4',
    'password' => 'root',
    'database' => 'cry',
    'POOL_MAX_NUM' => '20',
    'POOL_TIME_OUT' => '0.1',
],
/* ################ REDIS CONFIG ################## */
'REDIS' => [
    'host' => '127.0.0.1',
    'port' => '6379',
    'auth' => '',
    'POOL_MAX_NUM' => '20',
    'POOL_MIN_NUM' => '5',
    'POOL_TIME_OUT' => '0.1',
],
```

## DI injection configuration

Es3.x provides several Di parameter configurations that can be customized to configure script error handling callbacks, controller namespaces, maximum parsing levels, and so on.

```php
<?php
use EasySwoole\Component\Di;
use EasySwoole\EasySwoole\SysConst;

Di::getInstance()->set(SysConst::ERROR_HANDLER,function (){});                          // configuration error handling callback
Di::getInstance()->set(SysConst::SHUTDOWN_FUNCTION,function (){});                      // configure script end callback
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_NAMESPACE, 'App\\HttpController\\');   // configure the controller namespace
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);                          // configure the maximum resolution level of the http controller
Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,function (){});                 // configure http controller exception callback
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_POOL_MAX_NUM,15);                      // the maximum number of controller object pools
```

## Dynamic Configuration

After version 3.2.5, EasySwoole changed the default config storage driver to swoole_table. As long as the configuration is changed, other processes will also take effect.

## Config Driver
After EasySwoole version 3.2.5, the default configuration-driven storage is changed from SplArray to swoole_table. After the configuration is modified, all processes take effect simultaneously.

### \EasySwoole\Config\AbstractConfig
The AbstractConfig abstract class provides the following methods for inheriting from other config drivers
- __construct(bool $isDev = true)
  Whether the input is a parameter of the development environment, load dev.php or produce.php according to the parameter
- isDev() 
  This method can be used to determine whether the current running environment is a development environment or not.
- abstract function getConf($key = null);
  Get a configuration
- abstract function setConf($key,$val):bool ;
  Set a parameter
- abstract function load(array $array):bool ;
  Reload configuration items
- abstract function merge(array $array):bool ;
  Merge configuration items
- abstract function clear():bool ;
  Clear all configuration items
  
### Custom Configuration
In EasySwoole, SplArray and swoole_table driver implementations are included, so you can see the source code for yourself.
The default driver is swoole_table

If you need to modify the storage driver, the steps are as follows:
* Inheriting AbstractConfig to implement various methods
* Code examples
````php 
<?php
public static function initialize()
{
   //Get the original config configuration item and load it into the new configuration item
   $config = Config::getInstance()->getConf();
   Config::getInstance()->storageHandler(new SplArrayConfig())->load($config);
   // TODO: Implement initialize() method.
   date_default_timezone_set('Asia/Shanghai');
}
````

### Dynamic Configuration Problem
Since swoole is multi-process, if stored in SplArray mode, other processes will not take effect after a single process changes its configuration, and all processes will take effect when swoole_table mode is used.

## Other

- [Project Document Warehouse](https://github.com/easy-swoole/doc)

- [DEMO](https://github.com/easy-swoole/demo/)

- QQ exchange group
     - VIP group 579434607 (this group needs to pay 599 RMB)
     - EasySwoole official group 633921431 (full)
     - EasySwoole official second group 709134628
    
- Business support:
     - QQ 291323003
     - EMAIL admin@fosuss.com
     
- Translate by
     - NAME: huizhang
     - QQ: 2788828128
     - EMAIL: <a href="mailto:tuzisir@163.com">tuzisir@163.com</a>


- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us
        