<head>
     <title>EasySwoole  connection pool|swoole  connection pool|swoole mysql connection pool|PHP connection pool</title>
     <meta name="keywords" content="EasySwoole  connection pool|swoole  connection pool|swoole mysql connection pool|PHP connection pool"/>
     <meta name="description" content="EasySwoole  connection pool|swoole  connection pool|swoole mysql connection pool|PHP connection pool"/>
</head>
---<head>---

# Mysql-Pool
EasySwoole provides a Mysql Pool component, which is equivalent to a highly encapsulated link manager for Pool.
## Install
```
composer require easyswoole/mysqli-pool
```

> The component is encapsulated based on [pool manager](../Components/Component/pool.md)

## Add Configuration
```
'MYSQL'         => [
    'host'                 => '',
    'port'                 => 3306,
    'user'                 => '',
    'password'             => '',
    'database'             => '',
    'timeout'              => 30,
    'charset'              => 'utf8mb4',
    'connect_timeout'      => '5',//Connection timeout
],
```

## Main process registration
Normally, we register in the global initialize event in EasySwoole
```
use EasySwoole\EasySwoole\Config as GConfig;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Mysqli\Config;
$configData = GConfig::getInstance()->getConf('MYSQL');
$config = new Config($configData);
/**
    The name of registration here is mysql. You can register more than one, such as mysql2, mysql3.
*/
$poolConf = Mysql::getInstance()->register('mysql',$config);
//$poolConf->setMaxObjectNum($configData['maxObjectNum']);
//$poolConf->setMinObjectNum($configData['minObjectNum']);
```

## Use anywhere after service starts
```
 /** @var \EasySwoole\MysqliPool\Connection $db */
    $db = \EasySwoole\MysqliPool\Mysql::getInstance()->pool('mysql')::defer();
    var_dump($db->rawQuery('select version()'));
    $db = \EasySwoole\MysqliPool\Mysql::defer('mysql');
    var_dump($db->rawQuery('select version()'));
    
    
    $data = \EasySwoole\MysqliPool\Mysql::invoker('mysql',function (\EasySwoole\MysqliPool\Connection $db){
        return $db->rawQuery('select version()');
    });
    $data = \EasySwoole\MysqliPool\Mysql::getInstance()->pool('mysql')::invoke(function (\EasySwoole\MysqliPool\Connection $db){
        return $db->rawQuery('select version()');
    });
    
    //Native access, getobj and recycleObj must be used in pairs
    $db =\EasySwoole\MysqliPool\Mysql::getInstance()->pool('mysql')->getObj();
    $data = $db->get('test');
    //recovery
    \EasySwoole\MysqliPool\Mysql::getInstance()->pool('mysql')->recycleObj($db);

```

## Method List

EasySwoole\MysqliPool\Connection It's actually a subclass of Mysqli, which you can see  [mysqli](Mysqli/install.md)


## Native Realization

### Define a Pool object

```
namespace App\Utility\Pool;


use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\EasySwoole\Config;

class MysqlPool extends AbstractPool
{

    protected function createObject()
    {
        // TODO: Implement createObject() method.
        $conf = Config::getInstance()->getConf('MYSQL');
        $dbConf = new \EasySwoole\Mysqli\Config($conf);
        return new MysqlConnection($dbConf);
    }
}
```


### Define a PoolObject object

```
namespace App\Utility\Pool;


use EasySwoole\Component\Pool\PoolObjectInterface;
use EasySwoole\Mysqli\Mysqli;

class MysqlConnection extends Mysqli implements PoolObjectInterface
{

    function gc()
    {
        $this->resetDbStatus();
        $this->getMysqlClient()->close();
    }

    function objectRestore()
    {
        $this->resetDbStatus();
    }

    function beforeUse(): bool
    {
        return $this->getMysqlClient()->connected;
    }
}
```

### Pool register

We register in the EasySwoole global mainServerCreate event
```
use use App\Utility\Pool\MysqlPool;
PoolManager::getInstance()->register(MysqlPool::class)
```

> When registration is successful, a PoolConf object is returned. You can set the maximum and minimum number of connections for this pool and other information.

### Pool call
Method 1
```
$db = MysqlPool::defer();
$db->rawQuery('select version()');
```
Method 2

```
$data = MysqlPool::invoke(function (MysqlConnection $db){
    return $db->rawQuery('select version()');
});
```
Method 3
```
$db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
$data = $db->get('test');
//Recycling after use
PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
```

> See [pool manager](../Components/Component/pool.md) for the rest of the invocation methods