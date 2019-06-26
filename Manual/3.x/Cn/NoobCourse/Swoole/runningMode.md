## Swoole 的运行模式
------
注： **以下内容主要指 `SwooleServer` 。**

### Swoole 做了什么
-------
`Swoole` 是 php 的一个扩展，但是他又不是普通的扩展，其最明显的特点就是：**一但运行后就会接管PHP的控制权，进入事件循环。** **当某种IO事件发生时， `Swoole` 会回调开发者设置的指定PHP函数。**

也就是说 `SwooleServer` 更像是一个用 `C` 语言封装好的一个 `Tcp/Udp` 支持 `多线程`， `EventLoop`，`事件驱动`，`异步` 等功能的框架。开发者不需要关心底层的各种实现，直接的在业务层面进行开发即可。

### 什么是IO事件
-------
很多 php 程序员没有使用过其他语言开发Server，也不太了解除了php-fpm以外运行模式的php程序，初次使用Swoole时总是会有各种摸不到头脑的事情。其实IO我们经常提起如： `磁盘IO` ，`网络IO` 在这里Swoole所指的IO事件实际上是指 `网络IO` 事件。

在日常生活中你留下了一个邮箱，当有人给你发送邮件的时候，你就会收到邮件提醒；而对于你而言，你并不关心邮件是如何送达的，你只关心你有没有收到邮件，当你收到邮件之后会根据邮件的内容和发送人去做各种各样的处理。在这个比喻中，**Swoole就承担了底层网络事件的监听及各种底层事件处理，当收到邮件(请求)时，会触发收件(接收)提醒，然后将控制权转交给你(预先注册的事件回调函数)，来进行后续的处理。**


### Swoole 的运行流程
-------

##### 初始化
```php
<?php

// new 一个SwoolerServer对象 并指定监听端口 和运行模式 以及Socket类型
// 此时的一切一切 都是开发者进行配置的时间，没有任何其他事情发生
$server = new Swoole\Server('0.0.0.0', 9501, SWOOLE_PROCESS, SWOOLE_SOCK_TCP);

// 设置运行参数， 就像你平时做的那样，给$server 对象配置相关的参数
$server->set([
    'worker_num' => 4,    // 工作进程数量
    'daemonize' => true,  // 是否以守护进程模式运行
    'backlog' => 128,     // Listen队列长度
]);

// 注册事件回调函数
// 这里指 当底层Tcp新连接进入事件时 交给Tcp 类的 onConnect 静态方法处理
$server->on('Connect', [Tcp::class, 'onConnect']);
// 这里指 当收到数据时 交给Tcp 类的 onReceive 静态方法处理
$server->on('Receive', [Tcp::class, 'onReceive']);
// 这里指 当Tcp客户端连接关闭时 交给Tcp 类的 onClose 静态方法处理
$server->on('Close', [Tcp::class, 'onClose']);
```  

在上面的示例当中，实际上Swoole还尚未启动，但是我们已经预先配置了许多必要的配置条件。鉴于有的新人还尚不了解什么叫做 `回调函数`，在这里我简单的讲解一下:
>所谓的`回调函数(CallBack)` 就好比是张开了夹子的捕鼠器，我们设定当有老鼠踩到捕鼠器的时候，他会关闭夹子然后捉住老鼠，我们放置捕鼠器的时候，捕鼠器并没有真的抓老鼠。这个设定就是回调，他不立刻执行，会在遇到触发条件(事件)时执行，在上面的示例当中我们放置了3个捕鼠器(回调函数)，我们只需要知道他会在特定老鼠(事件)踩到的时候(发生的时候)去执行我们期望的功能就好。

##### Server Start

```php
// 启动Swole Server 将由 Swoole 接管php运行
$server->start();
```

至此Swoole 完全的接管了php的运行，并且监听相应端口并当发生事件时去执行开发者自定义的事件回调。

##### 仅仅如此吗？
事实上Swoole 在启动的时候做了非常多的事情:  

>Swoole 运行流程图：
![Swoole运行流程图](https://wiki.swoole.com/static/uploads/swoole.jpg)  

>Swoole 进程关系图：
![Swoole进程关系图](https://wiki.swoole.com/static/uploads/wiki/201808/03/635680420659.png)

上图中我们可以了解，Swoole 会创建一个 `Manager` 进程专门 管理 `Work` 和 `Task` 进程。 而 `Work` 进程则直接通过 `Unix Socket` 和 `Master` 进程通讯。

### 待续
