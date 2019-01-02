# Configuration file

EasySwoole provides a very flexible and free global configuration function. The configuration file is defined by PHP return array. For some simple applications, no configuration needs to be modified. For complex requirements, you can also extend your own independent configuration files and dynamically configure.

## Default Profile

After the framework is installed, the system default global configuration file is the `dev.env`, `produce.env` file in the project root directory.
The file contents are as follows:

```
# eg:
# mysql.port = 3306
# MAIN_SERVER.PORT = 80
# MAIN_SERVER.SETTING.worker_num = 80

################ defalut config ##################
SERVER_NAME = EasySwoole

MAIN_SERVER.LISTEN_ADDRESS = 0.0.0.0
MAIN_SERVER.PORT = 9501
MAIN_SERVER.SERVER_TYPE = WEB_SERVER ## SERVER  WEB_SERVER WEB_SOCKET_SERVER
MAIN_SERVER.SOCK_TYPE = SWOOLE_TCP  ## available when SERVER_TYPE is SERVER
MAIN_SERVER.RUN_MODEL = SWOOLE_PROCESS

MAIN_SERVER.SETTING.task_worker_num = 8
MAIN_SERVER.SETTING.task_max_request = 500
MAIN_SERVER.SETTING.worker_num = 8
MAIN_SERVER.SETTING.max_request = 5000

TEMP_DIR = null
LOG_DIR = null
```

## Configuring the operation class

The configuration operation class is `EasySwoole\Config`, which is very simple to use. See the code example below. The operation class also provides the `toArray` method to get all the configuration. The `load` method overrides all configurations. Based on these two methods, you can customize more advanced operations yourself

> Example for get/set config

```php
<?php

$instance = \EasySwoole\EasySwoole\Config::getInstance();

// get
$instance->getConf('MAIN_SERVER.SETTING.task_worker_num');

// set
$instance->setConf('DATABASE.host', 'localhost');

// get all
$conf = $instance->getConf();

// override
$conf['DATABASE'] = [
    'host' => '127.0.0.1',
    'port' => 13306
];
$instance->load($conf);
```

> If you set config after server is started, it's only changed in current process.

## Add your own config item

You can add it in config file

```ini
# eg:
# mysql.port = 3306
# MAIN_SERVER.PORT = 80
# MAIN_SERVER.SETTING.worker_num = 80

################ defalut config ##################
SERVER_NAME = EasySwoole

MAIN_SERVER.LISTEN_ADDRESS = 0.0.0.0
MAIN_SERVER.PORT = 9501
MAIN_SERVER.SERVER_TYPE = WEB_SERVER
MAIN_SERVER.SOCK_TYPE = SWOOLE_TCP
MAIN_SERVER.RUN_MODEL = SWOOLE_PROCESS

MAIN_SERVER.SETTING.task_worker_num = 8
MAIN_SERVER.SETTING.task_max_request = 500
MAIN_SERVER.SETTING.worker_num = 8
MAIN_SERVER.SETTING.max_request = 5000

TEMP_DIR = null
LOG_DIR = null

############## Your config ##################
DATABASE.ip=127.0.0.1
DATABASE.port=3306
DATABASE.user=root
DATABASE.password=root

```

also you can create a file, such as:

create App/Conf/web.php and App/Conf/app.env  

EasySwooleEvent.php example:  
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/28
 * Time: 下午6:33
 */

namespace EasySwoole\EasySwoole;


use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\Utility\File;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        self::loadConf();
        // TODO: Implement initialize() method.
    }

    /**
     * load config file
     */
    public static function loadConf()
   {
       $files = File::scanDirectory(EASYSWOOLE_ROOT . '/App/Config');
       if (is_array($files)) {
           foreach ($files['files'] as $file) {
               $fileNameArr = explode('.', $file);
               $fileSuffix = end($fileNameArr);
               if ($fileSuffix == 'php') {
                   Config::getInstance()->loadFile($file);
               }
           }
       }
   }

    public static function mainServerCreate(EventRegister $register)
    {
        // TODO: Implement mainServerCreate() method.
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }

    public static function onReceive(\swoole_server $server, int $fd, int $reactor_id, string $data):void
    {

    }

}
```
>env file don't support `#`, you can load config which is php file

## Multiple config
Run php easyswoole start, default is development mode, will load dev.env  
If run php easyswoole start produce, is production mode, will load produce.env
 

## DI inject config
es3.x provides some Di config, you can set error/exception handler, controller namespace and controller max depth etc.
```php
<?php
Di::getInstance()->set(SysConst::ERROR_HANDLER,function (){});
Di::getInstance()->set(SysConst::SHUTDOWN_FUNCTION,function (){});
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_NAMESPACE,'App\\HttpController\\');
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_MAX_DEPTH,5);
Di::getInstance()->set(SysConst::HTTP_EXCEPTION_HANDLER,function (){});
Di::getInstance()->set(SysConst::HTTP_CONTROLLER_POOL_MAX_NUM,15);
```

## Dynamic config
When you modify a configuration in the controller (worker process), due to process isolation, the modified configuration will not take effect in other processes, so we can use dynamic configuration:
Dynamic configuration stores configuration data in swoole_table. When fetching/modifying configuration data, it is directly operated from swoole_table, and all processes can be used.
>But it is not suitable for storing a large number of large-length configurations. It is recommended for small data type data storage such as switch storage.

```php
Config::getInstance()->setDynamicConf('test_config_value', 0);
$test_config_value_1 = Config::getInstance()->getDynamicConf('test_config_value');
Config::getInstance()->delDynamicConf('test_config_value');
```
