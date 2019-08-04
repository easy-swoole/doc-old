# Proxy

Since `Swoole Server` support for HTTP protocol is incomplete, it is recommended that only EasySwoole be used as a back-end service and NGINX or APACHE be added as a proxy in the front-end. Refer to the following example to add forwarding rules

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
> After the proxy, the client's real IP can be obtained by `$request->getHeader('x-real-ip')[0]`

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

## Other

- [Project Document Warehouse](https://github.com/easy-swoole/doc)

- [DEMO](https://github.com/easy-swoole/demo/)

- QQ exchange group
     - VIP group 579434607 (this group needs to pay 599 RMB)
     - EasySwoole official group 633921431 (full)
     - EasySwoole official second group 709134628
    
- Business support:
     - QQ 291323003
     - EMAIL admin@fosuss.com
     
- Translate by
     - NAME: huizhang
     - QQ: 2788828128
     - EMAIL: <a href="mailto:tuzisir@163.com">tuzisir@163.com</a>


- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us