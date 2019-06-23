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


## 使用
我们可以在Easyswoole全局的mainServerCreate事件中，进行限流器注册

```
use EasySwoole\AtomicLimit\AtomicLimit;
AtomicLimit::getInstance()->addItem('default')->setMax(200);
AtomicLimit::getInstance()->addItem('api')->setMax(2);
AtomicLimit::getInstance()->enableProcessAutoRestore(ServerManager::getInstance()->getSwooleServer(),10*1000)
```

> 以上代码表示，default这个限流器在5秒内允许的最大流量为200，而api则个限流器的最大流量为2

后续，我们可以在Easyswoole的base控制器中，进行请求拦截，例如在onRequest事件中，先进行流量检验，如果校验通过，则进行下一步操作。