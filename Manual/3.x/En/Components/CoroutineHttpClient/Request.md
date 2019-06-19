## request
```php
<?php
include "./vendor/autoload.php";
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
go(function () {
    $client = new \EasySwoole\HttpClient\HttpClient();
    $client->setUrl('http://a.cn');//Setting url, note that http and https are required, HTTPS requires swoole extension to open SSL
    $client->setTimeout(0.1);//Setting timeout time
    $client->setConnectTimeout(0.1);//Set connection timeout
    $client->setClientSettings(['timeout' => 0.1, 'connect_timeout' => 0.1]);//Configure the client configuration (which will cover the original configuration), refer to https://wiki.swoole.com/wiki/page/726.html
    $client->setClientSetting('timeout', 0.1);//Configure a single configuration
    $client->setHeaders([
        "User-Agent"      => 'EasySwooleHttpClient/0.1',
        'Accept'          => 'text/html,application/xhtml+xml,application/xml',
        'Accept-Encoding' => 'gzip',
        'Pragma'          => 'no-cache',
        'Cache-Control'   => 'no-cache'
    ]);//Configuration request header(The original configuration will be covered)
//    $client->setHeader('User-Agent','EasySwooleHttpClient/1');//Setting a request header
//    $client->post(['name','This is the content of post.']);//Send a post content
//    $client->postJSON(json_encode(['name2','这是post的内容']));//Send a post json content
//    $client->postXML("<name2>This is the content of post.</name2>");//Send a post xml content
//    $client->addFile("./1.txt",'file1','txt','1.txt','0',strlen(file_get_contents('./1.txt')));//Send a file, note the size of the file
//    $client->addData('This is the content of the file.','data1','txt','1.txt');//Send a piece of content into a file
    $client->addCookies(['aa'=>'a','bb'=>'b']);//set cookie(The original configuration will be covered)
    $client->addCookie('a','a');//Setting up a cookie
    $response = $client->exec();//Execution of requests
    echo ($response->getBody());
//    var_dump($client->getSwooleHttpClient()->headers);//Get the original http client of the swoole

    //Concurrent requests
    $multi = new \EasySwoole\HttpClient\Multi();
    $multi->addTask('tast1',$client);
    $multi->addTask('tast2',$client);
    $multi->addTask('tast3',$client);
    var_dump($multi->exec());//Execute concurrent requests


});
```


