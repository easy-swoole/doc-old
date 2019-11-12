---
title: http服务
meta:
  - name: description
    content: easyswoole,如何获取客户端IP
  - name: keywords
    content: easyswoole|获取客户端IP|跨域处理
---


# 常见问题
## 如何获取$HTTP_RAW_POST_DATA
```php
$content = $this->request()->getBody()->__toString();
$raw_array = json_decode($content, true);
```
## 如何获取客户端IP
举例，如何在控制器中获取客户端IP
```php
//真实地址
$ip = ServerManager::getInstance()->getSwooleServer()->connection_info($this->request()->getSwooleRequest()->fd);
var_dump($ip);
//header 地址，例如经过nginx proxy后
$ip2 = $this->request()->getHeaders();
var_dump($ip2);
```

## HTTP 状态码总为500
自 swoole **1.10.x** 和 **2.1.x** 版本起，执行http server回调中，若未执行response->end(),则全部返回500状态码

## 如何setCookie  
调用response对象的setCookie方法即可设置cookie
```php
  $this->response()->setCookie('name','value');
```
更多操作可看[Response对象](response.md)


## 如何自定义App名称
只需要修改composer.json的命名空间注册就行
```
    "autoload": {
        "psr-4": {
            "App\\": "Application/"
        }
    }
```

