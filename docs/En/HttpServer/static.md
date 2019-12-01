---
title: Static file processing
meta:
  - name: description
    content: Swoole static file processing,EasySwoole static file processing
  - name: keywords
    content: Swoole static file processing|EasySwoole static file processing
---


# How to handle static resources
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
        if (!-e $request_filename) {
             proxy_pass http://127.0.0.1:9501;
        }
    }
}
```
## Swoole static file processor
```php
$server->set([
    'document_root' => '/data/webroot/example.com', // V4.4.0 or lower, here must be an absolute path
    'enable_static_handler' => true,
]);
```
Swoole comes with its own static file processor. The documentation can be found at https://wiki.swoole.com/wiki/page/783.html

## About cross-domain processing

Add the following code in the global event to block all requests to add cross-domain headers

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