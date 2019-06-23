# AtomicLimit

Easyswoole提供了一个基于Atomic计数器的限流器。

## 原理

通过限制某一个时间周期内的总请求数，从而实现基础限流。举个例子，设置5秒内，允许的最大请求量为200，那么理论平均并发为40，峰值并发为200。

## 安装

```
composer require easyswoole/atomic-limit
```

## 示例代码
```
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

> 注意，本例子是用一个自定义进程内加定时器来实现计数定时重置，实际上用一个进程来做这件事情有点不值得，因此实际生产可以指定一个worker,设置定时器来实现