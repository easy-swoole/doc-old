## TP ORM使用问题
由于swoole 是在常驻内存+协程环境下运行的,使用TP ORM 时,TP ORM自带了很多静态变量,将会出现问题,具体分析如下:  

### 非协程常驻内存模式
在同步,非协程模式下,一个worker在一个时间内只处理一个请求,到max_request时也将重启进程,可以勉强操作sql,但是以下静态变量会出现问题:
#### think\Db 静态变量:
```php
protected static $config = [];
//数据库配置,几乎没有影响

protected static $query;
//查询类名,没有影响

protected static $queryMap = [
    'mongo' => '\\think\\db\Mongo',
];
//查询类自动映射,没有影响

public static $queryTimes = 0;
//数据库查询次数
//常驻内存下是全局查询次数

public static $executeTimes = 0;
//执行次数
//常驻内存下其实是全局执行执行次数

protected static $cacheHandler;
//缓存对象,没有影响

```
#### think\Model 静态变量:
```
protected static $initialized = [];
//初始化过的模型.
//原本作用：确保一个模型类中的init方法在一次请求中只被执行一次
//常驻内存下：一个模型只在第一次请求时执行该方法，后续请求不再执行，极有可能会造成bug

protected static $readMaster;
//是否从主库读取数据
//几乎没有影响

```

#### think\db\Connection 静态变量:
```
protected static $instance = [];
//PDO操作实例
//建立的连接管理实例
//协程模式，高并发下可能会导致数据库操作bug

protected static $event = [];
//监听回调
//原本作用：给模型设置的事件回调
//常驻内存下：随着运行时间不断增加将不断增加运行内存，一次请求增加的事件将影响到另外一次请求

protected static $info = [];
// 数据表信息
// 几乎没有影响

protected static $log = [];
// 数据库日志
// 原本作用: 记录一个请求的所有日志操作
// 常驻内存: 随着数据库的不断操作,会使该变量不断增加,会造成内存溢出

```
#### think\db\Query 静态变量:
```
protected static $connections = [];
// 数据库Connection对象
// 暂时没发现使用的地方

private static $event = [];
//回调事件
//原本作用:一次请求下,设置自身的回调事件
//常驻内存下：一次请求增加的事件将影响到另外一次请求

private static $extend = [];
//扩展查询方法
//几乎没有影响

private static $readMaster = [];
//需要读取主库的表
//原本作用：设置某一个或者全部模型是否从主库读取数据
//常驻内存下：如果在一个请求执行了Query::readMaster()方法，Query::$readMaster不会释放，将会影响到其他请求

```
#### think\Db\ModelEvent 静态变量:
```
private static $event = [];
// 回调事件
//原本作用：给模型设置的事件回调
//常驻内存下：随着运行时间不断增加将不断增加运行内存，一次请求增加的事件将影响到另外一次请求

protected static $observe = ['before_write', 'after_write', 'before_insert', 'after_insert', 'before_update', 'after_update', 'before_delete', 'after_delete', 'before_restore', 'after_restore'];
//模型事件观察
//没有影响

```

### 协程常驻内存模式
在协程模式下,多个客户端共用一个数据库连接,将会出现数据库操作异常问题,
例如:
* 用户A访问业务A,数据库开启事务->支付逻辑->完成事务
* 用户B同时访问业务B,插入n条数据
* 用户C同时访问业务A,数据库开启事务->支付逻辑->逻辑出错,回滚

在这个逻辑中,由于都是共享一个数据库操作,并且受协程切换影响,数据库执行步骤可能会变为:
用户A数据库开启事务->用户B插入n条数据->用户C开启事务->用户A支付逻辑->用户C支付逻辑->用户C逻辑错误,回滚事务->用户A完成事务  
当数据库这样执行时,用户A,B,C的所有数据库操作都将回滚,但是前端可能却会返回成功.  

同样,由于静态变量共用,其他回调事件等问题同样存在
