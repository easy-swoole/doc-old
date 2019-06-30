
## Life cycle
Request objects exist in a singleton mode in the system. They are created automatically when the client HTTP request is received and destroyed automatically until the end of the request. The Request object fully conforms to all the specifications in [PSR7](psr-7.md).## 方法列表
### getRequestParam()
Used to obtain parameters submitted by users through POST or GET (Note: If POST and GET have the same key name parameters, then GET prevails).
Example：
```php
// Request objects can be obtained in the controller by $this->request().
// $request = $this->request()；

$data = $request->getRequestParam();
var_dump($data);

$orderId = $request->getRequestParam('orderId');
var_dump($orderId);

$mixData = $request->getRequestParam("orderId","type");
var_dump($mixData);
```
### getSwooleRequest()
Request objects can be obtained in the controller by $this->request().

## Common Methods of ServerRequest Object in PSR-7 Specification
### getCookieParams()
This method is used to obtain cookie information in HTTP requests
```php
$all = $request->getCookieParams();
var_dump($all);
$who = $request->getCookieParams('who');
var_dump($who);
```
### getUploadedFiles()
This method is used to obtain all the file information uploaded by the client.
```php
$img_file = $request->getUploadedFile('img');//Get an upload file that returns an \EasySwoole\Http\Message\Upl object
$data = $request->getUploadedFiles();//Gets all uploaded files and returns an array containing \EasySwoole\Http\Message\UploadFile objects
var_dump($data);
#### \EasySwoole\Http\Message\UploadFile object:
```
Click view[UploadFile object](./UploadFile.html)

### getBody()
This method is used to obtain the original data submitted by POST in non-form-data or x-www-form-urlenceded encoding format, equivalent to $HTTP_RAW_POST_DATA in PHP.
### Get get content
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
