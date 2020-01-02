---
title: FastCache
meta:
  - name: description
    content: Implement a simple native cache with the swoole custom process
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole FastCache|swoole cache|swoole cross-process cache
---

# FastCache
EasySwoole provides a fast cache, which is implemented by the basic UnixSock communication and custom process storage data, and provides basic cache service. This cache appears to solve the small application and needs to deploy Redis service.

## Installation
```
composer require easyswoole/fast-cache
```
## Service Registration

We register in the event of EasySwoole global
```php
Use EasySwoole\FastCache\Cache;
Cache::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)->attachToServer(ServerManager::getInstance()->getSwooleServer());
```


::: warning
  FastCache can only be used after the service is started. It needs to create Unix sock permission (recommended to use vm, docker or linux system development). The virtual machine shared directory folder cannot create Unix sock listener.
:::

## Client call
Can be called anywhere after the service is started
```php
use EasySwoole\FastCache\Cache;
Cache::getInstance()->set('get','a');
var_dump(Cache::getInstance()->get('get'));
```

## Support Method List
- public function setTempDir(string $tempDir): Cache
     > Setting up a temporary directory
    
- public function setProcessNum(int $num): Cache
     > Set the number of cache processes
    
- public function setServerName(string $serverName): Cache
     > Set the service name of the cache process
    
- public function setOnTick($onTick): Cache
     > Set timing callback, which can be used for data timing landing
    
- public function setTickInterval($tickInterval): Cache
     > Set the timing callback interval
    
- public function setOnStart($onStart): Cache
     > Set process startup callback, which can be used for data landing recovery
    
- public function setOnShutdown(callable $onShutdown): Cache
     > Set process close callback, can be used for data landing
    
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
    > Remove the expiration time of a key
        
- public function ttl($key, $timeout = 1.0)

- function hSet($key, $field, $value, float $timeout = 1.0)

- function hGet($key, $field = null, float $timeout = 1.0)

- function hDel($key, $field = null, float $timeout = 1.0)

- function hFlush(float $timeout = 1.0)

- function hKeys($key, float $timeout = 1.0)

- function hScan($key, $cursor = 0, $limit = 10, float $timeout = 1.0)

- function hSetnx($key, $field, $value, float $timeout = 1.0)

- function hExists($key, $field, float $timeout = 1.0)

- function hLen($key, float $timeout = 1.0)

- function hIncrby($key, $field, $value, float $timeout = 1.0)

- function hMset($key, $fieldValues, float $timeout = 1.0)

- function hMget($key, $fields, float $timeout = 1.0)

- function hVals($key, float $timeout = 1.0)

- function hGetAll($key, float $timeout = 1.0)




### Landing restart recovery data plan

FastCache provides three methods for data landing and restart recovery. Set the following method in the `mainServerCreate` callback event in `EasySwooleEvent.php`:


::: warning
  Setting callbacks You must not change the callback event after registering the service before registering the cache service. 
:::

```php
<?php

use EasySwoole\FastCache\Cache;
use EasySwoole\FastCache\CacheProcessConfig;
use EasySwoole\FastCache\SyncData;
use EasySwoole\Utility\File;

// Save data back to file every 5 seconds
Cache::getInstance()->setTickInterval(5 * 1000);//Set timing frequency
Cache::getInstance()->setOnTick(function (SyncData $SyncData, CacheProcessConfig $cacheProcessConfig) {
    $data = [
        'data'  => $SyncData->getArray(),
        'queue' => $SyncData->getQueueArray(),
        'ttl'   => $SyncData->getTtlKeys(),
	 // Queue support
        'jobIds'     => $SyncData->getJobIds(),
        'readyJob'   => $SyncData->getReadyJob(),
        'reserveJob' => $SyncData->getReserveJob(),
        'delayJob'   => $SyncData->getDelayJob(),
        'buryJob'    => $SyncData->getBuryJob(),
    ];
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    File::createFile($path,serialize($data));
});

// Rewrite the file that was saved back at startup
Cache::getInstance()->setOnStart(function (CacheProcessConfig $cacheProcessConfig) {
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    if(is_file($path)){
        $data = unserialize(file_get_contents($path));
        $syncData = new SyncData();
        $syncData->setArray($data['data']);
        $syncData->setQueueArray($data['queue']);
        $syncData->setTtlKeys(($data['ttl']));
        // Queue support
        $syncData->setJobIds($data['jobIds']);
        $syncData->setReadyJob($data['readyJob']);
        $syncData->setReserveJob($data['reserveJob']);
        $syncData->setDelayJob($data['delayJob']);
        $syncData->setBuryJob($data['buryJob']);
        return $syncData;
    }
});

// In the daemon process, php easyswoole stop will be called, landing data
Cache::getInstance()->setOnShutdown(function (SyncData $SyncData, CacheProcessConfig $cacheProcessConfig) {
    $data = [
        'data'  => $SyncData->getArray(),
        'queue' => $SyncData->getQueueArray(),
        'ttl'   => $SyncData->getTtlKeys(),
         // Queue support
        'jobIds'     => $SyncData->getJobIds(),
        'readyJob'   => $SyncData->getReadyJob(),
        'reserveJob' => $SyncData->getReserveJob(),
        'delayJob'   => $SyncData->getDelayJob(),
        'buryJob'    => $SyncData->getBuryJob(),
    ];
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    File::createFile($path,serialize($data));
});

Cache::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)->attachToServer(ServerManager::getInstance()->getSwooleServer());

```

## Message Queue Support

