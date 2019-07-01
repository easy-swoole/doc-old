# Server
## Independent use of code
````php
<?php
/**
 * Created by PhpStorm.
 * User: xcg
 * Date: 2019/2/27
 * Time: 10:00
 */
include_once dirname(__DIR__) . "/vendor/autoload.php";

use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\Request;
use EasySwoole\Rpc\Response;

$config = new Config();
//Registration Service Name
$config->setServiceName('ser1');
//Set up broadcast address, you can have more than one address
$config->getAutoFindConfig()->setAutoFindBroadcastAddress(['127.0.0.1:9600']);
//Setting up the radio monitor address
$config->getAutoFindConfig()->setAutoFindListenAddress('127.0.0.1:9600');
//$config->setNodeManager(\EasySwoole\Rpc\NodeManager\TableManager::class);//Set up the node manager processing class, which defaults to EasySwoole\Rpc\NodeManager\FileManager


$rpc = new Rpc($config);
//Registration response method
$rpc->registerAction('call1', function (Request $request, Response $response) {
    //Get the request parameters
    var_dump($request->getArg());
    //Settings returned to client information
    $response->setMessage('response');
});
//Registration response method 2
$rpc->registerAction('call2', function (Request $request, Response $response)
{});


//Listen / broadcast RPC custom process object
$autoFindProcess = $rpc->autoFindProcess('es_rpc_process_1');



//Create a second RPC service
$config2=new Config();
$config2->setServiceName('ser2');
$rpc2 = new Rpc($config2);

//Listen / broadcast RPC custom process object
$autoFindProcess2 = $rpc2->autoFindProcess('es_rpc_process_2');

//Create http swoole services
$http = new swoole_http_server("127.0.0.1", 9525);

//Add a custom process to the service and start the process
$http->addProcess($autoFindProcess->getProcess());
$http->addProcess($autoFindProcess2->getProcess());

//RPC runs as a sub-service
$sub = $http->addlistener("127.0.0.1", 9527, SWOOLE_TCP);
$sub2 = $http->addlistener("127.0.0.1", 9528, SWOOLE_TCP);

//Inject swoole tcp sub-service into RPC object and start listening processing
$rpc->attachToServer($sub);
$rpc2->attachToServer($sub2);

/**
 * HTTP request callback
 */
$http->on("request", function ($request, $response) {
    $response->end("Hello World\n");
});
$http->start();


////rpc Running as a primary service
//$tcp = new swoole_server('127.0.0.1', 9526);
//$tcp->addProcess($autoFindProcess->getProcess());
//$rpc->attachToServer($tcp);

//$tcp->start();
````

