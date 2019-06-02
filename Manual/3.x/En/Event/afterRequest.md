## Execution after completion of request method

###  The function prototype
```php
public static function afterRequest(Request $request, Response $response): void
{
}
```

## For example
   
Trace can be used in this event to track requests and obtain the response content.
```php
<?php

    public static function afterRequest(Request $request, Response $response): void
    {
        TrackerManager::getInstance()->getTracker()->endPoint('request');
        $responseMsg = $response->getBody()->__toString();
        Logger::getInstance()->console("Corresponding content:".$responseMsg);
        // Response State Code:
//        var_dump($response->getStatusCode());
        // When tracker is finished, you can see the parameters set in the middle and the operation of the call stack.
        TrackerManager::getInstance()->closeTracker();
        // TODO: Implement afterAction() method.
    }
```

