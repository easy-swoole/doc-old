# Client
## CLI Independent Testing (Note Namespace and Automatic Load Introduction)
````php
<?php
/**
 * Created by PhpStorm.
 * User: xcg
 * Date: 2019/2/27
 * Time: 10:03
 */
include_once dirname(__DIR__) . "/vendor/autoload.php";

use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Rpc;
use EasySwoole\Rpc\Response;

$config = new Config();
//$config->setNodeManager(\EasySwoole\Rpc\NodeManager\TableManager::class);//设置节点管理器处理类,默认是EasySwoole\Rpc\NodeManager\FileManager
$rpc = new Rpc($config);
//Get a list of all service nodes
$nodeList = $config->getNodeManager()->allServiceNodes();
var_dump($nodeList);

go(function () use ($rpc) {
    $client = $rpc->client();
    //Call service
    $serviceClient = $client->selectService('ser1');
    //Create Execution Tasks
    $serviceClient->createTask()->setAction('call1')->setArg(['arg' => 1])
        ->setOnSuccess(function (Response $response) {
            echo ($response->getMessage()).PHP_EOL;
        })->setOnFail(function () {
            echo ("Failure of request 1!\n");
        });

    //Create Execution Tasks
    $serviceClient->createTask()->setAction('call3')
        ->setOnSuccess(function (Response $response) {
            echo ($response->getMessage()).PHP_EOL;
        })->setOnFail(function () {
            echo ("Failure of request 2!\n");
        });

    //Create Execution Tasks
    $serviceClient2 = $client->selectService('ser2');
    $serviceClient2->createTask()->setAction('call1')
        ->setOnSuccess(function (Response $response) {
            echo ($response->getMessage()).PHP_EOL;
        })->setOnFail(function () {
            echo ("Failure of request 3!\n");
        });
    $client->exec();//Start execution
});
````