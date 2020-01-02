---
title: Memcache coroutine client
meta:
  - name: description
    content: Memcache coroutine client, implemented by swoole coroutine client 
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole memcache| Swoole Memcache coroutine client
---
## Memcache coroutine client
Memcache coroutine client, implemented by swoole coroutine client   
Github address: https://github.com/easy-swoole/memcache 

## Composer installation   
```php
composer require easyswoole/memcache
```

## Use the client (requires a coroutine environment): 
```php
$config = new \EasySwoole\Memcache\Config([
    'host' => '127.0.0.1',
    'port' => 11211
]);
$client = new EasySwoole\Memcache\Memcache($config);
```

## Example of use: 
```php
$config = new \EasySwoole\Memcache\Config([
    'host' => '127.0.0.1',
    'port' => 11211
]);
$client = new EasySwoole\Memcache\Memcache($config);
$client->set('a',1);
$client->get('a');
```

## Instructions:   
### touchTouch (refresh validity period)

```php
Touch($key, $expiration, $timeout = null)
```

### Increment increment KEY

```php
Increment($key, $offset = 1, $initialValue = 0, $expiration = 0, $timeout = null)
```


### decrement decrement KEY
```php
Decrement($key, $offset = 1, $initialValue = 0, $expiration = 0, $timeout = null)
```

### setSet KEY (overwrite)

```php
Set($key, $value, $expiration = 0, $timeout = null)
```

### addAdd KEY (non-overwrite)
```php
Add($key, $value, $expiration = 0, $timeout = null)
```
### replace replaces a KEY
```php
Replace($key, $value, $expiration = 0, $timeout = null)
```
### append append data to the end 
```php
append($key, $value, $timeout = null)
```
### prepend append data to the beginning
```php
Prepend($key, $value, $timeout = null)
```
### getGet KEY
```php
Get($key, $timeout = null)
```
### delete Delete a key
```php
Delete($key, $timeout = null)
```
### statsGet server status
```php
Stats($type = null, $timeout = null)
```
### versionGet the server version
```php
Version(int $timeout = null)
```
### flush Clear the cache
```php 
flush(int $expiration = null, int $timeout = null)
```



