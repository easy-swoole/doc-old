# EasySwoole  Tcp service
TCP service and TCP client demo:https://github.com/easy-swoole/demo/tree/3.x-subtcp

## Create TCP services
Adding sub-service listeners through the `mainServerCreate'event of the `EasySwooleEvent.php` file, for example:
````php
<?php
public static function mainServerCreate(EventRegister $register)
{
    $server = ServerManager::getInstance()->getSwooleServer();

    ################# TCP server 1 did not process sticky packages #####################
    $subPort1 = $server->addlistener('0.0.0.0', 9502, SWOOLE_TCP);
    $subPort1->set(
        [
            'open_length_check' => false,//Unvalidated Packet
        ]
    );
    $subPort1->on('connect', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "TCP service 1  fd:{$fd} Connected\n";
        $str = 'Congratulations on your successful connection to Server 1';
        $server->send($fd, $str);
    });
    $subPort1->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "TCP service 1  fd:{$fd} Closed\n";
    });
    $subPort1->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "tcp服务1  fd:{$fd} send message:{$data}\n";
    });
}
````
### Sticky package problem
Due to the characteristics of tcp, data sticking may occur, such as
* A Connection Server
* A Send hello
* A Sends another hello
* Server may receive a "hello hello" data at one time
* Server may also receive interrupt data like "he" and "llohello"

### Sticky package solution
* By identifying EOF, such as HTTP protocol, and by  \r \n \r \n, we can customize a protocol, such as when receiving a  ending 666  string, representing the end of the string, if not obtained, it is stored in a buffer, waiting for the end string, or if multiple strings are obtained, other data can be cut out through the string.
* Define the header and get it through the header of a specific length. For example, we define a protocol. The first 10 bits of string represent the length of the data body after that. When we transfer data, we only need 000000512346 (the first 10 bits represent the size of the data, and the next is the data). Each time we read, we read only 10 bits, get the length of the message, and then read and cancel it. The length of the message is so large that the integrity of the data can be guaranteed. (But in order not to be confused, the protocol header has to be identified as EOF.)
* Through pack binary processing, which is equivalent to method 2, data is spliced into messages through binary encapsulation, and information is read by validating binary data. This is the way SW uses.

>View official swoole documents:https://wiki.swoole.com/wiki/page/287.html

## Implementing sticky package processing  
### Server:
````php
<?php
 ################# TCP server 2 did not process sticky packages #####################
        $subPort2 = $server->addlistener('0.0.0.0', 9503, SWOOLE_TCP);
        $subPort2->set(
            [
                'open_length_check'     => true,
                'package_max_length'    => 81920,
                'package_length_type'   => 'N',
                'package_length_offset' => 0,
                'package_body_offset'   => 4,
            ]
        );
        $subPort2->on('connect', function (\swoole_server $server, int $fd, int $reactor_id) {
            echo "TCP service 2  fd:{$fd} Connected\n";
            $str = 'Congratulations on your successful connection to Server 2';
            $server->send($fd, pack('N', strlen($str)) . $str);
        });
        $subPort2->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
            echo "TCP service 2  fd:{$fd} closed\n";
        });
        $subPort2->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
            echo "TCP service 2  fd:{$fd} send the original message:{$data}\n";
            echo "TCP service 2  fd:{$fd} send message:" . substr($data, '4') . "\n";
        });
````
### Client:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/6 0006
 * Time: 16:22
 */
include "../vendor/autoload.php";
define('EASYSWOOLE_ROOT', realpath(dirname(getcwd())));
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
/**
 * TCP client 2, verify data package and process sticky package
 */
go(function () {
    $client = new \Swoole\Client(SWOOLE_SOCK_TCP);
    $client->set(
        [
            'open_length_check'     => true,
            'package_max_length'    => 81920,
            'package_length_type'   => 'N',
            'package_length_offset' => 0,
            'package_body_offset'   => 4,
        ]
    );
    if (!$client->connect('127.0.0.1', 9503, 0.5)) {
        exit("connect failed. Error: {$client->errCode}\n");
    }
    $str = 'hello world';
    $client->send(encode($str));
    $data = $client->recv();//The server has packaged
    var_dump($data);//Unprocessed data, with 4 bytes of pack ahead (because the pack type is N)
    $data = decode($data);//You need to cut and parse the data yourself
    var_dump($data);
//    $client->close();
});

/**
 * Packet Packet Processing
 * encode
 * @param $str
 * @return string
 * @author Tioncico
 * Time: 9:50
 */
function encode($str)
{
    return pack('N', strlen($str)) . $str;
}

function decode($str)
{
    $data = substr($str, '4');
    return $data;
}
````

## Implementation of TCP controller
### Protocol Rules and Resolution
In this document, JSON data is transmitted using pack N for binary processing. JSON data has three parameters, such as:
````json
{"controller":"Index","action":"index","param":{"name":"\u4ed9\u58eb\u53ef"}}
````
Implementing parser[Parser.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Parser.php)
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2018/10/17 0017
 * Time: 9:10
 */
namespace App\TcpController;
use EasySwoole\Socket\Bean\Caller;
use EasySwoole\Socket\Bean\Response;
use EasySwoole\Socket\AbstractInterface\ParserInterface;
use EasySwoole\Utility\CommandLine;
class Parser implements ParserInterface
{
    public function decode($raw, $client): ?Caller
    {
        $data = substr($raw, '4');
        //For convenience, we use JSON strings as protocol standards
        $data = json_decode($data, true);
        $bean = new Caller();
        $controller = !empty($data['controller']) ? $data['controller'] : 'Index';
        $action = !empty($data['action']) ? $data['action'] : 'index';
        $param = !empty($data['param']) ? $data['param'] : [];
        $controller = "App\\TcpController\\{$controller}";
        $bean->setControllerClass($controller);
        $bean->setAction($action);
        $bean->setArgs($param);
        return $bean;
    }
    /**
     * Only pack is handled, and JSON is handed over to the controller
     * encode
     * @param Response $response
     * @param          $client
     * @return string|null
     * @author Tioncico
     * Time: 10:33
     */
    public function encode(Response $response, $client): ?string
    {
        return pack('N', strlen($response->getMessage())) . $response->getMessage();
    }
}
````
### Implementing Controller[Index.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Index.php)
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2018/10/17 0017
 * Time: 9:15
 */
namespace App\TcpController;
use App\Rpc\RpcServer;
use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\EasySwoole\Swoole\Task\TaskManager;
use EasySwoole\Socket\AbstractInterface\Controller;
use http\Env\Response;
class Index extends Controller{
    function actionNotFound(?string $actionName)
    {
        $this->response()->setMessage("{$actionName} not found \n");
    }
    public function index(){
        $this->response()->setMessage(time());
    }
    public function args()
    {
        $this->response()->setMessage('your args is:'.json_encode($this->caller()->getArgs()).PHP_EOL);
    }
    public function delay()
    {
        $client = $this->caller()->getClient();
        TaskManager::async(function ()use($client){
            sleep(1);
            ServerManager::getInstance()->getSwooleServer()->send($client->getFd(),'this is delay message at '.time());
        });
    }
    public function close()
    {
        $this->response()->setMessage('you are goging to close');
        $client = $this->caller()->getClient();
        TaskManager::async(function ()use($client){
            sleep(2);
            ServerManager::getInstance()->getSwooleServer()->send($client->getFd(),'this is delay message at '.time());
        });
    }
    public function who()
    {
        $this->response()->setMessage('you fd is '.$this->caller()->getClient()->getFd());
    }
}
````

## Open sub-services
Register in `EasySwooleEvent'.
```php
<?php
public static function mainServerCreate(EventRegister $register)
{
       ############# TCP server 3 TCP controller implementation + processing of sticky packages############
      
              $subPort3 = $server->addListener(Config::getInstance()->getConf('MAIN_SERVER.LISTEN_ADDRESS'), 9504, SWOOLE_TCP);
      
              $socketConfig = new \EasySwoole\Socket\Config();
              $socketConfig->setType($socketConfig::TCP);
              $socketConfig->setParser(new \App\TcpController\Parser());
              //Set the callback when parsing exceptions, which by default will be thrown to the server
              $socketConfig->setOnExceptionHandler(function ($server, $throwable, $raw, $client, $response) {
                  echo  "TCP service 3  fd:{$client->getFd()} Send data exception \n";
                  $server->close($client->getFd());
              });
              $dispatch = new \EasySwoole\Socket\Dispatcher($socketConfig);
      
              $subPort3->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) use ($dispatch) {
                  echo "TCP service 3  fd:{$fd} send message:{$data}\n";
                  $dispatch->dispatch($server, $data, $fd, $reactor_id);
              });
              $subPort3->set(
                  [
                      'open_length_check'     => true,
                      'package_max_length'    => 81920,
                      'package_length_type'   => 'N',
                      'package_length_offset' => 0,
                      'package_body_offset'   => 4,
                  ]
              );
              $subPort3->on('connect', function (\swoole_server $server, int $fd, int $reactor_id) {
                  echo "TCP service 3  fd:{$fd} Connected\n";
              });
              $subPort3->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
                  echo "TCP service 3  fd:{$fd} Closed\n";
              });

}
```

## Test client
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/6 0006
 * Time: 16:22
 */
include "../vendor/autoload.php";
define('EASYSWOOLE_ROOT', realpath(dirname(getcwd())));
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
/**
 *TCP client 3, verify data packet processing sticky package and forwarding to controller writing
 */
go(function () {
    $client = new \Swoole\Client(SWOOLE_SOCK_TCP);
    $client->set(
        [
            'open_length_check'     => true,
            'package_max_length'    => 81920,
            'package_length_type'   => 'N',
            'package_length_offset' => 0,
            'package_body_offset'   => 4,
        ]
    );
    if (!$client->connect('127.0.0.1', 9504, 0.5)) {
        exit("connect failed. Error: {$client->errCode}\n");
    }

    $data = [
        'controller' => 'Index',
        'action'     => 'index',
        'param'      => [
            'name' => 'name'
        ],
    ];
    $str = json_encode($data);
    var_dump($str);
    $client->send(encode($str));
    $data = $client->recv();//The server has packaged
    $data = decode($data);//You need to cut and parse the data yourself
    echo "Server reply: $data \n";

    $data = [
        'controller' => 'Index',
        'action'     => 'args',
        'param'      => [
            'name' => 'name'
        ],
    ];
    $str = json_encode($data);
    $client->send(encode($str));
    $data = $client->recv();//The server has packaged
    $data = decode($data);//You need to cut and parse the data yourself
    echo "Server reply: $data \n";




//    $client->close();
});

/**
 * Packet Packet Processing
 * encode
 * @param $str
 * @return string
 * @author Tioncico
 * Time: 9:50
 */
function encode($str)
{
    return pack('N', strlen($str)) . $str;
}

function decode($str)
{
    $data = substr($str, '4');
    return $data;
}
````


## Http push to tcp
HTTP Controller
```php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/1 0001
 * Time: 11:10
 */

namespace App\HttpController;



use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\Http\AbstractInterface\Controller;

class Index extends Controller
{
    function index()
    {
        // TODO: Implement index() method.
    }

    function push(){
        $fd = intval($this->request()->getRequestParam('fd'));
        $info = ServerManager::getInstance()->getSwooleServer()->connection_info($fd);
        if(is_array($info)){
            ServerManager::getInstance()->getSwooleServer()->send($fd,'push in http at '.time());
        }else{
            $this->response()->write("fd {$fd} not exist");
        }
    }
}
```

> In actual production, the user usually verifies the TCP connection, then exists in redis in the format of userName=> fd, needs http, or other places, such as when the timer pushes to a connection, it is to use userName to get the corresponding FD in redis, and then send. Note that by registering your own network events through a sub-server created in the form of addServer, you can register onclose events, and then delete the userName=> FD correspondence when the connection is disconnected.