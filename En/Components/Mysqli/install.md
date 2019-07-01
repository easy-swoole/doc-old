## 安装  
安装命令:
```
composer require easyswoole/mysqli
```

### Configuration parameter

```php
/*################ MYSQL CONFIG ##################*/

'MYSQL' => [
//数据库配置
   'host'                 => '',//Database connection IP
   'user'                 => '',//Database username
   'password'             => '',//Database password
   'database'             => '',//Database
   'port'                 => '',//port
   'timeout'              => '30',//timeout
   'connect_timeout'      => '5',//Connection timeout
   'charset'              => 'utf8',//Character encoding
   'strict_type'          => false, //Open strict mode, returning fields will automatically be converted to digital types
   'fetch_mode'           => false,//Open fetch mode and use fetch/fetchAll line by line or get all result sets (version 4.0 or more) as PDO does.
   'alias'                => '',//Subquery aliases
   'isSubQuery'           => false,//Is it a subquery?
   'max_reconnect_times ' => '3',//Maximum number of reconnections
],
```
Adding or introducing in configuration files
### Call
```php
<?php
$conf = new \EasySwoole\Mysqli\Config(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL'));
$db = new Mysqli($conf);
$data = $db->get('test');//Get data from a table
```

### Cooperative connection pool
Because it is a cooperative state, different instances must be used for each request. If a request comes in, it will be new, the request logic will be destroyed, the connection will be created each time, and then destroyed. This will cost a lot, so we can use connection pool to reuse the connection.
[Cooperative Connection Pool Tutorial](./../mysqlPool.md);
[Concurrent connection pool demo](https://github.com/easy-swoole/demo/tree/3.x-pool);
