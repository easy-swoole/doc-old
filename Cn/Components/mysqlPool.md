    # Mysql-Pool

EasySwoole 提供了一个Mysql Pool组件，等于高度封装了Pool的链接管理器
## 安装
```
composer require easyswoole/mysqli-pool
```
> 该组件基于[pool管理器](../Components/Component/pool.md)封装

## 添加配置
```
'MYSQL'         => [
    'host'                 => '',
    'port'                 => 3306,
    'user'                 => '',
    'password'             => '',
    'database'             => '',
    'timeout'              => 30,
    'charset'              => 'utf8mb4',
    'connect_timeout'      => '5',//连接超时时间
],
```

## 主进程注册
一般滴，我们在EasySwoole的全局initialize 事件中，进行注册
```
use EasySwoole\EasySwoole\Config as GConfig;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Mysqli\Config;
$configData = GConfig::getInstance()->getConf('MYSQL');
$config = new Config($configData);
/**
    这里注册的名字叫mysql，你可以注册多个，比如mysql2,mysql3
*/
$poolConf = Mysql::getInstance()->register('mysql',$config);
//$poolConf->setMaxObjectNum($configData['maxObjectNum']);
//$poolConf->setMinObjectNum($configData['minObjectNum']);
```

## 服务启动后任意位置使用
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
    
    //原生获取方式，getobj和recycleObj必须成对使用
    $db =\EasySwoole\MysqliPool\Mysql::getInstance()->pool('mysql')->getObj();
    $data = $db->get('test');
    //回收
    \EasySwoole\MysqliPool\Mysql::getInstance()->pool('mysql')->recycleObj($db);

```

## 方法列表

EasySwoole\MysqliPool\Connection 实际上是Mysqli的子类，具体可以看 [mysqli](Mysqli/install.md)


## 原生实现

### 定义一个Pool对象

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


### 定义一个PoolObject对象

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

### Pool注册

我们在EasySwoole全局的mainServerCreate事件中进行注册
```
use use App\Utility\Pool\MysqlPool;
PoolManager::getInstance()->register(MysqlPool::class)
```

> 注册成功的时候，会返回一个PoolConf对象，你可以设置这个pool的最大最小连接数等其他信息

### Pool 调用
方法一
```
$db = MysqlPool::defer();
$db->rawQuery('select version()');
```
方法二

```
$data = MysqlPool::invoke(function (MysqlConnection $db){
    return $db->rawQuery('select version()');
});
```
方法三
```
$db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
$data = $db->get('test');
//使用完毕需要回收
PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
```

> 其余调用方法请看[pool管理器](../Components/Component/pool.md)章节