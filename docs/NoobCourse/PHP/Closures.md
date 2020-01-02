## 闭包函数

### 闭包的概念
闭包就是能够读取其他函数内部变量的函数。例如在javascript中，只有函数内部的子函数才能读取局部变量，所以闭包可以理解成“定义在一个函数内部的函数“。在本质上，闭包是将函数内部和函数外部连接起来的桥梁。
在php中,闭包函数一般就是匿名函数.
举例,有一个定时任务,每一秒执行一次,现在我们要开启一个服务,然后准备在30秒的时候关闭这个服务
```php
<?php
function tick($callback){
    while (1) {//简单实现的定时器,每秒都去执行一次回调
        call_user_func($callback);
        sleep(1);
    }
}
class Server
{
    //模拟退出一个服务
    public function exitServer()
    {
        return true;
    }
}
$server = new Server();
$time = time();
tick(function ()use($server) {
    $server->exitServer();
});
```
在这里面,使用匿名函数,use了函数外部的$server变量,才使得定时器能回调调用$server->exitServer();


### 匿名函数
匿名函数 通俗来讲,就是没有名字的函数,例如上面写的function(){},它通常作为闭包函数使用,使用方法如下:
```php
<?php
$fun = function($name){
    printf("Hello %s\r\n",$name);
};
echo $fun('Tioncico');
function a($callback){
    return $callback();
}
a(function (){
    echo "EasySwoole\n";
    return 1;
});
```

#### use
PHP在默认情况下，匿名函数不能调用所在代码块的上下文变量，而需要通过使用use关键字。
```php
<?php
function a($callback){
    return $callback();
}
$str1 = "hello,";
$str2 = "Tioncico,";
a(function ()use($str1,$str2){
    echo $str1,$str2,"EasySwoole\n";
    return 1;
});

```


