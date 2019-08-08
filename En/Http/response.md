<head>
     <title>EasySwoole route|swoole route|swoole Api service|swoole custom route</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Response|swoole http|swoole Api document"/>
     <meta name="description" content="EasySwoole Response|swoole http|swoole Api document"/>
</head>
---<head>---

# Response object
## Life cycle
The `Response` implements the `singleton pattern` in the `EasySwoole`. 
It's created automatically since a HTTP client's request is received and destroyed automatically till the end of the process. 
The Request object fully conforms to all the specifications in [PSR7].

Other details, interested students can view the corresponding code in the IDE.

## Methods List
### write
This method is used to respond data to the client.
```
$this->response()->write('hello world');
```

### redirect
This method is used to redirect the request to another specified URL
```
$this->response()->redirect("/newURL/index.html");
```

### setCookie
Set a Cookie to the client in the same way as the original setCookie.

### getSwooleResponse
Used to get the original `swoole_http_response` instance.

### end
Explicitly stop the response. After this, you can not respond any more data to the client.

### isEndResponse
When you don't know whether the response has been ended, you may use this method to determine whether you can still respond data to the client:
```php
if(!$this->response()->isEndResponse()){
    $this->response()->write('Continue sending data');
}
```

## PSR-7 Specification Response Object Commonly Used Methods
### withStatus
Send HTTP status code to client.
```php
$this->response()->withStatus($statusCode);
```
> Note: $statusCode must be a standard HTTP allowable status code, see the Status object in Http Message for details.

### withHeader
Used to send a header to an HTTP client.
```
$this->response()->withHeader('Content-type','application/json;charset=utf-8');
```