# 跨平台

## 示例代码

### 服务端
```php
use EasySwoole\Rpc\RequestPackage;
use EasySwoole\Rpc\Config;
use EasySwoole\Rpc\Response;
$conf = new Config();
$conf->setServiceName('serviceName');
$conf->setBroadcastTTL(4);
//开启通讯密钥
//$conf->setAuthKey('123456');

//创建主服务
$ser = new \swoole_http_server('0.0.0.0',9501);

$ser->on('request',function ($request,$response){
    $response->write('hello world');
    $response->end();
});

$rpc = new \EasySwoole\Rpc\Rpc($conf);

//注册action
$rpc->getActionList()->register('a1',function (RequestPackage $package, Response $response,\swoole_server $server,int $fd){
    var_dump($package->getArg());
    return 'AAA';
});

$rpc->getActionList()->register('a2',function (RequestPackage $package, Response $response,\swoole_server $server,int $fd){
    \co::sleep(0.2);
    return 'a2';
});


//注册广播进程，主动对外udp广播服务节点信息
$ser->addProcess($rpc->getRpcBroadcastProcess());

//创建一个udp子服务，用来接收udp广播

$udp = $ser->addListener($conf->getBroadcastListenAddress(),$conf->getBroadcastListenPort(),SWOOLE_UDP);
$udp->on('packet',function (\swoole_server $server, string $data, array $client_info)use($rpc){
    $rpc->onRpcBroadcast($server,$data,$client_info);
});

//创建一个tcp子服务，用来接收rpc的tcp请求。
$sub = $ser->addListener($conf->getListenAddress(),$conf->getListenPort(),SWOOLE_TCP);
$sub->set($conf->getProtocolSetting());
$sub->on('receive',function (\swoole_server $server, int $fd, int $reactor_id, string $data)use($rpc){
    $rpc->onRpcRequest( $server,  $fd,  $reactor_id,  $data);
});

$ser->start();
``` 

### 客户端

#### EasySwoole 封装实现
```php
//cli下独立测试

$conf = new \EasySwoole\Rpc\Config();
$rpc = new \EasySwoole\Rpc\Rpc($conf);
$conf->setServiceName('serviceName');
//开启通讯密钥
//$conf->setAuthKey('123456');

//虚拟一个服务节点
$serviceNode = new \EasySwoole\Rpc\ServiceNode();
$serviceNode->setServiceName('serviceName');
$serviceNode->setServiceIp('127.0.0.1');
$serviceNode->setServicePort(9601);
$serviceNode->setNodeId('asadas');
//设置为永不过期
$serviceNode->setNodeExpire(0);
$rpc->nodeManager()->refreshServiceNode($serviceNode);

go(function ()use($rpc){
    $client = $rpc->client();
    $client->selectService('serviceName')->callAction('a1')->setArg(
        [
            'callTime'=>time()
        ]
    )->onSuccess(function (\EasySwoole\Rpc\Task $task,\EasySwoole\Rpc\Response $response,?\EasySwoole\Rpc\ServiceNode $serviceNode){
        var_dump('success'.$response->getMessage());
    })->onFail(function (\EasySwoole\Rpc\Task $task,\EasySwoole\Rpc\Response $response,?\EasySwoole\Rpc\ServiceNode $serviceNode){
        var_dump('fail'.$response->getStatus());
    })->setTimeout(1.5);

    $client->selectService('serviceName')->callAction('a2')->onSuccess(function (){
        var_dump('succ');
    });
    $client->call(1.5);
});
```


### 原生PHP
```
//以下例子为未启用数据openssl加密

$authKey  = null; //RPC鉴权秘钥，默认null

$data = [
    'nodeId'=>'xxx',//节点id，如果没有做节点过滤，那么随意构造
    'packageId'=>'xxxxx',//包Id,随意构造
    'action'=>'a1',//行为名称
    'packageTime'=>time(),//包请求时间
    'arg'=>[
        'args1'=>'args1',
        'args2'=>'args2'
    ]
];

$data['signature'] = md5($data['packageId'].$authKey.$data['packageTime'].implode('',$data['arg']));

$raw = json_encode($data);
//如果启用了openssl ，请在此处对$raw 加密 ，加密方法为 DES-EDE3


$fp = stream_socket_client('tcp://127.0.0.1:9601');
fwrite($fp,pack('N', strlen($raw)).$raw);

$data = fread($fp,65533);
//做长度头部校验
$len = unpack('N',$data);
$data = substr($data,'4');
if(strlen($data) != $len[1]){
    echo 'data error';
}else{
    $json = json_decode($data,true);
    //这就是服务端返回的结果，
    var_dump($json);
}
fclose($fp);
```

## NodeJs 
```
var net = require('net');
var pack = require('php-pack').pack;
var unpack = require('php-pack').unpack;
var md5 = require("md5");

var authKey = '';

var json = {
    'nodeId':'xxx',//节点id，如果没有做节点过滤，那么随意构造
    'packageId':'xxxxx',//包Id,随意构造
    'action':'a1',//行为名称
    'packageTime':'',//包请求时间
    'arg':{
        'argKey1':'arg1',
        'argKey2':'arg2'
    },
    'signature':'xxx'//包签名
};


json.packageTime = parseInt(Date.now()/1000);

var argString = '';

for(var key in json.arg){
    argString += json.arg[key];
}

console.log(json.packageId + authKey + json.packageTime + argString);


json.signature = md5(json.packageId + authKey + json.packageTime + argString);

console.log(json.signature);

var send = JSON.stringify(json);
//
send = Buffer.concat([pack("N",send.length), Buffer.from(send)]);

var client = new net.Socket();
client.connect(9601, '127.0.0.1', function() {
    console.log('Connected');
    client.write(send);
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    var ret = JSON.parse(data.toString().substr(4));
    console.log('status: ' +  ret.status);
    client.destroy()
});

client.on('close', function() {
    console.log('Connection closed');
    client.destroy()
});
client.on('error',function (error) {
    console.log(error);
    client.destroy()
});
```