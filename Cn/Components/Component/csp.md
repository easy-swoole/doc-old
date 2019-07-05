<head>
     <title>EasySwoole Csp|swoole Csp|swoole Csp编程|Csp编程|php Csp编程|Csp并发</title>
     <meta name="keywords" content="EasySwoole Csp|swoole Csp|swoole Csp编程|Csp编程|php Csp编程|Csp并发"/>
     <meta name="description" content="php用swoole的channel实现类似go语言中的CSP并发编程模式"/>
</head>
---<head>---

# Csp 并发模式
当我们需要并发执行某些不相干的请求，并得到结果的时候，例如：
```php
$sql1->exec();
$sql2->exec();
$sql2->exec();
```
在以上的代码中，我们没办法最大的节约时间，因为sql语句都是顺序执行的，因此我们引入了Csp并发编程的概念。

## 示例代码
```php
go(function (){
    $channel = new \Swoole\Coroutine\Channel();
    go(function ()use($channel){
        //模拟执行sql
        \co::sleep(0.1);
        $channel->push(1);
    });
    go(function ()use($channel){
        //模拟执行sql
        \co::sleep(0.1);
        $channel->push(2);
    });
    go(function ()use($channel){
        //模拟执行sql
        \co::sleep(0.1);
        $channel->push(3);
    });
    
    $i = 3;
    while ($i--){
        var_dump($channel->pop());
    }
});
```

> 当然，在以上的代码中，我们没有充分的考虑超时等情况

## 进一步封装

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