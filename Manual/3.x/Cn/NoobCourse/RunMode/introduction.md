## 运行模式  
php有着5种运行模式,常见的有4种:  

###  cgi 协议模式
cgi模式 通用网关接口（Common Gateway Interface）,它允许web服务器通过特定的协议与应用程序通信,
调用原理大概为:  
用户请求->Web服务器接收请求->fork子进程 调用程序/执行程序->程序返回内容/程序调用结束->web服务器接收内容->返回给用户
由于每次用户请求,都得fork创建进程调用一次程序,然后销毁进程,所以性能较低

###  fast-cgi 协议模式
fast-cgi是cgi模式的升级版,它像是一个常驻型的cgi,只要开启后,就可一直处理请求,不再需要结束进程,
调用原理大概为:  
web服务器fast-cgi进程管理器初始化->预先fork n个进程  
用户请求->web服务器接收请求->交给fast-cgi进程管理器->fast-cgi进程管理区接收,给其中一个空闲fast-cgi进程处理->处理完成,fast-cgi进程变为空闲状态,等待下次请求->web服务器接收内容->返回给用户
>注意,fast-cgi和cgi都是一种协议,开启的进程是单独实现该协议的进程  

###  模块模式  
apache+php运行时,默认使用的是模块模式,它把php作为apache的模块随apache启动而启动,接收到用户请求时则直接通过调用mod_php模块进行处理,详细内容可自行百度

### php-cli模式  
php-cli模式属于命令行模式,对于很多刚开始学php就开始wamp,wnmp的开发者来说是最陌生的一种运行模式  
该模式不需要借助其他程序,直接输入php xx.php 就能执行php代码  
命令行模式和常规web模式明显不一样的是:  
 * 没有超时时间
 * 默认关闭buffer缓冲
 * STDIN和STDOUT标准输入/输出/错误 的使用
 * echo var_dump,phpinfo等输出直接输出到控制台
 * 可使用的类/函数 不同
 * php.ini配置的不同
 
>想要了解详细内容可查看http://php.net/manual/zh/features.commandline.php 

### 其他
>本文将以上除了php-cli的模式,都定义为常规web访问模式  
