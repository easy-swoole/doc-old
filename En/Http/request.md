<head>
     <title>EasySwoole route|swoole route|swoole Api service|swoole custom route</title>
     <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
     <meta name="keywords" content="EasySwoole Request|swoole http|swoole Api document"/>
     <meta name="description" content="EasySwoole Request|swoole http|swoole Api document"/>
</head>
---<head>---

## Life cycle
The `Request` implements the `singleton pattern` in the `EasySwoole`. 
It's created automatically since a HTTP client's request is received and destroyed automatically till the end of the process. 
The Request object fully conforms to all the specifications in [PSR7].

## Usage

### getRequestParam()
Used to obtain all parameters which submitted by the HTTP client through POST or GET (Note: If POST and GET have the same key name parameters, then GET prevails).
For example：
```php
// Request object can be obtained in the controller by $this->request().
// $request = $this->request()；

$data = $request->getRequestParam();
var_dump($data);

$orderId = $request->getRequestParam('orderId');
var_dump($orderId);

$mixData = $request->getRequestParam("orderId","type");
var_dump($mixData);
```

### getSwooleRequest()
To get the `swoole_http_request` object.

## Common Methods of ServerRequest Object in PSR-7 Specification
### getCookieParams()
This method is used to obtain cookie information in HTTP request
```php
$all = $request->getCookieParams();
var_dump($all);
$who = $request->getCookieParams('who');
var_dump($who);
```

### getUploadedFiles()
This method is used to obtain all the file information uploaded by the client.
```php
<?php 
//Get an upload file as an \EasySwoole\Http\Message\UploadFile object
$img_file = $request->getUploadedFile('img');

//Gets all uploaded files and returns an array containing \EasySwoole\Http\Message\UploadFile objects
$data = $request->getUploadedFiles();
var_dump($data);
```
Click view[UploadFile object](./UploadFile.html)

### getBody()
This method is used to obtain the original data submitted by POST in non-form-data or x-www-form-urlenceded encoding format, 
equivalent to $HTTP_RAW_POST_DATA in PHP.

### Get get content: query parameters
```php
$get = $request->getQueryParams();
```

### Get post Content
```php
$post = $request->getParsedBody();
```

### Get raw Content
```php
$content = $request->getBody()->__toString();
$raw_array = json_decode($content, true);
```

### Get header
```php
$header = $request->getHeaders();
```

### Get server
```php
$server = $request->getServerParams();
```

### Get cookie
```php
$cookie = $request->getCookieParams();
```
