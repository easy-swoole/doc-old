---
title: HTTPClient
meta:
  - name: description
    content: EasySwoole coroutine HTTPClient component
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole| coroutine HTTPClient|curl component|coroutine curl
---


## EasySwoole coroutine HTTPClient component
The coroutine httpClient component, based on the swoole [asynchronous http client client] (https://wiki.swoole.com/wiki/page/p-http_client.html), can initiate http requests in the coroutine without being blocked. In downloading files, requesting apis, crawlers, etc.

## installation

```bash
composer require easyswoole/http-client
```

## Single request
```php
<?php
$url = 'http://docker.local.com/test.php/?get1=get1';
$test = new \EasySwoole\HttpClient\HttpClient($url);
//$test->post();

$test->addCookie('c1','c1')->addCookie('c2','c2');

$test->setHeader('myHeader','myHeader');

$ret = $test->postJSON(json_encode(['json'=>1]));

var_dump($ret->getBody());
```

## Concurrent request

For the Http Client Concurrency Request section, we recommend that users use the [Csp Package] (../Component/csp.md) provided in the EasySwoole component.
