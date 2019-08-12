# FastCache
EasySwoole provides a fast cache, which is based on UnixSock communication and customized process storage data. It provides basic caching services to solve the problem of redeploying redis services.

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

> FastCache can only be used after the service is started. It needs the right to create UNIX sock (vm, docker or Linux system development is recommended). Virtual machine shared directory folder can not create UNIX sock monitor.

## Client Call
After the service is started, it can be invoked anywhere
```
use EasySwoole\FastCache\Cache;
Cache::getInstance()->set('get','a');
var_dump(Cache::getInstance()->get('get'));
```

## List of supporting methods
- public function setTempDir(string $tempDir): Cache
    > Setting Temporary Directory
    
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




### Landing Restart Recovery Data Scheme

FastCache provides three methods for data landing and restart recovery. In the `mainServerCreate` callback event in `EasySwooleEvent.php`, set the following methods:

> Setting callbacks before registering the cache service, Callback events cannot be changed after registering the service. 

```php
<?php

use EasySwoole\FastCache\Cache;
use EasySwoole\FastCache\CacheProcessConfig;
use EasySwoole\FastCache\SyncData;
use EasySwoole\Utility\File;

// Save the data back to the file every five seconds
Cache::getInstance()->setTickInterval(5 * 1000);//Setting timing frequency
Cache::getInstance()->setOnTick(function (SyncData $SyncData, CacheProcessConfig $cacheProcessConfig) {
    $data = [
        'data'  => $SyncData->getArray(),
        'queue' => $SyncData->getQueueArray(),
        'ttl'   => $SyncData->getTtlKeys(),
    ];
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    File::createFile($path,serialize($data));
});

// Rewrite saved files at startup
Cache::getInstance()->setOnStart(function (CacheProcessConfig $cacheProcessConfig) {
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    if(is_file($path)){
        $data = unserialize(file_get_contents($path));
        $syncData = new SyncData();
        $syncData->setArray($data['data']);
        $syncData->setQueueArray($data['queue']);
        $syncData->setTtlKeys(($data['ttl']));
        return $syncData;
    }
});

// In daemon, php easyswoole stop is called, landing data
Cache::getInstance()->setOnShutdown(function (SyncData $SyncData, CacheProcessConfig $cacheProcessConfig) {
    $data = [
        'data'  => $SyncData->getArray(),
        'queue' => $SyncData->getQueueArray(),
        'ttl'   => $SyncData->getTtlKeys(),
    ];
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    File::createFile($path,serialize($data));
});

Cache::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)->attachToServer(ServerManager::getInstance()->getSwooleServer());

```

## Message queue support

