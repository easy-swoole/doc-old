# Rpc
## Git
https://github.com/easy-swoole/rpc
## Composer
```
composer require eaasyswoole/rpc=3.x
```

## Server
```
use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\Request;
use EasySwoole\Rpc\Response;
$config = new Config();
//register server which call 'ser1'
$config->setServiceName('ser1');
$rpc = new Rpc($config);
$rpc->registerAction('call1',function (Request $request,Response $response){
    $response->setMessage('response');
});
$rpc->registerAction('call2',function (Request $request,Response $response){
    $response->setMessage(['response2222222']);
});
//enable auto find process
$autoFindProcess = $rpc->autoFindProcess();
$http = new swoole_http_server("127.0.0.1", 9501);
$http->addProcess($autoFindProcess->getProcess());
$sub = $http->addlistener("127.0.0.1", 9502,SWOOLE_TCP);
$rpc->attachToServer($sub);
$http->on("request", function ($request, $response) {
    $response->end("Hello World\n");
    
});

$http->start();
```

## Client
```
use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\Response;
$config = new Config();
$rpc = new Rpc($config);
go(function ()use($rpc){
    $client = $rpc->client();
    $serviceClient = $client->selectService('ser1');
    $serviceClient->createTask()->setAction('call1')->setArg([
        'arg'=>1
    ])->setOnSuccess(function (Response $response){
        var_dump($response->getMessage());
    })->setOnFail(function (){

    });

    $serviceClient->createTask()->setAction('call2');

    $client->exec();
});
```