## A hook function After the request has been handled
> Note: Right before the cookie sending to the client

###  The function prototype
```php
public static function afterRequest(Request $request, Response $response): void
{
}
```

## What to do in this stage

In this event, you can get request and the response content, so it is a perfect place to put some codes for tracking or logging purpose.
```php
<?php

    public static function afterRequest(Request $request, Response $response): void
    {
        TrackerManager::getInstance()->getTracker()->endPoint('request');
        $responseMsg = $response->getBody()->__toString();
        Logger::getInstance()->console("Corresponding content:".$responseMsg);
        // Response State Code:
        // var_dump($response->getStatusCode());

        // When the tracker is closed, you can check the parameters during the lifecycle and the operation of the call stack.
        TrackerManager::getInstance()->closeTracker();
        // TODO: Implement afterAction() method.
    }
```

