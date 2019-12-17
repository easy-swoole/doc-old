---
title: Easyswoole 静态文件处理
meta:
  - name: description
    content: Easyswoole静态文件处理
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|swoole静态文件处理|Easyswoole静态文件处理|swoole|swoole框架
---


# 如何处理静态资源
## Apache URl rewrite
```apacheconf
<IfModule mod_rewrite.c>
  Options +FollowSymlinks
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  #RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]  fcgi下无效
  RewriteRule ^(.*)$  http://127.0.0.1:9501/$1 [QSA,P,L]
   #请开启 proxy_mod proxy_http_mod request_mod
</IfModule>
```

## Nginx URl rewrite
```nginx
server {
    root /data/wwwroot/;
    server_name local.swoole.com;
    location / {
        proxy_http_version 1.1;
        proxy_set_header Connection "keep-alive";
        proxy_set_header X-Real-IP $remote_addr;
        if (!-f $request_filename) {
             proxy_pass http://127.0.0.1:9501;
        }
    }
}
```
## Swoole静态文件处理器
```php
$server->set([
    'document_root' => '/data/webroot/example.com', // v4.4.0以下版本, 此处必须为绝对路径
    'enable_static_handler' => true,
]);
```
Swoole 有自带的静态文件处理器。文档请见 https://wiki.swoole.com/wiki/page/783.html

## 关于跨域处理

在全局事件添加以下代码 拦截所有请求添加跨域头

```php
public static function onRequest(Request $request, Response $response): bool
{
    // TODO: Implement onRequest() method.
    $response->withHeader('Access-Control-Allow-Origin', '*');
    $response->withHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $response->withHeader('Access-Control-Allow-Credentials', 'true');
    $response->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if ($request->getMethod() === 'OPTIONS') {
        $response->withStatus(Status::CODE_OK);
        return false;
    }
    return true;
}
```
