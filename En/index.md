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
[![Latest Stable Version](https://poser.pugx.org/easyswoole/easyswoole/v/stable)](https://packagist.org/packages/easyswoole/easyswoole)
[![Total Downloads](https://poser.pugx.org/easyswoole/easyswoole/downloads)](https://packagist.org/packages/easyswoole/easyswoole)
[![Latest Unstable Version](https://poser.pugx.org/easyswoole/easyswoole/v/unstable)](https://packagist.org/packages/easyswoole/easyswoole)
[![License](https://poser.pugx.org/easyswoole/easyswoole/license)](https://packagist.org/packages/easyswoole/easyswoole)
[![Monthly Downloads](https://poser.pugx.org/easyswoole/easyswoole/d/monthly)](https://packagist.org/packages/easyswoole/easyswoole)

EasySwoole is a resident memory-based distributed PHP framework developed by Swoole Server. It is designed for API and gets rid of the performance loss caused by traditional PHP mode in process wake-up and file loading.

EasySwoole highly encapsulates Swoole Server while maintaining Swoole Server's original features. It supports simultaneous monitoring of HTTP, custom TCP and UDP protocols. It allows developers to write multi-process, asynchronous and highly available application services with the lowest learning cost and energy. In development, we have prepared the following common components for you:

- HTTP WEB Component
- TCP、UDP、WEB_SOCKET Component
- Redis connection pool
- MySQL connection pool
- Customization process
- Distributed Cross-Platform RPC Components
- Wechat Public Number and Small Program SDK
- Coroutine version WeChat and Alipay pay SDK
- Template Rendering Engine
- Tracker link tracking
- Current Limiter
- Message queue
- Cooperative HTTP Client Component
- Apollo configuration center
- Validate validator
- Verification Code
- fast-cache Component
- Policy power Component
- IOC、Coroutine Context Manager

> The above components are common components. See the component library documentation for more components.

## Production Availability
From the earliest predecessor of EasySwoole, EasyPHP-Swoole, to the renamed EasySwoole, to the current version of EasySwoole 3.x, EasySwoole's stability and reliability have undergone a lot of large enterprise tests with the joint efforts of many small community partners for many years.

For example：

- 腾讯公司的IEG部门
- WEGAME部门
- 网宿科技（国内CDN厂家）
- 360金融
- 360小游戏（Actor）
- 9377小游戏
- 厦门美图网
- 蝉大师

They all use EasySwoole.

## Characteristic

- Powerful TCP/UDP Server framework, multithreading, EventLoop, event-driven, asynchronous, Worker process group, Task asynchronous task, millisecond timer, SSL/TLS tunnel encryption
- EventLoop API allows users to directly manipulate the underlying event loop, adding Linux files such as socket, stream, pipeline to the event loop
- Timer, Coroutine Object Pool, HTTPSOCK Controller, Distributed Micro Services, RPC Support

## Advantage

- Easy to use and high efficiency of development
- Concurrent Million TCP Connections
- TCP/UDP/UnixSock
- Support for asynchronization/synchronization/Coroutine
- Support multi-process/multi-threading
- CPU affinity/daemon

## Maintenance team
- author
    - 如果的如果 admin@fosuss.com   
- Team members
    - 阿正 1589789807@qq.com
    - 不忘初心 2788828128@qq.com
    - 北溟有鱼 1769360227@qq.com
    - 机器人 694050314@qq.com
    - Manlin 476295133@qq.com
    - Siam(宣言 ) 59419979@qq.com
    - 小菜瓜 1276407988@qq.com
    - 仙士可 1067197739@qq.com
    
> 以上排名不分先后

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
     
- Translate by
     - NAME: huizhang
     - QQ: 2788828128
     - EMAIL: <a href="mailto:tuzisir@163.com">tuzisir@163.com</a>


- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us
