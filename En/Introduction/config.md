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

## Global config helper class

You may access your configuration values using a `EasySwoole\Config` class instance from anywhere in your application. 
- `toArray` method to get all the configuration
- `load` method overrides all configurations
- With above two methods, you can customize more advanced operations.
A simple example is as following:

> Example for get/set configuration values

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
<?php
[
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
];
```

## Application running mode 
- Develop mode: The `php easyswoole start` command will load `dev.php` as the configuration 
- Production mode: The `php easyswoole start produce` command will load `produce.php` as the configuration


## Dependency Injection
EasySwoole 3.x provides an elegant way to perform dependency injection. Please refer to the following code snippet:

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
When you modify the configuration values in the controller (worker process), due to process isolation, 
the updated configuration values can not take effect in other processes, therefore we shall use dynamic configuration (Dynamic configuration values are stored in <a href="https://www.php.net/manual/en/class.swoole-table.php">Swoole\Table</a>). 
When fetching/modifying dynamic configuration data, it directly operates the `Swoole\Table`, so all processes will be affected.
>But it is not suitable for storing a large-number/big-size of configurations values, so in this case, we recommended to use in-memory database solution such as `Redis` in stead.

```php
<?php
    Config::getInstance()->setDynamicConf('test_config_value', 0); // set a dynamic configuration item
    $test_config_value_1 = Config::getInstance()->getDynamicConf('test_config_value'); // get a dynamic configuration value
    Config::getInstance()->delDynamicConf('test_config_value'); // delete a dynamic configuration item
```

## Other

- QQ Discussion group
    - VIP group 579434607 (this group needs to pay 599 RMB)
    - EasySwoole official group: 633921431 (No vacancies)
    - EasySwoole official alternative group: 709134628
    
- Commercial users support:
    - QQ 291323003
    - EMAIL: <a href="mailto:admin@fosuss.com">admin@fosuss.com</a>
        
- Author WeChat

    ![](http://easyswoole.com/img/authWx.jpg)
    
- [donation] (../donate.md)
    Your donation is the greatest encouragement and support for EasySwoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
   - Continuous development and upgrade
   - Documentations, Community and Long term technical support
  
- **EasySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us
