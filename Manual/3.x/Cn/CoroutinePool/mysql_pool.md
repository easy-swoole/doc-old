## Mysql协程连接池

> 参考Demo: [Pool连接池](https://github.com/easy-swoole/demo/blob/3.x/App/Utility/Pool/)

demo中有封装好的mysql连接池以及mysql类，复制demo中的MysqlPool.php和MysqlObject.php并放入App/Utility/Pool中即可使用

### 添加数据库配置
在env中添加配置信息：
```dotenv
################ DATABASE CONFIG ##################

MYSQL.host = 127.0.0.1          // 数据库地址
MYSQL.port = 3306               // 数据库端口
MYSQL.user = root               // 数据库用户名   
MYSQL.timeout = 5
MYSQL.charset = utf8mb4         
MYSQL.password = root           // 数据库密码
MYSQL.database = easyswoole     // 数据库库名
MYSQL.POOL_MAX_NUM = 4
MYSQL.POOL_TIME_OUT = 0.1
```
在EasySwooleEvent初始化事件initialize注册该连接池
```php
// 注册mysql数据库连接池

PoolManager::getInstance()->register(MysqlPool::class, Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'));
```

### 注意
连接池不是跨进程的，进程间的连接池连接数是相互独立的，默认最大值是10个；如果开了4个worker，最大连接数可以达到40个。

### 使用

通过mysql连接池获取mysql操作对象

```php
$db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj(Config::getInstance()->getConf('MYSQL.POOL_TIME_OUT'));
```

用完mysql连接池对象之后记得用recycleObj回收

```php
PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
```

可通过`invoke`静态方法直接从连接池取出一个连接,直接使用,回调函数结束后自动回收:
```php
<?php
try {
    MysqlPool::invoke(function (MysqlObject $mysqlObject) {
        $model = new UserModel($mysqlObject);
        $model->insert(new UserBean($this->request()->getRequestParam()));
    });
} catch (\Throwable $throwable) {
    $this->writeJson(Status::CODE_BAD_REQUEST, null, $throwable->getMessage());
}catch (PoolEmpty $poolEmpty){
    $this->writeJson(Status::CODE_BAD_REQUEST, null, '没有链接可用');

}catch (PoolUnRegister $poolUnRegister){
    $this->writeJson(Status::CODE_BAD_REQUEST, null, '连接池未注册');
}
```
