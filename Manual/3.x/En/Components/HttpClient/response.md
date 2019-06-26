## response
```php
<?php
include "./vendor/autoload.php";
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
go(function () {
    $client = new \EasySwoole\HttpClient\HttpClient();
    $client->setUrl('http://a.cn');//Setting url, note that HTTP and HTTPS are required, HTTPS requires swoole extension to open SSL
    $client->addCookie('a','1');
    $response = $client->exec();
    var_dump($response->getBody());//Get the response body
    var_dump($response->getErrCode());//Get the error code
    var_dump($response->getErrMsg());//Get the error message
    var_dump($response->getStatusCode());//Get the reponse status code
    var_dump($response->getCookiesRaw());//Get the cookie that the response header wants to set
    var_dump($response->getCookies());//Get the cookie you sent and the cookie you want to set in the response header
});

```