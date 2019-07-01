# Reverse Proxy
Because `Swoole` can't fully support HTTP protocol, so `EasySwoole` shall be used as a backend service application only. We recommend
to use `Nginx`/`Apache` as the proxy in the front then forward all incoming requests to `EasySwoole` application.

```bash
// Make sure you start the service application: it will start listening at port 9501
php easyswoole start d
```

## Nginx
```
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
> You can get the client's IP with: $request->getHeader('x-real-ip')[0]

## Apache
```
<IfModule mod_rewrite.c>
  Options +FollowSymlinks
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  #RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]  # Invalid in fcgi mode
  RewriteRule ^(.*)$  http://127.0.0.1:9501/$1 [QSA,P,L]
   # make sure proxy_mod proxy_http_mod and request_mod are activated
</IfModule>
```