---
title: Atomic current limiter
meta:
  - name: description
    content: Easyswoole provides a current limiter based on Atomic counters
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Atomic|Current limiter
---

# AtomicLimit

Easyswoole provides a current limiter based on Atomic counters

## principle

The basic current limit is achieved by limiting the total number of requests in a certain time period. For example, if the maximum number of requests allowed is 200 in 5 seconds, then the theoretical average is 40 and the peak is 200.

## Installation

```
composer require easyswoole/atomic-limit
```

## Sample code
```php
/*
 * egUrl http://127.0.0.1:9501/index.html?api=1
 */

use EasySwoole\AtomicLimit\AtomicLimit;
AtomicLimit::getInstance()->addItem('default')->setMax(200);
AtomicLimit::getInstance()->addItem('api')->setMax(2);

$http = new swoole_http_server("127.0.0.1", 9501);

AtomicLimit::getInstance()->enableProcessAutoRestore($http,10*1000);

$http->on("request", function ($request, $response) {
    if(isset($request->get['api'])){
        if(AtomicLimit::isAllow('api')){
            $response->write('api success');
        }else{
            $response->write('api refuse');
        }
    }else{
        if(AtomicLimit::isAllow('default')){
            $response->write('default success');
        }else{
            $response->write('default refuse');
        }
    }
    $response->end();
});

$http->start();
```


::: warning 
 Note that this example uses a custom process plus timer to implement the count timing reset. In fact, it is not worthwhile to use a process to do this. Therefore, the actual production can specify a worker and set a timer to implement.
:::


## Use
We can register the current limiter in the mainServerCreate event of the Easyswoole global.

```php
use EasySwoole\AtomicLimit\AtomicLimit;
AtomicLimit::getInstance()->addItem('default')->setMax(200);
AtomicLimit::getInstance()->addItem('api')->setMax(2);
AtomicLimit::getInstance()->enableProcessAutoRestore(ServerManager::getInstance()->getSwooleServer(),10*1000)
```


::: warning
  The above code indicates that the default limiter allows a maximum flow of 200 in 5 seconds, while the api has a maximum flow of 2 in the limiter.
:::

Subsequently, we can perform request interception in the base controller of Easyswoole. For example, in the onRequest event, the traffic check is performed first. If the check passes, the next step is performed.

