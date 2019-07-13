## Receiving request event

### The function prototype
```php
 public static function onRequest(Request $request, Response $response): bool
```

When `EasySwoole` receives any http request, then this event will be triggered. This event can intercept HTTP requests globally.


### Demonstration
```php
<?php
 public static function onRequest(Request $request, Response $response): bool
    {
        // The following codes are just the demonstration of the usage of this event.
        // In real life, we recommend that a controller base class shall be added to intercept the request.
        // If you really want to intercept, you can return false at the end.
        $code = $request->getRequestParam('code');
        if (empty($code)){
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

> If `$response->end()` was executed on this event, the request would NOT enter the routing matching phase.