<head>
     <title>EasySwoole 协程Http客户端|swoole 协程Http客户端|swoole 协程Http|php 协程客户端</title>
     <meta name="keywords" content="EasySwoole 协程Http客户端|swoole 协程Http客户端|swoole 协程Http|php 协程客户端"/>
     <meta name="description" content="php用swoole里面的协程客户端，实现对http请求封装的基本库"/>
</head>
---<head>---

## 响应
```php
<?php
include "./vendor/autoload.php";
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
go(function () {
    $client = new \EasySwoole\HttpClient\HttpClient();
    $client->setUrl('http://a.cn');//设置url,注意需要http和https,https
    $client->addCookie('a','1');
    $response = $client->exec();
    var_dump($response->getBody());//获取响应主体
    var_dump($response->getErrCode());//获取错误码
    var_dump($response->getErrMsg());//获取错误信息
    var_dump($response->getStatusCode());//获取响应状态码
    var_dump($response->getCookiesRaw());//获取响应头想要设置的cookie
    var_dump($response->getCookies());//获取自己发送的cookie,以及响应头想要设置的cookie
});

```