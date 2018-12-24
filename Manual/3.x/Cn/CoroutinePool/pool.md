## 连接池组件
EasySwoole提供了连接池组件,可通过继承组件,实现mysql/redis连接池.  
```php
<?php
        PoolManager::getInstance()->register(MysqlPool::class, Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'))->getMinObjectNum('MYSQL.POOL_MIN_NUM');//注册连接池,以及配置连接池配置


 $redis = PoolManager::getInstance()->getPool(RedisPool::class)->getObj(Config::getInstance()->getConf('REDIS.POOL_TIME_OUT'));//获取连接池的一个对象
 

```

### PoolManager
连接池管理对象,实现了对连接池的注册,获取方法:
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/7/26
 * Time: 上午12:54
 */

namespace EasySwoole\Component\Pool;


use EasySwoole\Component\Singleton;

class PoolManager
{
    use Singleton;

    private $pool = [];


    function register(string $className, $maxNum = 20):?PoolConf
    {
       //注册一个连接池对象,以及新建一个带默认参数的连接池对象配置,并且返回它;
        $ref = new \ReflectionClass($className);
        if($ref->isSubclassOf(AbstractPool::class)){
            $conf = new PoolConf($className);
            $conf->setMaxObjectNum($maxNum);
            $this->pool[$this->generateKey($className)] = $conf;
            return $conf;
        }else{
            return null;
        }
    }

    /*
     * 请在进程克隆后，也就是worker start后，每个进程中独立使用
     */
    function getPool(string $className):?AbstractPool
    {
        //获取连接池对象,获取到之后即可通过返回的连接池对象去获取连接
        $key = $this->generateKey($className);
        if(isset($this->pool[$key])){
            $item = $this->pool[$key];
            if($item instanceof AbstractPool){
                return $item;
            }else if($item instanceof PoolConf){
                $className = $item->getClass();
                $obj = new $className($item);
                $this->pool[$key] = $obj;
                return $obj;
            }
        }
        return null;
    }

    private function generateKey(string $class):string
    {//序列化一个class便于存储
        return substr(md5($class), 8, 16);
    }
}
```

### AbstractPool接口
通过继承AbstractPool,实现createObject方法来创建一个连接池class:
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/10/26
 * Time: 7:23 PM
 */
namespace App\Utility\Pool;

use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\EasySwoole\Config;

class RedisPool extends AbstractPool
{
    //当调用连接池时,会调用该方法去创建连接对象
    protected function createObject()
    {
        // TODO: Implement createObject() method.
        $redis = new RedisObject();
        $conf = Config::getInstance()->getConf('REDIS');
        if( $redis->connect($conf['host'],$conf['port'])){
            if(!empty($conf['auth'])){
                $redis->auth($conf['auth']);
            }
            return $redis;
        }else{
            return null;
        }
    }
}
```
### PoolObjectInterface接口
通过实现PoolObjectInterface接口方法,去创建一个连接池对象class:
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/10/26
 * Time: 7:23 PM
 */

namespace App\Utility\Pool;


use EasySwoole\Component\Pool\PoolObjectInterface;
use Swoole\Coroutine\Redis;

class RedisObject extends Redis implements PoolObjectInterface
{
    function gc()
    {
        // TODO: Implement gc() method.
        $this->close();//当连接池彻底释放连接对象时,会调用gc方法,你可以在这里写关闭连接
    }

    function objectRestore()
    {
        //当连接池回收一个连接对象时,会调用objectRestore方法,你可以在这里重置连接对象的属性以及状态
        // TODO: Implement objectRestore() method.
    }

    function beforeUse(): bool
    {
        //当连接池对象使用getObj方法获取一个连接时,会调用该方法,你可以在这里实现一些前置操作
        // TODO: Implement beforeUse() method.
        return true;
    }
}
```
### PoolConf
PoolConf是在连接池注册时自动实例化并带有默认参数的对象:
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/12/4
 * Time: 12:05 PM
 */

namespace EasySwoole\Component\Pool;


class PoolConf
{
    protected $class;//当前连接池对象名称
    protected $intervalCheckTime = 30*1000;//定时验证对象是否可用的间隔时间
    protected $maxIdleTime = 15;//最大存活时间,超出则会每$intervalCheckTime/1000秒被释放
    protected $maxObjectNum = 20;//最大创建数量
    protected $minObjectNum = 5;//最小创建数量
    protected $getObjectTimeout = 0.5;//连接池对象获取连接对象时的等待时间

    protected $extraConf = [];//额外参数

    function __construct(string $class)
    {
        $this->class = $class;
    }

    /**
     * @return string
     */
    public function getClass(): string
    {
        return $this->class;
    }


    /**
     * @return float|int
     */
    public function getIntervalCheckTime()
    {
        return $this->intervalCheckTime;
    }

    /**
     * @param float|int $intervalCheckTime
     */
    public function setIntervalCheckTime($intervalCheckTime): void
    {
        $this->intervalCheckTime = $intervalCheckTime;
    }

    /**
     * @return int
     */
    public function getMaxIdleTime(): int
    {
        return $this->maxIdleTime;
    }

    /**
     * @param int $maxIdleTime
     */
    public function setMaxIdleTime(int $maxIdleTime): void
    {
        $this->maxIdleTime = $maxIdleTime;
    }

    /**
     * @return int
     */
    public function getMaxObjectNum(): int
    {
        return $this->maxObjectNum;
    }

    /**
     * @param int $maxObjectNum
     */
    public function setMaxObjectNum(int $maxObjectNum): void
    {
        $this->maxObjectNum = $maxObjectNum;
    }

    /**
     * @return float
     */
    public function getGetObjectTimeout(): float
    {
        return $this->getObjectTimeout;
    }

    /**
     * @param float $getObjectTimeout
     */
    public function setGetObjectTimeout(float $getObjectTimeout): void
    {
        $this->getObjectTimeout = $getObjectTimeout;
    }

    /**
     * @return array
     */
    public function getExtraConf(): array
    {
        return $this->extraConf;
    }

    /**
     * @param array $extraConf
     */
    public function setExtraConf(array $extraConf): void
    {
        $this->extraConf = $extraConf;
    }

    /**
     * @return int
     */
    public function getMinObjectNum(): int
    {
        return $this->minObjectNum;
    }

    /**
     * @param int $minObjectNum
     */
    public function setMinObjectNum(int $minObjectNum): void
    {
        $this->minObjectNum = $minObjectNum;
    }

}

```

### 具体使用例子:
1:通过上面的2个接口例子,实现```连接池对象```和```连接对象```

2:在```EasySwooleEvent.php```的initialize方法中注册连接池对象(注意命名空间):
```php
        // 注册mysql数据库连接池
        PoolManager::getInstance()->register(MysqlPool::class, Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'))->getMinObjectNum('MYSQL.POOL_MIN_NUM');

        // 注册redis连接池
        PoolManager::getInstance()->register(RedisPool::class, Config::getInstance()->getConf('REDIS.POOL_MAX_NUM'))->getMinObjectNum('MYSQL.POOL_MIN_NUM');
```
> 可通过register返回的PoolConf对象去配置其他参数

3:在worker(http控制器)进程调用(注意命名空间):
```php
<?php
$redis = PoolManager::getInstance()->getPool(RedisPool::class)->getObj(Config::getInstance()->getConf('REDIS.POOL_TIME_OUT'));
$redis->set('name', 'blank');
$name = $redis->get('name');
$this->response()->write($name);
//用完记得释放:
  PoolManager::getInstance()->getPool(RedisPool::class)->recycleObj($this->redis);
```
> 具体使用例子,可查看[demo](https://github.com/easy-swoole/demo)

### invoke方法
可通过`invoke`静态方法直接从连接池取出一个连接,直接使用,回调函数结束后自动回收(注意命名空间),控制器代码:
```php
<?php
try {
    $result = RedisPool::invoke(function(RedisObject $redis) {
            $name = $redis->get('name');
            return $name;
        });
    $this->writeJson(Status::CODE_OK, $result);
} catch (\Throwable $throwable) {
    $this->writeJson(Status::CODE_BAD_REQUEST, null, $throwable->getMessage());
}
```

### 预创建链接

新增preload方法(keepMin方法别名),可在程序启动后预创建连接,避免在启动时突然大量请求,造成连接来不及创建从而失败的问题.
示例:
在EasySwooleEvent文件,mainServerCreate事件中增加onWorkerStart回调事件中预热启动:
```php
//注册onWorkerStart回调事件
public static function mainServerCreate(EventRegister $register)
{
    $register->add($register::onWorkerStart, function (\swoole_server $server, int $workerId) {
    if ($server->taskworker == false) {
        PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(5);
        //PoolManager::getInstance()->getPool(RedisPool::class)->preLoad(预创建数量,必须小于连接池最大数量);
    }

    // var_dump('worker:' . $workerId . 'start');
    });
}
```

> 当连接池对象被实例化之后,每隔30秒($intervalCheckTime默认值)会将15秒($maxIdleTime默认值)未使用的连接彻底释放,并执行一次keepMin方法重新创建5个($minObjectNum默认值)连接对象.确保连接对象不被超时自动关闭

