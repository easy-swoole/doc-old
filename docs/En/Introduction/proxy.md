---
title: Swoole proxy solution
meta:
  - name: description
    content: Agent for swoole server service through apache, nginx, etc.
  - name: keywords
    content: Easyswoole|swoole service agent|service agent
---
# Proxy
Since Swoole Server does not support HTTP protocol, it is recommended to use EasySwoole as a backend service and add NGINX or APACHE as a proxy on the front end. Add forwarding rules by referring to the following example.


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

::: warning 
After the proxy, you can get the real ip of the client through `$request->getHeader('x-real-ip')[0]`
:::

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

## other

- [Project document repository](https://github.com/easy-swoole/doc)

- [DEMO](https://github.com/easy-swoole/demo/)

- QQ exchange group
    - VIP group 579434607 (this group needs to pay 599 RMP)
    - EasySwoole official group 633921431 (full)
    - EasySwoole official two groups 709134628 (full)
    - EasySwoole official three groups 932625047
    
- Business support:
    - QQ 291323003
    - EMAIL admin@fosuss.com   
- Author WeChat

     ![](/resources/authWx.png)
    
- [Donation](../Preface/donation.md)
  Your donation is the greatest encouragement and support for the Swoole project development team. We will insist on development and maintenance. Your donation will be used to:
        
  - Continuous and in-depth development
  - Document and community construction and maintenance
  
- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository, modify and supplement it. Submit **Pull Request** and contact us
