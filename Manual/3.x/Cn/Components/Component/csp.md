# Csp
示例代码
```
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