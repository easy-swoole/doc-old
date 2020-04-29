---
title: afterRequest
meta:
  - name: description
    content: swoole事件,请求方法结束后执行
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|EasySwoole|swoole事件|afterRequest
---
## 请求方法结束后执行

###  函数原型
```php
public static function afterRequest(Request $request, Response $response): void
{
}
```

## 示例
可在该事件中做trace 进行请求的追踪监视,以及获取此次的响应内容
```php
public static function afterRequest(Request $request, Response $response): void
{
    TrackerManager::getInstance()->getTracker()->endPoint('request');

    $responseMsg = $response->getBody()->__toString();
    Logger::getInstance()->console("响应内容:".$responseMsg);
    // 响应状态码:
    // var_dump($response->getStatusCode());


    // tracker结束,结束之后,能看到中途设置的参数,调用栈的运行情况
    TrackerManager::getInstance()->closeTracker();
    // TODO: Implement afterAction() method.
}
```

