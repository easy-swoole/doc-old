<head>
     <title>EasySwoole waigroup|swoole waigroup|swoole waigroup编程|waigroup|php waigroup</title>
     <meta name="keywords" content="EasySwoole waigroup|swoole waigroup|swoole waigroup编程|waigroup|php waigroup"/>
     <meta name="description" content="php用swoole的channel实现类似go语言中的waitgroup并发编程模式"/>
</head>
---<head>---

# WaitGroup
示例代码：
```php
go(function (){
    $ret = [];

    $wait = new \EasySwoole\Component\WaitGroup();

    $wait->add();
    go(function ()use($wait,&$ret){
        \co::sleep(0.1);
        $ret[] = time();
        $wait->done();
    });

    $wait->add();
    go(function ()use($wait,&$ret){
        \co::sleep(2);
        $ret[] = time();
        $wait->done();
    });

    $wait->wait();

    var_dump($ret);
});
```