---
title: afterRequest
meta:
  - name: description
    content: swoole事件,请求方法结束后执行
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole|swoole事件|afterRequest
---
## afterRequest

###  The function prototype
```php
public static function afterRequest(Request $request, Response $response): void
{
}
```

## The sample
You can trace the event to monitor the request and get the content of the response
```php
public static function afterRequest(Request $request, Response $response): void
{
    TrackerManager::getInstance()->getTracker()->endPoint('request');

    $responseMsg = $response->getBody()->__toString();
    Logger::getInstance()->console("Response content:".$responseMsg);
    // Response status code:
    // var_dump($response->getStatusCode());


    // tracker end,After the end, you can see halfway set parameters, call stack running
    TrackerManager::getInstance()->closeTracker();
    // TODO: Implement afterAction() method.
}
```

