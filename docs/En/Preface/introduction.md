---
title: easyswoole
meta:
  - name: description
    content: EasySwoole is a resident memory-based distributed PHP framework based on Swoole Server. It is designed for APIs and gets rid of the performance loss caused by process evoke and file loading in traditional PHP running mode.
  - name: keywords
    content: Easyswoole|swoole framework|swoole coroutine framework|php framework
---

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

EasySwoole is a resident memory-based distributed PHP framework based on Swoole Server. It is designed for APIs and gets rid of the performance loss caused by process evoke and file loading in traditional PHP running mode.
EasySwoole highly encapsulates the Swoole Server and still maintains the original features of the Swoole Server. It supports simultaneous mixing of HTTP, custom TCP, and UDP protocols, allowing developers to write multi-process, asynchronous, and highly available applications with minimal learning cost and effort. service. In development, we have prepared the following common components for you:

- HTTP WEB component
- TCP, UDP, WEB_SOCKET components
- redis connection pool
- mysql connection pool
- Custom process
- Distributed cross-platform RPC components
- WeChat public number and applet SDK
- Correspondence version WeChat, Alipay payment SDK
- Template rendering engine
- Tracker link tracking
- Current limiter
- message queue
- Coroutine HTTP client component
- apollo configuration center
- validate validator
- Verification code
- fast-cache component
- Policy permission component
- IOC, coroutine context manager


::: warning 
 The above components are common components, and more components can be found in the component library documentation.
:::

## Production available
From the earliest predecessor EasyPHP-Swoole, to the name Easyswoole, and now to the EasySwoole 3.x version, EasySwoole has experienced many stable and reliable companies under the joint efforts of many community partners.

E.g:

- Tencent's IEG department
- WEGAME department
- Nets Technology (domestic CDN manufacturers)
- 360 Finance
- 360 games (Actor)
- 9377 games
- Xiamen Meitu Net
- Chan Dashi

These companies are using EasySwoole.

## Features

- Powerful TCP/UDP Server framework, multithreading, EventLoop, event driven, asynchronous, Worker process group, Task asynchronous task, millisecond timer, SSL/TLS tunnel encryption
- The EventLoop API allows users to directly manipulate the underlying event loop and add Linux files such as sockets, streams, and pipes to the event loop.
- Timer, coroutine object pool, HTTP\SOCK controller, distributed microservice, RPC support

## Advantage

- Easy to use and high development efficiency
- Concurrent million TCP connections
- TCP/UDP/UnixSock
- Support for asynchronous / synchronous / coroutine
- Support multi-process / multi-threading
- CPU affinity / daemon

## Maintenance Team
- Author
    - 如果的如果 admin@fosuss.com
- team member
    - 阿正 1589789807@qq.com
    - 不忘初心 2788828128@qq.com
    - 北溟有鱼 1769360227@qq.com
    - 机器人 694050314@qq.com
    - Manlin 476295133@qq.com
    - Siam(宣言) 59419979@qq.com
    - 小菜瓜 1276407988@qq.com
    - 仙士可 1067197739@qq.com
    

::: warning 
 The above rankings are in no particular order        
:::

## Other
- [GitHub](https://github.com/easy-swoole/easyswoole)  Leave a star if you like
- [GitHub for Doc](https://github.com/easy-swoole/doc)

- [DEMO](https://github.com/easy-swoole/demo/)

- QQ exchange group
    - VIP group 579434607 (this group needs to pay 599 RMP)
    - EasySwoole official group 633921431 (full)
    - EasySwoole official two groups 709134628 (full)
    - EasySwoole official three groups 932625047
    
- Business support:
    - QQ 291323003
    - EMAIL admin@fosuss.com   
- Author WeChat

    ![](/resources/authWx.png)    
    
- [Donation](../Preface/donation.md)
  Your donation is the greatest encouragement and support for the Swoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
  - Continuous and in-depth development
  - Document and community construction and maintenance
