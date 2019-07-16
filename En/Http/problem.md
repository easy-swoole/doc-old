<head>
     <title>swoole directional agent|How does swoole get $HTTP_RAW_POST_DATA swoole php://input</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole FAQ and answers"/>
     <meta name="description" content="EasySwoole FAQ and answers"/>
</head>
---<head>---

# FAQ
## How to obtain $HTTP_RAW_POST_DATA
```php
$content = $this->request()->getBody()->__toString();
$raw_array = json_decode($content, true);
```

## How to Get Client IP
For example, how to get client IP in the controller
```php
// Real IP
$ip = ServerManager::getInstance()->getSwooleServer()->connection_info($this->request()->getSwooleRequest()->fd);
var_dump($ip);

//header Address, eg. after nginx proxy
$ip2 = $this->request()->getHeaders();
var_dump($ip2);
```

## How to deal with static resources
Apache URl rewrite
```
<IfModule mod_rewrite.c>
  Options +FollowSymlinks
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  #RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]  Invalid under fcgi
  RewriteRule ^(.*)$  http://127.0.0.1:9501/$1 [QSA,P,L]
   #Open it, please. proxy_mod proxy_http_mod request_mod
</IfModule>
```

Nginx URl rewrite
```
server {
    root /data/wwwroot/;
    server_name local.swoole.com;
    location / {
        proxy_http_version 1.1;
        proxy_set_header Connection "keep-alive";
        proxy_set_header X-Real-IP $remote_addr;
        if (!-e $request_filename) {
             proxy_pass http://127.0.0.1:9501;
        }
    }
}
```
## The total HTTP status code is 500
Since the swoole ** 1.10.x ** and ** 2.1.x ** versions, when the http server callback is executed, if response-> end () is not executed, the server will always return 500.

## How to Set Cookie  
Calling the `setCookie()` method of the response object to set the cookies
```php
  $this->response()->setCookie('name','value');
```
More details, please refer to [Response object](response.md)


## How to Customize App Namespace for your application
Just modify composer.json's namespace registration
```
    "autoload": {
        "psr-4": {
            "App\\": "Application/"
        }
    }
```

## Deal with Cross-domain request

Add the following code to the global event to intercept all requests and add cross-domain headers

```php
public static function onRequest(Request $request, Response $response): bool
{
    // Implement onRequest() method.
    $response->withHeader('Access-Control-Allow-Origin', '*');
    $response->withHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $response->withHeader('Access-Control-Allow-Credentials', 'true');
    $response->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if ($request->getMethod() === 'OPTIONS') {
        $response->withStatus(Status::CODE_OK);
        return false;
    }
    return true;
}
```