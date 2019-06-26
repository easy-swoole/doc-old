## 安装  
安装命令:
```
composer require easyswoole/mysqli
```

### 配置参数

```php
/*################ MYSQL CONFIG ##################*/

'MYSQL' => [
//数据库配置
   'host'                 => '',//数据库连接ip
   'user'                 => '',//数据库用户名
   'password'             => '',//数据库密码
   'database'             => '',//数据库
   'port'                 => '',//端口
   'timeout'              => '30',//超时时间
   'connect_timeout'      => '5',//连接超时时间
   'charset'              => 'utf8',//字符编码
   'strict_type'          => false, //开启严格模式，返回的字段将自动转为数字类型
   'fetch_mode'           => false,//开启fetch模式, 可与pdo一样使用fetch/fetchAll逐行或获取全部结果集(4.0版本以上)
   'alias'                => '',//子查询别名
   'isSubQuery'           => false,//是否为子查询
   'max_reconnect_times ' => '3',//最大重连次数
],
```
在配置文件中增加或自行引入
### 调用
```php
<?php
$conf = new \EasySwoole\Mysqli\Config(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL'));
$db = new \EasySwoole\Mysqli\Mysqli($conf);
$data = $db->get('test');//获取一个表的数据
```

### 协程连接池
由于是协程状态,每次请求进来都必须使用不同的实例,如果一个请求进来就new,完成请求逻辑就销毁,每次都会创建连接,然后销毁,这样开销会非常大,所以我们可以采用连接池方式,复用连接,
[协程连接池教程](./../mysqlPool.md);
[协程连接池demo](https://github.com/easy-swoole/demo/tree/3.x-pool);
