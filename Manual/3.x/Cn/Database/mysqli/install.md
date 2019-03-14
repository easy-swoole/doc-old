## 安装  
安装命令:
```
composer require easyswoole/mysqli
```

### 配置参数

```php
/*################ MYSQL CONFIG ##################*/

'MYSQL' => [
    'host'          => '192.168.75.1',
    'port'          => '3306',
    'user'          => 'root',
    'timeout'       => '5',
    'charset'       => 'utf8mb4',
    'password'      => 'root',
    'database'      => 'cry',
    'POOL_MAX_NUM'  => '20',
    'POOL_TIME_OUT' => '0.1',
],
```
在配置文件中增加或自行引入
### 调用
```php
<?php
$conf = new \EasySwoole\Mysqli\Config(\EasySwoole\EasySwoole\Config::getInstance()->getConf('MYSQL'));
$db = new Mysqli($conf);
$data = $db->get('test');//获取一个表的数据
```

### 协程连接池
由于是协程状态,每次请求进来都必须使用不同的实例,如果一个请求进来就new,完成请求逻辑就销毁,每次都会创建连接,然后销毁,这样开销会非常大,所以我们可以采用连接池方式,复用连接,
[协程连接池教程](../../CoroutinePool/mysql_pool.md);
