## Execution after completion of request method

###  The function prototype
```php
public static function afterRequest(Request $request, Response $response): void
{
}
```

## eg
可在该事件中做trace 进行请求的追踪监视,以及获取此次的响应内容
```php
<?php

    public static function afterRequest(Request $request, Response $response): void
    {
        TrackerManager::getInstance()->getTracker()->endPoint('request');

        $responseMsg = $response->getBody()->__toString();
        Logger::getInstance()->console("响应内容:".$responseMsg);
        //响应状态码:
//        var_dump($response->getStatusCode());


        //tracker结束,结束之后,能看到中途设置的参数,调用栈的运行情况
        TrackerManager::getInstance()->closeTracker();
        // TODO: Implement afterAction() method.
    }
```

