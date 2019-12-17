---
title: easyswoole
meta:
  - name: description
    content: EasySwoole 是一款基于Swoole Server 开发的常驻内存型的分布式PHP框架，专为API而生，摆脱传统PHP运行模式在进程唤起和文件加载上带来的性能损失。
  - name: keywords
    content: easyswoole|swoole框架|swoole|php框架
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

EasySwoole 是一款基于Swoole Server 开发的常驻内存型的分布式PHP框架，专为API而生，摆脱传统PHP运行模式在进程唤起和文件加载上带来的性能损失。
EasySwoole 高度封装了 Swoole Server 而依旧维持 Swoole Server 原有特性，支持同时混合监听HTTP、自定义TCP、UDP协议，让开发者以最低的学习成本和精力编写出多进程，可异步，高可用的应用服务。在开发上，我们为您准备了以下常用组件：

- HTTP WEB 组件
- TCP、UDP、WEB_SOCKET 组件
- redis连接池
- mysql 连接池
- 自定义进程
- 分布式跨平台RPC组件
- 微信公众号与小程序SDK
- 协程版微信、支付宝支付SDK
- 模板渲染引擎
- Tracker链路跟踪
- 限流器
- 消息队列
- 协程HTTP客户端组件
- apollo配置中心
- validate验证器
- 验证码
- fast-cache组件
- Policy权限组件
- IOC、协程上下文管理器


::: warning 
 以上组件为常用组件，更多组件请看组件库文档
:::

## 生产可用
Easyswoole从最早的前身EasyPHP-Swoole，到更名为Easyswoole,再到现如今的EasySwoole 3.x版本，多年时间在众多社区小伙伴的共同努力下，EasySwoole的稳定与可靠已经经历了非常多的大企业检验。

例如：

- 腾讯公司的IEG部门
- WEGAME部门
- 网宿科技（国内CDN厂家）
- 360金融
- 360小游戏（Actor）
- 9377小游戏
- 厦门美图网
- 蝉大师

等公司都在使用EasySwoole。

## 特性

- 强大的 TCP/UDP Server 框架，多线程，EventLoop，事件驱动，异步，Worker进程组，Task异步任务，毫秒定时器，SSL/TLS隧道加密
- EventLoop API，让用户可以直接操作底层的事件循环，将socket，stream，管道等Linux文件加入到事件循环中
- 定时器、协程对象池、HTTP\SOCK控制器、分布式微服务、RPC支持

## 优势

- 简单易用开发效率高
- 并发百万TCP连接
- TCP/UDP/UnixSock
- 支持异步/同步/协程
- 支持多进程/多线程
- CPU亲和性/守护进程

## 维护团队
- 作者
    - 如果的如果 admin@fosuss.com   
- 团队成员
    - 阿正 1589789807@qq.com
    - 会长 2788828128@qq.com
    - 北溟有鱼 1769360227@qq.com
    - 机器人 694050314@qq.com
    - Manlin 476295133@qq.com
    - Siam(宣言) 59419979@qq.com
    - 小菜瓜 1276407988@qq.com
    - 仙士可 1067197739@qq.com
    

::: warning 
 以上排名不分先后        
:::

## 其他
- [GitHub](https://github.com/easy-swoole/easyswoole)  喜欢记得点个***star***
- [GitHub for Doc](https://github.com/easy-swoole/doc)

- [DEMO](https://github.com/easy-swoole/demo/)

- QQ交流群
    - VIP群 579434607 （本群需要付费599元）
    - EasySwoole官方一群 633921431(已满)
    - EasySwoole官方二群 709134628(已满)
    - EasySwoole官方三群 932625047
    
- 商业支持：
    - QQ 291323003
    - EMAIL admin@fosuss.com   
- 作者微信

    ![](/resources/authWx.png)    
    
- [捐赠](../Preface/donation.md)
  您的捐赠是对Swoole项目开发组最大的鼓励和支持。我们会坚持开发维护下去。 您的捐赠将被用于:
        
  - 持续和深入地开发
  - 文档和社区的建设和维护
