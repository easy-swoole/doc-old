<head>
     <title>EasySwoole Csp|swoole Csp|swoole Csp programming|Csp programming|php Csp programming|Csp Concurrent</title>
     <meta name="keywords" content="EasySwoole Csp|swoole Csp|swoole Csp programming|Csp programming|php Csp programming|Csp Concurrent"/>
     <meta name="description" content="EasySwoole Csp|swoole Csp|swoole Csp programming|Csp programming|php Csp programming|Csp Concurrent"/>
</head>
---<head>---

# Csp concurrency mode
When we need to concurrently execute some unrelated requests and get results, for example:
```php
$sql1->exec();
$sql2->exec();
$sql2->exec();
```
In the above code, we can not save the most time, because SQL statements are executed sequentially, so we introduce the concept of Csp concurrent programming.

## Sample code
```php
go(function (){
    $channel = new \Swoole\Coroutine\Channel();
    go(function ()use($channel){
        //Sample code simulates SQL execution
        \co::sleep(0.1);
        $channel->push(1);
    });
    go(function ()use($channel){
        //Sample code simulates SQL execution
        \co::sleep(0.1);
        $channel->push(2);
    });
    go(function ()use($channel){
        //Sample code simulates SQL execution
        \co::sleep(0.1);
        $channel->push(3);
    });
    
    $i = 3;
    while ($i--){
        var_dump($channel->pop());
    }
});
```

> Of course, in the above code, we didn't give enough consideration to timeouts and so on.

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