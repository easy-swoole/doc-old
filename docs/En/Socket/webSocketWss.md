---
title: EasySwoole wss
meta:
  - name: description
    content: Implement https websocket protocol through nginx
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

# Websocket supports Wss

It is recommended to use the Nginx reverse proxy to solve the wss problem.

That is, the client connects `Nginx` through the wss protocol and then `Nginx` communicates with the server through the ws protocol.
**In other words, Nginx is responsible for communication encryption and decryption, Nginx to server is plaintext, swoole does not need to open ssl, but also can hide server port and load balancing (he is not). **

```nginx
server {

    # The following part is no different from your https configuration. If you are a pagoda or a oneinstack, there is no problem with the generated one.
    Listen 443;
    Server_name Here is the domain name you applied for;

    Ssl on;

    # Here is the certificate corresponding to your domain name (must pay attention to the path, suggest an absolute path)
    ssl_certificate // Your certificate.crt;
    ssl_certificate_key // your key.key;

    ssl_session_timeout 5m;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 SSLv2 SSLv3;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;
    ssl_verify_client off;

    # The following part is actually a reverse proxy. If you are a pagoda or a oneinstack, please check your .php related and rewrite the part of index.php.
    location / {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:9501;      # Forward to your local port 9501, here to fill in according to your business situation, thank you
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr:$remote_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;   # Upgrade protocol header
        proxy_set_header Connection upgrade;
    }
}
```

Restart nginx if there are no errors
[Click me to open the ws debugging tool] (https://www.easyswoole.com/wstool.html);

**Service address input wss://Do not add the port number to your domain name above **

Click to open the connection. Congratulations, wss became
