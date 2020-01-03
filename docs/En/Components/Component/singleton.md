---
title: Single case
meta:
  - name: description
    content: EasySwoole singleton mode
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|singleton mode
---
# Single case
The singleton pattern ensures that a class can only have one instance globally, because its instances are saved by itself and cannot be instantiated outside of the class.  

## Effect
PHP's singleton mode is to avoid the resource consumption caused by repeated creation of objects.

## Use
The actual project is like a database query, log output, global callback, unified check and other modules. These modules have a single function, but require multiple accesses. If they are globally unique, multiple reuses will greatly improve performance.

## Example

```php

namespace EasySwoole\Component;

class MySingleton
{
    use Singleton;
}

$mySingleton = Mysingleton::getInstance();

``` 


## Core object method

Core class: EasySwoole\Component\Singleton。

Get object

* mixed     $args     parameter

```php
static function getInstance(...$args)
```    
