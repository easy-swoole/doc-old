---
title: Response object
meta:
  - name: description
    content: easyswoole,Response object
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Response object
---
# Response object
## Life cycle
   The Response object exists in the system in singleton mode and is automatically created when the client HTTP request is received, until the request ends automatically. The Response object is fully compliant with all the specifications in [PSR7] (psr-7.md).
   Other details, interested students can view the corresponding code in the IDE.
   
##Method list
### write
This method is used to respond to data to the customer.
```
$this->response()->write('hello world');
```

### redirect
This method is used to redirect the request to the specified URL
```
$this->response()->redirect("/newURL/index.html");
```
### setCookie
Set a cookie to the client in the same way as the native setCookie.
### getSwooleResponse
Used to get the original swoole_http_response instance.
### end
End the response to the HTTP request. After the end, the data cannot be responded to the client again.
### isEndResponse
Determine whether the HTTP request ends the response. When you don't know whether the response has been ended, you can use this method to determine whether you can respond to the client again:
```php
If(!$this->response()->isEndResponse()){
     $this->response()->write('Continue to send data');
}
```
## PSR-7 Specification Common Methods in Response Objects

### withStatus

Send an HTTP status code to the client.

```php
$this->response()->withStatus($statusCode);
```

::: warning 
 Note: $statusCode must be a standard HTTP allowed status code. See the Status object in the Http Message for details.
 :::
 
### withHeader
Used to send a header to an HTTP client.
```php
$this->response()->withHeader('Content-type','application/json;charset=utf-8');
```
