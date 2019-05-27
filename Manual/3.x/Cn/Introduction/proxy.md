# Proxy
由于 Swoole Server 对 HTTP 协议的支持并不完整，建议仅将 EasySwoole 作为后端服务，并且在前端增加 NGINX 或 APACHE 作为代理，参照下面的例子添加转发规则

## Nginx
```
server {
    root /data/wwwroot/;
    server_name local.swoole.com;
    
    location / {
        proxy_http_version 1.1;
        proxy_set_header Connection "keep-alive";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forward-For $remote_addr;
        if (!-f $request_filename) {
             proxy_pass http://127.0.0.1:9501;
        }
    }
    
}
```
> 代理之后,可通过`$request->getHeader('x-real-ip')[0]`获取客户端真实ip 
## Apache
```
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

