---
title: FastCache
meta:
  - name: description
    content: 利用swoole自定义进程实现简单的本机缓存
  - name: keywords
    content:  EasySwoole FastCache|swoole 缓存|swoole 跨进程缓存
---

# FastCache
EasySwoole 提供了一个快速缓存，是基础UnixSock通讯和自定义进程存储数据实现的，提供基本的缓存服务，本缓存为解决小型应用中，需要动不动就部署Redis服务而出现。

## 安装
```
composer require easyswoole/fast-cache
```
## 服务注册

我们在EasySwoole全局的事件中进行注册
```php
use EasySwoole\FastCache\Cache;
Cache::getInstance()->setTempDir(EASYSWOOLE_TEMP_DIR)->attachToServer(ServerManager::getInstance()->getSwooleServer());
```


::: warning 
 FastCache只能在服务启动之后使用,需要有创建unix sock权限(建议使用vm,docker或者linux系统开发),虚拟机共享目录文件夹是无法创建unix sock监听的
:::

## 客户端调用
服务启动后，可以在任意位置调用
```php
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




### 落地重启恢复数据方案

FastCache提供了3个方法,用于数据落地以及重启恢复,在`EasySwooleEvent.php`中的`mainServerCreate`回调事件中设置以下方法:


::: warning 
 设置回调要在注册cache服务之前，注册服务之后不能更改回调事件。 
:::

```php
<?php

use EasySwoole\FastCache\Cache;
use EasySwoole\FastCache\CacheProcessConfig;
use EasySwoole\FastCache\SyncData;
use EasySwoole\Utility\File;

// 每隔5秒将数据存回文件
Cache::getInstance()->setTickInterval(5 * 1000);//设置定时频率
Cache::getInstance()->setOnTick(function (SyncData $SyncData, CacheProcessConfig $cacheProcessConfig) {
    $data = [
        'data'  => $SyncData->getArray(),
        'queue' => $SyncData->getQueueArray(),
        'ttl'   => $SyncData->getTtlKeys(),
	 // queue支持
        'jobIds'     => $SyncData->getJobIds(),
        'readyJob'   => $SyncData->getReadyJob(),
        'reserveJob' => $SyncData->getReserveJob(),
        'delayJob'   => $SyncData->getDelayJob(),
        'buryJob'    => $SyncData->getBuryJob(),
    ];
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    File::createFile($path,serialize($data));
});

// 启动时将存回的文件重新写入
Cache::getInstance()->setOnStart(function (CacheProcessConfig $cacheProcessConfig) {
    $path = EASYSWOOLE_TEMP_DIR . '/FastCacheData/' . $cacheProcessConfig->getProcessName();
    if(is_file($path)){
        $data = unserialize(file_get_contents($path));
        $syncData = new SyncData();
        $syncData->setArray($data['data']);
        $syncData->setQueueArray($data['queue']);
        $syncData->setTtlKeys(($data['ttl']));
        // queue支持
        $syncData->setJobIds($data['jobIds']);
        $syncData->setReadyJob($data['readyJob']);
        $syncData->setReserveJob($data['reserveJob']);
        $syncData->setDelayJob($data['delayJob']);
        $syncData->setBuryJob($data['buryJob']);
        return $syncData;
    }
});

// 在守护进程时,php easyswoole stop 时会调用,落地数据
Cache::getInstance()->setOnShutdown(function (SyncData $SyncData, CacheProcessConfig $cacheProcessConfig) {
    $data = [
        'data'  => $SyncData->getArray(),
        'queue' => $SyncData->getQueueArray(),
        'ttl'   => $SyncData->getTtlKeys(),
         // queue支持
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

## 消息队列支持

