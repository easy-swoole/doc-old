---
title: Configuration file
meta:
  - name: description
    Content: EasySwoole provides a very flexible global configuration feature that allows you to extend your own profile and dynamically configure it.
  - name: keywords
    Content: easyswoole|profile|dynamic configuration
---


# Configuration file

The EasySwoole framework provides a very flexible and free global configuration function. The configuration file is defined by PHP return array. For some simple applications, no configuration needs to be modified. For complex requirements, you can also extend your own independent configuration files and dynamically configure. . After the framework is installed, the default global configuration file is the `produce.php`, `dev.php` file in the project root directory (before version 3.1.2 is dev.env, produce.env)
The file contents are as follows:

```php
<?php
      
      return [
          'SERVER_NAME'   => "EasySwoole",//Service Name
          'MAIN_SERVER'   => [
              'LISTEN_ADDRESS' => '0.0.0.0',//Listening address
              'PORT'           => 9501,//Listening port
              'SERVER_TYPE'    => EASYSWOOLE_WEB_SERVER, //Optional EASYSWOOLE_SERVER  EASYSWOOLE_WEB_SERVER EASYSWOOLE_WEB_SOCKET_SERVER
              'SOCK_TYPE'      => SWOOLE_TCP,//This configuration item is valid when the SERVER_TYPE value is TYPE_SERVER.
              'RUN_MODEL'      => SWOOLE_PROCESS,// Default Server operating mode
              'SETTING'        => [// Run configuration of Swoole Server (full configuration visible [Swoole documentation] (https://wiki.swoole.com/wiki/page/274.html))
                  'worker_num'       => 8, // Number of worker processes running
                  'reload_async' => true, // Set the asynchronous restart switch. When set to true, the asynchronous secure restart feature is enabled and the worker process waits for the asynchronous event to complete before exiting.
                  'task_enable_coroutine' => true, //Automatically create coroutines in the onTask callback after opening
                  'max_wait_time'=>3
              ],
              'TASK'=>[
                  'workerNum'=>4,
                  'maxRunningNum'=>128,
                  'timeout'=>15
              ]
          ],
          'TEMP_DIR'      => null,//Temporary file storage directory
          'LOG_DIR'       => null,//Directory where log files are stored
      ];
```


::: warning 
 EASYSWOOLE_SERVER, EASYSWOOLE_WEB_SOCKET_SERVER type, you need to set the callback (receive or message) in `EasySwooleEvent.php` `mainServerCreate`, otherwise it will be wrong
:::

## Configuration operation class

The configuration operation class is `EasySwoole\Config`, which is very simple to use. See the code example below. The operation class also provides the `toArray` method to get all the configuration. The `load` method overrides all configurations. Based on these two methods, you can Customize more advanced operations yourself

::: warning 
 Setting and getting configuration items support dot syntax separation. See the code example for getting the configuration below.
:::

```php
<?php

$instance = \EasySwoole\EasySwoole\Config::getInstance();

// Get configuration separated by level with level
$instance->getConf('MAIN_SERVER.SETTING.task_worker_num');

// Set configuration by level with a dot
$instance->setConf('DATABASE.host', 'localhost');

// Get all configurations
$conf = $instance->getConf();

// Overwrite the current configuration item with an array
$conf['DATABASE'] = [
    'host' => '127.0.0.1',
    'port' => 13306
];
$instance->load($conf);
```

::: warning 
 After the server is started, the newly added configuration items are valid only for the process that performs the operation. If you need to share the configuration globally, you need to expand the configuration.
:::

## Add a user profile

Each application has its own configuration items. Adding your own configuration items is very simple. One of the methods is to add them directly to the configuration file, as in the following example.

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

## Production and development configuration separation
Under the php easyswoole start command, the default is development mode, loading `dev.php` (previous to 3.dev.env` before 3.1.2)
When running the php easyswoole start produce command, load `produce.php` for production mode (previously `produce.env` before 3.1.2)


## DI injection configuration
Es3.x provides several Di parameter configurations, custom configuration script error exception handling callbacks, controller namespace, maximum resolution level, etc.
```php
<?php
Di::getInstance()->set(SysConst::ERROR_HANDLER,function (){});//Configuration error handling callback
Di::getInstance()->set(SysConst::SHUTDOWN_FUNCTION,function (){});//Configuration script end callback
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_NAMESPACE,'App\\HttpController\\');//Configuring the controller namespace
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);//Configure the maximum resolution level of the http controller.
Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,function (){});//Configure http controller exception callback
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_POOL_MAX_NUM,15);//The maximum number of http controller object pools
```

## Dynamic configuration

After the 3.2.5 version of EasySwoole, the default config storage driver was changed to swoole_table. As long as the configuration is modified, other processes are also effective.


## Config driver
After EasySwoole is released in version 3.2.5, the default configuration of the driver storage is changed from SplArray to swoole_table. After the configuration is modified, all processes take effect at the same time.

### \EasySwoole\Config\AbstractConfig
The AbstractConfig abstract class provides the following methods for driving inheritance to other config drivers.
- __construct(bool $isDev = true)
  Pass in the parameters of the development environment, according to the parameter to load dev.php or produce.php
- isDev() 
 This method can be used to obtain whether the current operating environment is a development environment.
- abstract function getConf($key = null);
  Get a configuration
- abstract function setConf($key,$val):bool ;
  Set a parameter
- abstract function load(array $array):bool ;
  Reload configuration item
- abstract function merge(array $array):bool ;
  Merge configuration item
- abstract function clear():bool ;
  Clear all configuration items
  
### Custom configuration
In EasySwoole, it comes with SplArray and swoole_table driver implementation, you can check the source code to understand.

The default driver is swoole_table

If you need to modify the storage driver, the steps are as follows:
* Inherit AbstractConfig to implement each method
* 在
````php 
<?php
public static function initialize()
{
//Obtain the original config configuration item and load it into the new configuration item.
   $config = Config::getInstance()->getConf();
   Config::getInstance()->storageHandler(new SplArrayConfig())->load($config);
   // TODO: Implement initialize() method.
   date_default_timezone_set('Asia/Shanghai');
}
````

### Dynamic configuration problem
Since swoole is multi-process, if you use SplArray to store, after a single process modifies the configuration, other processes will not take effect. If you use the swoole_table method, all of them will take effect.

## other

- QQ exchange group
    - VIP group 579434607 (this group needs to pay 599 RMP)
    - EasySwoole official group 633921431 (full)
    - EasySwoole official two groups 709134628
    
- Business support:
    - QQ 291323003
    - EMAIL admin@fosuss.com   
- Author WeChat

     ![](/resources/authWx.png)
    
- [Donation](../Preface/donation.md)
  Your donation is the greatest encouragement and support for the Swoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
  - Continuous and in-depth development
  - Document and community construction and maintenance
  
- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository, modify and supplement it. Submit **Pull Request** and contact us
