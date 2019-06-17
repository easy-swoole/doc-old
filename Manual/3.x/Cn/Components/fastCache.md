# FastCache
EasySwoole 提供了一个快速缓存，是基础UnixSock通讯和自定义进程存储数据实现的，提供基本的缓存服务，本缓存为解决小型应用中，需要动不动就部署Redis服务而出现。

## 安装
```
composer require easyswoole/fast-cache
```
## 服务注册

我们在EasySwoole全局的事件中进行注册
```
use EasySwoole\FastCache\Cache;
Cache::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)->attachToServer(ServerManager::getInstance()->getSwooleServer());
```

## 客户端调用
服务启动后，可以在任意位置调用
```
use EasySwoole\FastCache\Cache;
Cache::getInstance()->set('get','a');
var_dump(Cache::getInstance()->get('get'));
```

## 支持方法列表
- public function setTempDir(string $tempDir): Cache
    > 设置临时目录
    
- public function setProcessNum(int $num): Cache
    > 设置缓存进程数
    
- public function setServerName(string $serverName): Cache
    > 设置缓存进程所在服务名
    
- public function setOnTick($onTick): Cache
    > 设置定时回调，可用于数据定时落地
    
- public function setTickInterval($tickInterval): Cache
    > 设置定时回调间隔
    
- public function setOnStart($onStart): Cache
    > 设置进程启动回调，可以用于数据落地恢复
    
- public function setOnShutdown(callable $onShutdown): Cache
    > 设置进程关闭回调，可以用于数据落地
    
- public function set($key, $value, ?int $ttl = null, float $timeout = 1.0)
- public function get($key, float $timeout = 1.0)
- public function unset($key, float $timeout = 1.0)
- public function keys($key = null, float $timeout = 1.0): ?array
- public function flush(float $timeout = 1.0)
- public function enQueue($key, $value, $timeout = 1.0)
- public function deQueue($key, $timeout = 1.0)
- public function queueSize($key, $timeout = 1.0)
- public function unsetQueue($key, $timeout = 1.0)
- public function queueList($timeout = 1.0): ?array
- public function flushQueue(float $timeout = 1.0): bool
- public function expire($key, int $ttl, $timeout = 1.0)
- public function persist($key, $timeout = 1.0)
    > 移除一个key的过期时间
        
- public function ttl($key, $timeout = 1.0)
