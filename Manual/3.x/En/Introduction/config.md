# Configuration File

EasySwoole framework provides a very flexible and global configuration function. The configuration file is defined by PHP return array. For some simple applications, no configuration needs to be modified. For complex cases, you can extend your own configuration files and dynamically configure them independently.

## Default Profile

After the framework is installed, the system default global configuration file is the `dev.php`, `produce.php` file in the project root directory.
The file contents are as follows:

```
return [
    'SERVER_NAME' => "EasySwoole",
    'MAIN_SERVER' => [
        'LISTEN_ADDRESS' => '0.0.0.0',
        'PORT' => 9501,
        'SERVER_TYPE' => EASYSWOOLE_WEB_SERVER, //eg： EASYSWOOLE_SERVER  EASYSWOOLE_WEB_SERVER EASYSWOOLE_WEB_SOCKET_SERVER
        'SOCK_TYPE' => SWOOLE_TCP,
        'RUN_MODEL' => SWOOLE_PROCESS,
        'SETTING' => [
            'worker_num' => 8,
            'max_request' => 5000,
            'task_worker_num' => 8,
            'task_max_request' => 1000,
        ],
    ],
    'TEMP_DIR' => null,
    'LOG_DIR' => null,
    'CONSOLE' => [
        'ENABLE' => true,
        'LISTEN_ADDRESS' => '127.0.0.1',
        'HOST' => '127.0.0.1',
        'PORT' => 9500,
        'EXPIRE' => '120',
        'PUSH_LOG' => true,
        'AUTH' => [
            [
                'USER'=>'root',
                'PASSWORD'=>'123456',
                'MODULES'=>[
                    'auth','server','help'
                ],
                'PUSH_LOG' => true,
            ]
        ]
    ],
    'FAST_CACHE' => [
        'PROCESS_NUM' => 0,
        'BACKLOG' => 256,
    ],
    'DISPLAY_ERROR' => true,
];
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
