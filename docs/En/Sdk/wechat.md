---
title: 微信SDK
meta:
  - name: description
    content: WeChat是一个基于Swoole 4.x全协程支持的微信SDK库
  - name: keywords
    content: easyswoole|wechat
---

# 微信SDK
```
composer require easyswoole/wechat
```

# EasySwoole WeChat

[![Latest Stable Version](https://poser.pugx.org/easyswoole/wechat/v/stable)](https://packagist.org/packages/easyswoole/wechat)
[![Total Downloads](https://poser.pugx.org/easyswoole/wechat/downloads)](https://packagist.org/packages/easyswoole/wechat)
[![Latest Unstable Version](https://poser.pugx.org/easyswoole/wechat/v/unstable)](https://packagist.org/packages/easyswoole/wechat)
[![License](https://poser.pugx.org/easyswoole/wechat/license)](https://packagist.org/packages/easyswoole/wechat)
[![Monthly Downloads](https://poser.pugx.org/easyswoole/wechat/d/monthly)](https://packagist.org/packages/easyswoole/wechat)

EasySwoole WeChat 是一个基于 Swoole 4.x 全协程支持的微信SDK库，告别同步阻塞，轻松编写高性能的微信公众号/小程序/开放平台业务接口

## 获取实例

在开始操作之前需要获取一个实例，后续操作均使用该实例进行操作

```php
 
 use EasySwoole\WeChat\WeChat;
 use EasySwoole\WeChat\Config;
 
 $wechat = new WeChat(); // 创建一个实例
 $wechat->config()->setTempDir(EASYSWOOLE_TEMP_DIR); // 指定全局临时目录

```

## 异常捕获

在调用方法时，如果传递了无效的参数或者发生网络异常，将会抛出 ***EasySwoole\WeChat\Exception\RequestError*** 或者 ***EasySwoole\WeChat\Exception\OfficialAccountError*** 类型的异常，开发者需要手工捕获该类异常进行处理，类似这样：

```php

 use EasySwoole\WeChat\Exception\RequestError;
 use EasySwoole\WeChat\Exception\OfficialAccountError;

 try {
     $wechat->officialAccount()->ipList();
 } catch (RequestError $requestError){
    
 } catch (OfficialAccountError $error){
            
 }
 
```



