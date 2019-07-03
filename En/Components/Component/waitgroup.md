<head>
     <title>EasySwoole waigroup|swoole waigroup|swoole waigroup programming|waigroup|php waigroup</title>
     <meta name="keywords" content="EasySwoole waigroup|swoole waigroup|swoole waigroup programming|waigroup|php waigroup"/>
     <meta name="description" content="EasySwoole waigroup|swoole waigroup|swoole waigroup programming|waigroup|php waigroup"/>
</head>
---<head>---

# WaitGroup
Sample code：
```
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