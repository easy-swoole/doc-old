## 连接池组件
EasySwoole在基础组件中集合了连接池组件,增加mysql/redis等i/o连接的复用性,命名空间为:`EasySwoole\Component\Pool`
demo地址:(https://github.com/easy-swoole/demo/tree/3.x-pool)
> 在新版本中,实现了连接池自动回收,自动注册,匿名连接池注册,以及本身的底层异常处理
> 使得用户在使用连接池时,可做到直接使用,无需注册,无需回收(通过defer和invoke实现自动回收),也不会出现问题

### PoolManager 
连接池管理工具,提供了以下方法:
````php
<?php
/**
 * 获取连接池默认配置
 * getDefaultConfig
 * @author Tioncico
 * Time: 20:34
 */
function getDefaultConfig(){}
/**
 * 注册连接池
 * register
 * @param string $className
 * @param int $maxNum 最大连接数量
 * @author Tioncico
 * Time: 20:34
 */
function register(string $className, $maxNum = 20){}
/**
 * 注册匿名连接池
 * registerAnonymous
 * @param string $name
 * @param callable|null $createCall
 * @author Tioncico
 * Time: 20:35
 */
function registerAnonymous(string $name,?callable $createCall = null){}
/**
 * 获取连接池的一个连接对象
 * getPool
 * @param $key
 * @author Tioncico
 * Time: 20:36
 */
function getPool($key){}
````
### AbstractPool 
连接池实现接口,通过继承连接池实现接口,来创建一个连接池,例:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/5 0005
 * Time: 20:42
 */

namespace App\Utility\Pool;

use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\Mysqli\Config;
use EasySwoole\Mysqli\Mysqli;

class MysqlPool extends AbstractPool
{
    protected function createObject()
    {
        //当连接池第一次获取连接时,会调用该方法
        //我们需要在该方法中创建连接
        //返回一个对象实例
        //必须要返回一个实现了AbstractPoolObject接口的对象
        $conf = \EasySwoole\EasySwoole\Config::getInstance()->getConf("MYSQL");
        $dbConf = new Config($conf);
        return new MysqlObject($dbConf);
        // TODO: Implement createObject() method.
    }
}

````
方法如下:
````php
<?php
abstract protected function createObject(){};//当获取连接池对象时并未达到最大连接数时会调用此方法创建连接池对象
public function recycleObj($obj){};//释放一个连接池对象
public function getObj(float $timeout = null, int $beforeUseTryTimes = 3){};//获取一个连接池对象 
public function unsetObj($obj){};//彻底释放一个连接池对象 /关闭连接
public function gcObject(int $idleTime){};//清理超时连接
protected function intervalCheck(){};//定时调用清理超时连接以及新创建连接逻辑
public function keepMin(?int $num = null){};//保持最小连接,当不够时创建
public function preLoad(?int $num = null){};//热启动,keepMin的别名
public function getConfig(){};//获取当前连接池配置
public function status(){};//获取当前连接池状态
public function isPoolObject($obj){};//判断连接是否为该连接池创建
public function isInPool($obj){};//获取该连接是否存在该连接池中(使用了则不存在)
````

### PoolObjectInterface
通过实现PoolObjectInterface接口,去创建一个连接池对象,例如
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/5 0005
 * Time: 20:42
 */


namespace App\Utility\Pool;

use EasySwoole\Component\Pool\PoolObjectInterface;
use EasySwoole\Mysqli\Mysqli;

class MysqlObject extends Mysqli implements PoolObjectInterface
{
    /**
     * 释放对象时调用
     * gc
     * @author Tioncico
     * Time: 20:49
     */
    function gc()
    {
        // 重置为初始状态
        $this->resetDbStatus();
        // 关闭数据库连接
        $this->getMysqlClient()->close();
    }

    /**
     * 回收对象时会调用
     * objectRestore
     * @author Tioncico
     * Time: 20:49
     */
    function objectRestore()
    {
        // 重置为初始状态
        $this->resetDbStatus();
    }

    /**
     * 每个链接使用之前 都会调用此方法 请返回 true / false
     * 返回false时PoolManager会回收该链接 并重新进入获取链接流程
     * @return bool 返回 true 表示该链接可用 false 表示该链接已不可用 需要回收
     */
    function beforeUse(): bool
    {
        // 此处可以进行链接是否断线的判断 使用不同的数据库操作类时可以根据自己情况修改
        return $this->getMysqlClient()->connected;
    }
}
````

### 连接池配置
连接池有以下配置,可通过`PoolConf.php`进行设置和查看 
````php
<?php
$intervalCheckTime = 30*1000;//定时验证对象是否可用以及保持最小连接的间隔时间
$maxIdleTime = 15;//最大存活时间,超出则会每$intervalCheckTime/1000秒被释放
$maxObjectNum = 20;//最大创建数量
$minObjectNum = 5;//最小创建数量 最小创建数量不能大于等于最大创建数量,否则报错 每$intervalCheckTime/1000秒去判断最小连接数
$getObjectTimeout = 3.0;
$extraConf = [];//连接池对象获取连接对象时的等待时间
````
### 具体使用例子:
1、通过上面的2个接口例子,实现```连接池对象```和```连接对象``` 

2、在```EasySwooleEvent.php```的initialize方法中注册连接池对象(注意命名空间,新版本可以无需注册,自动注册)
```php
// 注册mysql数据库连接池
PoolManager::getInstance()->register(MysqlPool::class,Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'));
//注册之后会返回conf配置,可继续配置,如果返回null代表注册失败
```
> 可通过register返回的PoolConf对象去配置其他参数

3、服务启动后即可在任意位置调用
```
$db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
$data = $db->get('test');
//使用完毕需要回收
PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
```
> 直接getobj时,可能会出现没有连接(返回null)的情况,需要增加判断，而用户没有注册连接池时,直接getPoo也可直接自动注册并使用连接

### 自动回收
在 `AbstractPool`中,use了`EasySwoole\Component\Pool\TraitInvoker`的`invoke`方法,通过invoke方法,可直接在闭包中操作连接池连接,执行完自动回收,例如
````php
$data = MysqlPool::invoke(function ( MysqlObject $db){
   $data = $db->get('test');
   return $data;
});
````
> 异常拦截,当invoke调用,内部发生(连接不够,连接对象错误)等异常情况时,会抛出PoolEmpty和PoolException,可在控制器基类拦截或直接忽略,EasySwoole内部有做异常拦截处理,将直接拦截并返回错误到前端.

在 `AbstractPool`中,use了`EasySwoole\Component\Pool\TraitInvoker`的`defer`方法,通过defer方法,在当前协程执行完毕时,将自动回收连接,但不适用于匿名连接池。

### 预创建连接/热启动
在之前情况时,如果你重启EasySwoole,由于连接池对象是懒惰加载(只在调用时才创建连接),会导致当在一启动EasySwoole,访问量却很大时造成瞬间过大的压力,所以EasySwoole连接池组件提供了热启动.
在`EasySwooleEvent`文件,`mainServerCreate`事件中增加`onWorkerStart`回调事件中预热启动:
```php
<?php 
//注册onWorkerStart回调事件
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart, function (\swoole_server $server, int $workerId) {
        if ($server->taskworker == false) {
            //每个worker进程都预创建连接
            PoolManager::getInstance()->getPool(MysqlPool::class)->preLoad(5);//最小创建数量
        }
    });
}
```
> 当连接池对象被实例化之后,每隔30秒($intervalCheckTime默认值)会将15秒($maxIdleTime默认值)未使用的连接彻底释放,并执行一次keepMin方法重新创建5个($minObjectNum默认值)连接对象.确保连接对象不被超时自动关闭

### 创建匿名连接池
当你不想新建文件实现 连接池 或者不想实现 连接池对象时,可通过`registerAnonymous`创建匿名连接池,例如:

在```EasySwooleEvent.php```的initialize方法中注册连接池对象

````php
PoolManager::getInstance()->registerAnonymous('mysql',function (){
    $conf = \EasySwoole\EasySwoole\Config::getInstance()->getConf("MYSQL");
    $dbConf = new Config($conf);
    return new Mysqli($dbConf);
});
````
使用：
````php
$db = PoolManager::getInstance()->getPool('mysql')->getObj();
$data = $db->get('test');
PoolManager::getInstance()->getPool('mysql')->recycleObj($db);
````
> 

