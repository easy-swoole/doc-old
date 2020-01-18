## redis错误处理
redis组件根据错误的级别,区分了2种错误信息

### 异常 
当redis连接失败,无法和redis服务通信时,将会抛出` EasySwoole\Redis\Exception\RedisException` 异常,例如配置错误:
```
PHP Fatal error:  Uncaught EasySwoole\Redis\Exception\RedisException: connect to redis host 127.0.0.1:6379 fail after retry 4 times in /www/easyswoole/tioncico_redis/src/Redis.php:2866
Stack trace:
#0 /www/easyswoole/tioncico_redis/src/Redis.php(579): EasySwoole\Redis\Redis->sendCommand(Array)
#1 /www/easyswoole/tioncico_redis/tests/test.php(17): EasySwoole\Redis\Redis->get('a')
#2 {main}
  thrown in /www/easyswoole/tioncico_redis/src/Redis.php on line 2866

```
我们只需要接管该异常即可.

### 错误
当redis 命令语法错误,授权错误时,redis客户端不会直接抛出异常,而是将返回false,需要通过 `$redis->getErrorMsg()` 来进行判断,例如:
```php
go(function () {

    $redisConfig = new \EasySwoole\Redis\Config\RedisConfig();
    $redisConfig->setAuth('easyswoole');

    $redis = new \EasySwoole\Redis\Redis($redisConfig);
    $data = $redis->rawCommand(['set','a','1','1']);//多了一个参数,redis将会报语法错误
    var_dump($redis->getErrorMsg());//redis错误信息
    var_dump($redis->getErrorType());//redis错误类型
    var_dump($redis->getLastSocketErrno());//tcp客户端错误号
    var_dump($redis->getLastSocketError());//tcp客户端错误信息
    var_dump($data);
});

```
输出:
```
string(16) "ERR syntax error"
string(3) "ERR"
int(0)
string(0) ""
bool(false)
```