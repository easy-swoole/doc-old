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