---
title: Csp concurrent programming
meta:
  - name: description
    content: Csp concurrent programming, the coroutine concurrent execution gets the result, easyswoole concurrently initiates the request summary result
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Csp|swoole Csp|Concurrent Programming|Coroutine Concurrency Results
---

# Csp concurrency mode
When we need to execute some unrelated requests concurrently and get results, for example:
```php
$sql1->exec();
$sql2->exec();
$sql2->exec();
```
In the above code, we can't save the most time, because the sql statements are executed sequentially, so we introduced the concept of Csp concurrent programming.

## Sample code
```php
go(function (){
    $channel = new \Swoole\Coroutine\Channel();
    go(function ()use($channel){
        //Simulation execution sql
        \co::sleep(0.1);
        $channel->push(1);
    });
    go(function ()use($channel){
        //Simulation execution sql
        \co::sleep(0.1);
        $channel->push(2);
    });
    go(function ()use($channel){
        //Simulation execution sql
        \co::sleep(0.1);
        $channel->push(3);
    });
    
    $i = 3;
    while ($i--){
        var_dump($channel->pop());
    }
});
```

::: tip
Of course, in the above code, we did not fully consider the timeout and so on.
:::

## Further packaging

```php
go(function (){
    $csp = new \EasySwoole\Component\Csp();
    $csp->add('t1',function (){
        \co::sleep(0.1);
       return 't1 result';
    });
    $csp->add('t2',function (){
        \co::sleep(0.1);
        return 't2 result';
    });

    var_dump($csp->exec());
});
```

::: warning 
 The exec method provides a default parameter: timeout (default is 5s). When calling $csp->exec(), waiting for about 5s will return the result. If you are in the t2 function co::sleep(6), then after 5s, the returned data will not contain the return data of the t2 function.
:::
