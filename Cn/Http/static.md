<head>
     <title>Easyswoole静态文件处理</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="swoole静态文件处理|Easyswoole静态文件处理"/>
     <meta name="description" content="swoole静态文件处理|Easyswoole静态文件处理"/>
</head>
---<head>---

# 如何处理静态资源
## Apache URl rewrite
```text
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
```text
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
## Swoole静态文件处理器
```
$server->set([
    'document_root' => '/data/webroot/example.com', // v4.4.0以下版本, 此处必须为绝对路径
    'enable_static_handler' => true,
]);
```
Swoole 有自带的静态文件处理器。文档请见 https://wiki.swoole.com/wiki/page/783.html