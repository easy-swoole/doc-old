## Receiving request event
   
```php
 public static function onRequest(Request $request, Response $response): bool
```

When EasySwoole receives any http request, it executes the event. This event can intercept HTTP requests globally.

```php
<?php
 public static function onRequest(Request $request, Response $response): bool
    {
        //It is not recommended that a controller base class be added to intercept the request.
        //If you really want to intercept, you can return false after judgment.
        $code = $request->getRequestParam('code');
        if (0/*empty($code)Validation failed*/){
            $data = Array(
                "code" => Status::CODE_BAD_REQUEST,
                "result" => [],
                "msg" => 'Validation failed'
            );
            $response->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            $response->withHeader('Content-type', 'application/json;charset=utf-8');
            $response->withStatus(Status::CODE_BAD_REQUEST);
            return false;
        }

        return true;
    }
```

> If $response->end() is executed on this event, the request will not enter the routing matching phase.。

