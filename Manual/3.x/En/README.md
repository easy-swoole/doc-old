# EasySwoole
```
  ______ _____ _
 | ____| / ____| | |
 | |__ __ _ ___ _ _ | (___ __ __ ___ ___ | | ___
 | __| / _` | / __| | | | | \___ \ \ \ /\ / / / _ \ / _ \ | | / _ \
 | |____ | (_| | \__ \ | |_| | ____) | \ V V / | (_) | | (_) | | | | __/
 |______| \__,_| |___/ \__, | |_____/ \_/\_/ \___/ \___/ |_| \___|
                          __/ |
                         |___/
```
# EasySwoole

EasySwoole is a resident memory-based distributed PHP framework based on Swoole Server. It is designed for APIs and gets rid of the performance loss caused by process evoke and file loading in traditional PHP running mode. EasySwoole highly encapsulates the Swoole Server and still maintains the original features of the Swoole Server. It supports simultaneous mixing of HTTP, custom TCP, and UDP protocols, allowing developers to write multi-process, asynchronous, and highly available applications with minimal learning cost and effort. service

## Features

- Powerful TCP/UDP Server framework, multithreading, EventLoop, event driven, asynchronous, Worker process group, Task asynchronous task, millisecond timer, SSL/TLS tunnel encryption
- The EventLoop API allows users to directly manipulate the underlying event loop and add Linux files such as sockets, streams, and pipes to the event loop.
- Timer, coroutine object pool, HTTP\SOCK controller, distributed microservice, RPC support

## Entry cost

Compared to the traditional FPM framework, EasySwoole has a little entry cost, and many design concepts and environments are different from traditional FPM.
For developers who use LAMP (LNMP) technology for a long time, there will be a period of adaptation, and in many Swoole frameworks, EasySwoole is still relatively easy to get started. EasySwoole can be started almost immediately according to simple examples and documents. journey of.

## Advantage

- Easy to use and high development efficiency
- Concurrent million TCP connections
- TCP/UDP/UnixSock
- Support for asynchronous / synchronous / coroutine
- Support multi-process / multi-threading
- CPU affinity / daemon

## Common Functions and Components

- HTTP controller and custom routing
- TCP, UDP, WEB_SOCKET controller
- Multiple mixed protocol communication
- Asynchronous client and coroutine object pool
- Asynchronous processes, custom processes, timers
- Cluster distributed support, such as cluster node communication, service discovery, RPC
- Fully open system event registrar and EventHook

## Other

- [Project website homepage] (https://www.easyswoole.com)

- [Project Document Repository] (https://github.com/easy-swoole/doc)

- [HTTP Basic DEMO] (https://github.com/easy-swoole/demo/tree/3.x-http)

- [Other DEMO] (https://github.com/easy-swoole/demo/branches)

- VIP exchange group [579434607] (https://jq.qq.com/?_wv=1027&k=5bxu3cG)

- Online exchange group [633921431] (https://shang.qq.com/wpa/qunwpa?idkey=35c84e12f7784153501e3c43c9f2454d3235a7f55371458a24f0c32320c99548) (full)
- Online exchange group 709134628

- [Donation] (https://www.easyswoole.com/Manual/2.x/Cn/_book/donate.html)
    Your donation is the greatest encouragement and support for the Swoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
  - Continuous and in-depth development
  - Document and community construction and maintenance

- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us
