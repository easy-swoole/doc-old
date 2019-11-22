---
title: Http service
meta:
  - name: description
    content: Easyswoole, how to get the client IP
  - name: keywords
    content: Easyswoole|Get client IP|cross domain processing
---


# common problem
## How to get $HTTP_RAW_POST_DATA
```php
$content = $this->request()->getBody()->__toString();
$raw_array = json_decode($content, true);
```
## How to get the client IP
For example, how to get the client IP in the controller
```php
//Real address
$ip = ServerManager::getInstance()->getSwooleServer()->connection_info($this->request()->getSwooleRequest()->fd);
var_dump($ip);
//Header address, for example after nginx proxy
$ip2 = $this->request()->getHeaders();
var_dump($ip2);
```

## HTTP status code is always 500
Since the swoole **1.10.x** and **2.1.x** versions, in the http server callback, if response->end() is not executed, all 500 status codes are returned.

## How to setCookie
Set the cookie by calling the setCookie method of the response object.
```php
  $this->response()->setCookie('name','value');
```
More operations can be seen [Response object] (response.md)


## How to customize the App name
Just modify the namespace registration of composer.json.
```
    "autoload": {
        "psr-4": {
            "App\\": "Application/"
        }
    }
```

