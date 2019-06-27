# FastCache
EasySwoole provides a fast cache, which is based on UnixSock communication and customized process storage data. It provides basic caching services. This cache appears to solve the problem of frequent deployment of Redis services in small applications.
## Install
```
composer require easyswoole/fast-cache
```
## Service registration

We register in EasySwoole global events

```
use EasySwoole\FastCache\Cache;
Cache::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)->attachToServer(ServerManager::getInstance()->getSwooleServer());
```

## Client call

After the service is started, it can be invoked anywhere

```
use EasySwoole\FastCache\Cache;
Cache::getInstance()->set('get','a');
var_dump(Cache::getInstance()->get('get'));
```

## List of supported methods

- public function setTempDir(string $tempDir): Cache
    > Setting temporary directory
    
- public function setProcessNum(int $num): Cache
    > Setting the number of cached processes
    
- public function setServerName(string $serverName): Cache
    > Set the name of the service where the cache process is located
    
- public function setOnTick($onTick): Cache
    > Setting a timing callback can be used for data timing landing
    
- public function setTickInterval($tickInterval): Cache
    > Set the timing callback interval
    
- public function setOnStart($onStart): Cache
    > Setting up the process start callback can be used for data landing recovery
    
- public function setOnShutdown(callable $onShutdown): Cache
    > Setting process shutdown callback can be used for data landing
    
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
    > The expiration time of removing a key
        
- public function ttl($key, $timeout = 1.0)
