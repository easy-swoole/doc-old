# AtomicLimit

Easyswoole provides a current limiter based on Atomic counter.

## Principle

By limiting the total number of requests in a certain period of time, the basic current limit is achieved. For example, if the maximum number of requests allowed is 200 within 5 seconds, the theoretical average concurrency is 40, and the peak concurrency is 200.

## Install

```
composer require easyswoole/atomic-limit
```

## Sample code
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

> Note that this example uses a custom process with a timer to achieve the counting timing reset. In fact, it is not worth doing this with a process, so the actual production can specify a worker, set a timer to achieve.


## Use

We can register the current limiter in Easyswoole's global mainServerCreate event.

```
use EasySwoole\AtomicLimit\AtomicLimit;
AtomicLimit::getInstance()->addItem('default')->setMax(200);
AtomicLimit::getInstance()->addItem('api')->setMax(2);
AtomicLimit::getInstance()->enableProcessAutoRestore(ServerManager::getInstance()->getSwooleServer(),10*1000)
```

> The above code indicates that default is the maximum flow allowed by the current limiter in 5 seconds, while API is the maximum flow allowed by the current limiter in 2 seconds.

Subsequently, we can intercept requests in Easyswoole's base controller. For example, in onRequest event, we can check traffic first, and if the check passes, we can proceed to the next step.