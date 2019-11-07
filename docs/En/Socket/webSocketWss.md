---
title: EasySwoole wss
meta:
  - name: description
    content: 通过nginx实现https的websocket协议
  - name: keywords
    content: EasySwoole Socket|swoole socket|swoole websocket|swoole tcp|swoole udp|php websocket
---

# Websocket支持Wss

这里推荐使用Nginx反向代理解决wss问题。

即客户端通过wss协议连接 `Nginx` 然后 `Nginx` 通过ws协议和server通讯。
**也就是说Nginx负责通讯加解密，Nginx到server是明文的，swoole不用开启ssl，而且还能隐藏服务器端口和负载均衡(何乐不为)。**

```nginx
server {

    # 下面这个部分和你https的配置没有什么区别，如果你是 宝塔 或者是 oneinstack 这里用生成的也是没有任何问题的
    listen 443;
    server_name 这里是你申请的域名;

    ssl on;

    # 这里是你申请域名对应的证书(一定要注意路径的问题，建议绝对路径)
    ssl_certificate 你的证书.crt;
    ssl_certificate_key 你的密匙.key;

    ssl_session_timeout 5m;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 SSLv2 SSLv3;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;
    ssl_verify_client off;

    # 下面这个部分其实就是反向代理 如果你是 宝塔 或者是 oneinstack 请把你后续检查.php相关的 和重写index.php的部分删除
    location / {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:9501;      # 转发到你本地的9501端口 这里要根据你的业务情况填写 谢谢
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr:$remote_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;   # 升级协议头
        proxy_set_header Connection upgrade;
    }
}
```

重启nginx 如果没有错误
[点我打开ws调试工具](https://www.easyswoole.com/wstool.html);

**服务地址输入wss://你上面的域名不加端口号谢谢**

点击开启连接 恭喜你 wss成了