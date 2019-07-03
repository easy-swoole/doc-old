# Response object
## Life cycle
Response objects exist in a singleton mode in the system and are created automatically from the time the client HTTP request is received until the request is destroyed automatically. Response objects fully conform to all the specifications in [PSR7] (psr-7.md).
Other details, interested students can view the corresponding code in the IDE.

## Method List
### write
This method is used to respond data to customers.
```
$this->response()->write('hello world');
```

### redirect
This method is used to redirect requests to the specified URL
```
$this->response()->redirect("/newURL/index.html");
```
### setCookie
Set a Cookie to the client in the same way as the original setCookie.
### getSwooleResponse
Used to get the original swoole_http_response instance.
### end
End the response to this HTTP request, after the end, the client can not respond to the data again.
### isEndResponse
When you don't know whether the HTTP request has ended the response, you can use this method to determine whether you can respond to the client data again:
```php
if(!$this->response()->isEndResponse()){
    $this->response()->write('Continue sending data');
}
```
## PSR-7 Specification Response Object Commonly Used Method
### withStatus
Send HTTP status code to client.
```
$this->response()->withStatus($statusCode);
```
> Note: $statusCode must be a standard HTTP allowable status code, see the Status object in Http Message for details.

### withHeader
Used to send a header to an HTTP client.
```
$this->response()->withHeader('Content-type','application/json;charset=utf-8');
```