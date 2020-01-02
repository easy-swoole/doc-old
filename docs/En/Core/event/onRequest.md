---
title: onRequest
meta:
  - name: description
    content: 收到请求事件
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole|swoole|onRequest
---
## onRequestEvent

```php
 public static function onRequest(Request $request, Response $response): bool
```

EasySwoole executes this event when it receives any HTTP request. This event can intercept HTTP requests globally。

```php
<?php
 public static function onRequest(Request $request, Response $response): bool
    {
        //It is not recommended to intercept requests here, but to add a controller base class for interception
        //If you want to intercept, return false
        $code = $request->getRequestParam('code');
        if (0/*empty($code)Validation fails*/){
            $data = Array(
                "code" => Status::CODE_BAD_REQUEST,
                "result" => [],
                "msg" => 'Validation fails'
            );
            $response->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            $response->withHeader('Content-type', 'application/json;charset=utf-8');
            $response->withStatus(Status::CODE_BAD_REQUEST);
            return false;
        }

        return true;
    }
```


::: warning 
 If $response->end() is executed in this event, the request will not enter the route matching phase.
:::

