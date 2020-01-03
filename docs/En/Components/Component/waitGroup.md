---
title: waitGroup
meta:
  - name: description
    content: waitGroup
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|waitGroup|swoole waitGroup
---

# waitgroup

Sample code：

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
