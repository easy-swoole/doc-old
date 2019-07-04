<head>
     <title>学习Swoole之如何避免成为被坑哭的程序员</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="swoole|如何学习swoole|swoole 采坑|swoole学习笔记"/>
     <meta name="description" content="如何学习swoole|swoole 采坑|swoole|swoole学习笔记"/>
</head>
---<head>---

# 学习Swoole之如何避免成为被坑哭的程序员

很多刚从传统fpm模式转到swoole内存常驻模式的phper，总会觉得内心委屈，甚至想哭,原因swoole总会让你怀疑人生，这真的是我之前所认知的那个php语言吗？怎么那么坑啊。

## swoole下常见的"坑"

- 为何全局变量无法共享呢
   
    例如，在以下代码中
    ```
    $http = new swoole_http_server("127.0.0.1", 9501);
    $http->on("request", function ($request, $response) {
        static $i;
        $response->end($i);
        $i++;
    });
    
    $http->start();
    ```
    就会有人发现，在swoole下，static $i 和在fpm下所理解的输出不一致。这是这是在于，出现了进程克隆。而每个进程之间的数据都是不一致的。

- echo 等常见的输出方法，无法输出到http响应中
    
    我们在fpm模式下，我 ```echo $a``` 是可以把结果输出到浏览器中的，为何在swoole中就不行呢，原因在于，模式的变更，swoole的运行模式不再是fpm，而是cli，如果你需要把数据响应给浏览器，你只能
    通过 Http request 回调中的response对象进行响应

- http请求参数获取

    在同swoole的http服务的时候，很多人会发现，$_GET,$_POST等常见全局变量无法使用

- swoole不能使用die/exit
    
    phper都习惯用die/exit来调试代码

- swoole下为何需要断线重连      
    
    很多程序员都习惯性的把数据库连接做单例化处理，这样很明显带来的好处就是节约了每次请求数据库需要连接多次的开销。那么为何在swoole下总是报错提示我数据库断线了呢？
    原因在于，传统fpm下，请求结束了，那么就会执行进程清理，数据库连接也被清理了，下次进来的时候，才会执行重新连接。这样就保证了连接都是可用的状态。但是在swoole常驻内存的情况下，
    请求结束后，该连接并不会被清理，依旧保留在内存空间内，而该连接若是长时间没有使用，或者是因为网络波动，那么就会断开。下次请求进来的时候，你没有判断连接状态，就直接去执行sql语句，那么
    就意味着你操作了一个断线的数据库连接，因此肯定会报错。

- 内存泄露
    很多人用swoole写服务的时候，总是跑着跑着就莫名其妙的内存不足。

- 协程上下文访问安全
    使用swoole协程的时候，会有人遇到变量被污染的问题    
    
## 使用swoole必须要懂的知识点

- 多进程编程(进程信号量，进程克隆与隔离，进程间通讯等)
- 基础的TCP/UDP认知
- 协程

## 总结

总而言之，并不是因为swoole坑，而是大部分phper自身知识储备不足，导致在使用swoole的时候出了各种各样的问题。实际上，swoole是一个很强大的php拓展，他重新定义了php，让php有了更强的生命力。