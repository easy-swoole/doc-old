---
title: Easyswoole http服务场景问题
meta:
  - name: description
    content: swoole 使用常见问题
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|swoole如何获取客户端IP|swoole如何获取RAW_POST|swoole https
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

## 如何启用Https
通常建议使用Nginx 或者Lb来配置证书，将https请求解析为http 反代到swoole 
如果你仅测试使用，可以在配置文件中添加和修改以下配置来启用https

```php
'MAIN_SERVER' => [
        'SOCK_TYPE' => SWOOLE_TCP | SWOOLE_SSL, // 默认是 SWOOLE_TCP
        'SETTING' => [
            'ssl_cert_file' => '证书路径，仅支持.pem格式',
            'ssl_key_file' => '私钥路径',
        ]
    ],

```
