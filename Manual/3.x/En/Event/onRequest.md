## Receiving request event
   
### The function prototype
```php
 public static function onRequest(Request $request, Response $response): bool
```

When `EasySwoole` receives any http request, the `onRequest` event will be emitted and this function will be called automatically. 
This event can intercept HTTP requests globally.

```php
<?php
 public static function onRequest(Request $request, Response $response): bool
    {
        // It is just an example and not recommended
        // The best way is put all logic into a controller class
        // If you really want to intercept, you can return false after judgment.
        $code = $request->getRequestParam('code');
        if (empty($code)){
            /**
             * $code Validation failed
             */
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
        
        /**
         * $code is valid
         */
        return true;
    }
```

> If $response->end() is executed in this event, the request will not enter the routing matching phase.

