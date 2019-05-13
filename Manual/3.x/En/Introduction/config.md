# Configuration File

EasySwoole framework provides a very flexible and global configuration function. The configuration file is defined by PHP return array. For some simple applications, no configuration needs to be modified. For complex cases, you can extend your own configuration files and dynamically configure them independently.

## Default Profile

After the framework is installed, the default global configuration file of the sytem is under the `dev.php`, `produce.php` files in the project root directory.
The file contents are as follows:

```
return [
    'SERVER_NAME' => "EasySwoole", // service name
    'MAIN_SERVER' => [
        'LISTEN_ADDRESS' => '0.0.0.0', // listening address
        'PORT' => 9501, // listening port
        'SERVER_TYPE' => EASYSWOOLE_WEB_SERVER, // eg： EASYSWOOLE_SERVER  EASYSWOOLE_WEB_SERVER EASYSWOOLE_WEB_SOCKET_SERVER
        'SOCK_TYPE' => SWOOLE_TCP, // the configuration is valid when the value of SERVER_TYPE id TYPE_SERVER
        'RUN_MODEL' => SWOOLE_PROCESS, // default Server running mode
        'SETTING' => [ // Swoole Server running configuration (The full version Swoole documentation is https://wiki.swoole.com/wiki/page/274.html)
            'worker_num' => 8, // running worker process numbers
            'max_request' => 5000, // worker will exit after completing this number of requests to prevent memory overflow
            'task_worker_num' => 8, // number of task_worker processes running
            'task_max_request' => 1000, // task_worker will exit after completing this number of requests to prevent memory overflow
            reload_async' => true, // set the asynchronous restart switch, the asynchronous secure restart feature will be enabled and the worker process will wait for the asynchronous event to complete before exiting when reload_async is set to true
            'task_enable_coroutine' => true // automatically create coroutines in onTask callbacks
        ],
    ],
    'TEMP_DIR' => null, // temporary file storage directory
    'LOG_DIR' => null, // log file storage directory
    'CONSOLE' => [ // console component configuration
        'ENABLE' => true, // to enable console or not
        'LISTEN_ADDRESS' => '127.0.0.1', // listening address
        'PORT' => 9500, // listening port
        'EXPIRE' => '120', // user id
        'PUSH_LOG' => true, // user password
    ],
    'FAST_CACHE' => [ // fastCache component
        'PROCESS_NUM' => 0, // process number, ißt will be opened when the value is greater than 0
        'BACKLOG' => 256, // buffer size of data queue
    ],
    'DISPLAY_ERROR' => true, // whether to enable error display
];
```
> EASYSWOOLE_SERVER, EASYSWOOLE_WEB_SOCKET_SERVER type, you need to set the callback (receive or message) in `EasySwooleEvent.php` `mainServerCreate`, otherwise it will be wrong

## Configuring the Operation Class

The configuration operation class is `EasySwoole\Config`, which is very simple to use. To see the code example below, the operation class provides the `toArray` method to get all the configuration. The `load` method overrides all configurations. Based on these two methods, you can customize more advanced operations yourself.

> Example for get/set config

```php
<?php

$instance = \EasySwoole\EasySwoole\Config::getInstance();

// get configuration, separated by level with dots
$instance->getConf('MAIN_SERVER.SETTING.task_worker_num');

// set configuration, separated by level with dots
$instance->setConf('DATABASE.host', 'localhost');

// get all configurations
$conf = $instance->getConf();

// overwrite the current configuration item with an array
$conf['DATABASE'] = [
    'host' => '127.0.0.1',
    'port' => 13306
];
$instance->load($conf);
```
> Note that the process is isolated. The newly added configuration items are valid only for the process performing the operation after the server is started. If you need to share the configuration globally, you need to expand the configuration.

## Adding a User Configuration Item

Each application has its own configuration items. Adding your own configuration items is very simple. One of the methods is to add them directly to the configuration file, as in the following example.

```php
/*################ REDIS CONFIG ##################/

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
/*################ REDIS CONFIG ##################/
'REDIS' => [
    'host' => '127.0.0.1',
    'port' => '6379',
    'auth' => '',
    'POOL_MAX_NUM' => '20',
    'POOL_MIN_NUM' => '5',
    'POOL_TIME_OUT' => '0.1',
],
```

## Separation of Production and Development Configuration 
Under the php easyswoole start command, loading `dev.php` is the default development mode (previous to 3.dev.env` before 3.1.2)
When running the php easyswoole start produce command, loading `produce.php` is for production mode (previously `produce.env` before 3.1.2)


## DI Injection Configuration
es3.x provides several Di parameter configurations, custom configuration script error exception handling callbacks, controller namespace, maximum resolution level, etc.
```php
<?php
Di::getInstance()->set(SysConst::ERROR_HANDLER,function (){}); // configuration error handling callback
Di::getInstance()->set(SysConst::SHUTDOWN_FUNCTION,function (){}); // configure script end callback
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_NAMESPACE, 'App\\HttpController\\'); // configure the controller namespace
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5); // configure the maximum resolution level of the http controller
Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,function (){}); // configure http controller exception callback
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_POOL_MAX_NUM,15); // the maximum number of controller object pools
```

## Dynamic Configuration
When you modify a configuration in the controller (worker process), due to process isolation, the modified configuration will not take effect in other processes, so we can use dynamic configuration:
Dynamic configuration stores configuration data in swoole_table. When fetching/modifying configuration data, it is directly operated from swoole_table, and all processes can be used.
>But it is not suitable for storing a large number of large-length configurations, it is recommended for small data type data storage such as switch storage.

```php
<?php
    Config::getInstance()->setDynamicConf('test_config_value', 0); // configure a dynamic configuration item
    $test_config_value_1 = Config::getInstance()->getDynamicConf('test_config_value'); // get a configuration
    Config::getInstance()->delDynamicConf('test_config_value'); // delete a configuration
```

## Other

- QQ exchange group
    - VIP group 579434607 (this group needs to pay 599 RMB)
    - EasySwoole official group 633921431 (full)
    - EasySwoole official second group 709134628
    
- Business support:
    - QQ 291323003
    - EMAIL admin@fosuss.com
        
- Author WeChat

    ![](http://easyswoole.com/img/authWx.jpg)
    
- [donation] (../donate.md)
    Your donation is the greatest encouragement and support for the Swoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
   - Continuous and in-depth development
   - Documentation, community construction and maintenance
  
- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us
