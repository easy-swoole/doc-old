---
title: Configuration information registration
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---

# Configuration information registration

The connection configuration information (database connection information) of the ORM needs to be registered in the "Connection Manager".

## Database connection manager

ORM's connection management is done by the ```EasySwoole\ORM\DbManager``` class, which is a singleton class.

```php
use EasySwoole\ORM\DbManager;

DbManager::getInstance();
```


## Register database connection configuration

You can register the connection in the framework `mainServerCreate` main service creation event.

```php
use EasySwoole\ORM\DbManager;
use EasySwoole\ORM\Db\Connection;
use EasySwoole\ORM\Db\Config;


public static function mainServerCreate($register)
{
    $config = new Config();
    $config->setDatabase('easyswoole_orm');
    $config->setUser('root');
    $config->setPassword('');
    $config->setHost('127.0.0.1');

    DbManager::getInstance()->addConnection(new Connection($config));
}
```


## Database connection comes with a connection pool description

In the default implementation, ORM comes with a connection class based on the connection pool `implementation.

`EasySwoole\ORM\Db\Connection` implements the use of the connection pool

```php
use EasySwoole\ORM\DbManager;
use EasySwoole\ORM\Db\Connection;
use EasySwoole\ORM\Db\Config;


public static function mainServerCreate($register)
{
    $config = new Config();
    $config->setDatabase('easyswoole_orm');
    $config->setUser('root');
    $config->setPassword('');
    $config->setHost('127.0.0.1');
    //Connection pool configuration
    $config->setGetObjectTimeout(3.0); //Set the timeout period for getting the connection pool object
    $config->setIntervalCheckTime(30*1000); //Set the detection connection to survive the cycle of recycling and creation
    $config->setMaxIdleTime(15); //Maximum idle time of the connection pool object (seconds)
    $config->setMaxObjectNum(20); //Set the maximum number of connection objects in the connection pool
    $config->setMinObjectNum(5); //Set the minimum connection pool to have the number of connected objects

    DbManager::getInstance()->addConnection(new Connection($config));
}
```

::: tip prompt
Detailed connection pool properties introduction [Click to view](/En/Pool/config.md)
:::



