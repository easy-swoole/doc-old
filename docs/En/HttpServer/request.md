---
title: Life cycle
meta:
  - name: description
    content: easyswoole,Life cycle
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Life cycle
---
## Life cycle
The Request object exists in the system in singleton mode, and is automatically created when the client HTTP request is received, until the request ends automatically. The Request object is fully compliant with all the specifications in [PSR7] (psr-7.md).
##Method list
### getRequestParam()
Used to get the parameters submitted by the user through POST or GET (Note: If POST and GET have the same key name parameter, GET will be used).
Example:
```php
// In the controller, the Request object can be obtained via $this->request()
// $request = $this->request()；

$data = $request->getRequestParam();
var_dump($data);

$orderId = $request->getRequestParam('orderId');
var_dump($orderId);

$mixData = $request->getRequestParam("orderId","type");
var_dump($mixData);
```
### getSwooleRequest()
This method is used to get the current swoole_http_request object.

## PSR-7 Specifications Common Methods in the ServerRequest Object
### getCookieParams()
This method is used to obtain the cookie information in the HTTP request.
```php
$all = $request->getCookieParams();
var_dump($all);
$who = $request->getCookieParams('who');
var_dump($who);
```
### getUploadedFiles()
This method is used to obtain all file information uploaded by the client.
```php
$img_file = $request->getUploadedFile('img');//Get an upload file that returns an object of \EasySwoole\Http\Message\UploadFile
$data = $request->getUploadedFiles();//Get all uploaded files and return an array containing the \EasySwoole\Http\Message\UploadFile object
var_dump($data);
#### \EasySwoole\Http\Message\UploadFile对象:
```
Click to view [UploadFile object] (./uploadFile.md)

### getBody()
This method is used to get the raw data submitted by POST in non-form-data or x-www-form-urlenceded encoding format, which is equivalent to $HTTP_RAW_POST_DATA in PHP.

### Get get content
```php
$get = $request->getQueryParams();
```

### Get post content
```php
$post = $request->getParsedBody();
```

### Get raw content
```php
$content = $request->getBody()->__toString();
$raw_array = json_decode($content, true);
```

### Getting the head
```php
$header = $request->getHeaders();
```
### Get the server
```php
$server = $request->getServerParams();
```
### Get a cookie
```php
$cookie = $request->getCookieParams();
```
