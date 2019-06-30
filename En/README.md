# EasySwoole
```
  ______                          _____                              _        
 |  ____|                        / ____|                            | |       
 | |__      __ _   ___   _   _  | (___   __      __   ___     ___   | |   ___ 
 |  __|    / _` | / __| | | | |  \___ \  \ \ /\ / /  / _ \   / _ \  | |  / _ \
 | |____  | (_| | \__ \ | |_| |  ____) |  \ V  V /  | (_) | | (_) | | | |  __/
 |______|  \__,_| |___/  \__, | |_____/    \_/\_/    \___/   \___/  |_|  \___|
                          __/ |                                               
                         |___/                                                
```
# EasySwoole

EasySwoole is a resident memory-based distributed PHP framework based on Swoole Server. It is specifically designed for APIs and gets rid of the performance loss caused by evoking processes and loading PHP files in traditional method. EasySwoole highly encapsulates the Swoole Server and maintains the original features of the Swoole Server. It supports listening HTTP, custom TCP and UDP protocols simultaneously, so that developers allow to write asynchronous multiple processes, and highly available services and applications with minimal learning cost and effort. 

## Features

- Powerful TCP/UDP Server framework supporting asynchronous multi-process,  EventLoop, event driven, worker process group, asynchronous task, millisecond timer, SSL/TLS tunnel encryption
- The EventLoop API allows users directly to manipulate the underlying event loop and add Linux files such as sockets, streams, and pipes to the event loop.
- Supporting coroutine object pool, HTTP\SOCK controller, distributed microservice, and RPC

## Entry Cost

Compared to the traditional FPM framework, EasySwoole has some entry cost since many design concepts and environments are different to traditional PHP-FPM.
Developers using LAMP (LNMP) technology for a long time may need a period of time to get used to this framework. However, EasySwoole is still easy to get started comparing to many other Swoole frameworks. The journey of EasySwoole can be started almost immediately according to simple examples and documents from its official website.

## Advantages

- Easy to use and high development efficiency
- Million of concurrent TCP connections
- Supporting TCP / UDP / UnixSock
- Supporting asynchronous / synchronous / coroutine
- Supporting multi-process / multi-coroutine
- CPU affinity / daemon

## Common Functions and Components

- HTTP controller and custom routing
- TCP, UDP, WebSocket controller
- Multiple protocol communication
- Asynchronous client and coroutine object pool
- Asynchronous process, custom process, timer
- Distributed cluster such as cluster node communication, service discovery, RPC
- Fully open system event handler and EventHook

## Other
We are pool in English,but we hope this project makes you using swoole easily , and if you have any interest in this project, you can contact us in email :  admin@fosuss.com to help us improve this project, for example ,help us translate the English doc better;

- [Project Document Repository](https://github.com/easy-swoole/doc)

- [DEMO](https://github.com/easy-swoole/demo/)

- QQ exchange group
     - VIP group 579434607 (this group needs to pay 599 RMB)
     - EasySwoole official group 633921431 (full)
     - EasySwoole official second group 709134628
    
- Business support:
     - QQ 291323003
     - EMAIL admin@fosuss.com
        
- Author WeChat

     ![](http://easyswoole.com/img/authWx.jpg)
     
- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us
