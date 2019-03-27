## EasySwoole 协程HTTPClient组件
协程httpClient组件,基于swoole [异步http client客户端](https://wiki.swoole.com/wiki/page/p-http_client.html)实现,可在协程内发起http请求不被阻塞,可用于下载文件,请求api,爬虫等一系列需求当中,  
composer引入:
````
composer require easyswoole/http-client
````
示例:  

单次请求:  
```php
<?php
$url = 'http://docker.local.com/test.php/?get1=get1';
$test = new \EasySwoole\HttpClient\HttpClient($url);
//$test->post();

$test->addCookie('c1','c1')->addCookie('c2','c2');
$test->post([
    'post1'=>'post1'
]);
$test->setHeader('myHeader','myHeader');
$test->addData('sasasas','test.file','text','test.file');

//$test->postJSON(json_encode(['json'=>1]));

$ret = $test->exec();
var_dump($ret->getBody());
```
并发请求:   
```php
<?php
$url = 'http://docker.local.com/test.php/?get1=get1';
$test = new \EasySwoole\HttpClient\HttpClient($url);
$multi = new \EasySwoole\HttpClient\Multi();
$multi->addTask('t1',$test);
$multi->addTask('t2',$test);
$ret = $multi->exec();
foreach ($ret as $taskName => $response){
    var_dump("task {$taskName} finish and body is {$response->getBody()}");
}
```
