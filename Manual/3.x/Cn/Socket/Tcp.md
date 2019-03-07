# EasySwoole  Tcp服务
tcp 服务以及tcp客户端 demo:https://github.com/easy-swoole/demo/tree/3.x-subtcp

## 创建tcp服务
通过`EasySwooleEvent.php`文件的`mainServerCreate` 事件,进行添加子服务监听,例如:
````php
<?php
public static function mainServerCreate(EventRegister $register)
{
    $server = ServerManager::getInstance()->getSwooleServer();

    ################# tcp 服务器1 没有处理粘包 #####################
    $subPort1 = $server->addlistener('0.0.0.0', 9502, SWOOLE_TCP);
    $subPort1->set(
        [
            'open_length_check' => false,//不验证数据包
        ]
    );
    $subPort1->on('connect', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcp服务1  fd:{$fd} 已连接\n";
        $str = '恭喜你连接成功服务器1';
        $server->send($fd, $str);
    });
    $subPort1->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
        echo "tcp服务1  fd:{$fd} 已关闭\n";
    });
    $subPort1->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
        echo "tcp服务1  fd:{$fd} 发送消息:{$data}\n";
    });
}
````
### 粘包问题
由于tcp的特性,可能会出现数据粘包情况,例如   
* A连接Server
* A发送 hello 
* A又发送了一条 hello
* Server可能会一次性收到一条"hellohello"的数据
* Server也可能收到"he" ,"llohello"类似这样的中断数据

### 粘包解决
* 通过标识EOF,例如http协议,通过\r\n\r\n 的方式去表示该数据已经完结,我们可以自定义一个协议,例如当接收到 "结尾666" 字符串时,代表该字符串已经结束,如果没有获取到,则存入缓冲区,等待结尾字符串,或者如果获取到多条,则通过该字符串剪切出其他数据
* 定义消息头,通过特定长度的消息头进行获取,例如我们定义一个协议,前面10位字符串都代表着之后数据主体的长度,那么我们传输数据时,只需要000000000512346(前10位为协议头,表示了这条数据的大小,后面的为数据),每次我们读取只先读取10位,获取到消息长度,再读取消息长度那么多的数据,这样就可以保证数据的完整性了.(但是为了不被混淆,协议头也得像EOF一样标识)
* 通过pack二进制处理,相当于于方法2,将数据通过二进制封装拼接进消息中,通过验证二进制数据去读取信息,sw采用的就是这种方式

>可查看swoole官方文档:https://wiki.swoole.com/wiki/page/287.html

## 实现粘包处理  
### 服务端:
````php
<?php
 ################# tcp 服务器2 没有处理粘包 #####################
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
            echo "tcp服务2  fd:{$fd} 已连接\n";
            $str = '恭喜你连接成功服务器2';
            $server->send($fd, pack('N', strlen($str)) . $str);
        });
        $subPort2->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
            echo "tcp服务2  fd:{$fd} 已关闭\n";
        });
        $subPort2->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
            echo "tcp服务2  fd:{$fd} 发送原始消息:{$data}\n";
            echo "tcp服务2  fd:{$fd} 发送消息:" . substr($data, '4') . "\n";
        });
````
### 客户端:
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
 * tcp 客户端2,验证数据包,并处理粘包
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
    $data = $client->recv();//服务器已经做了pack处理
    var_dump($data);//未处理数据,前面有4 (因为pack 类型为N)个字节的pack
    $data = decode($data);//需要自己剪切解析数据
    var_dump($data);
//    $client->close();
});

/**
 * 数据包 pack处理
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

## tcp控制器实现
### 协议规则与解析
在本文档中,传输json数据 使用pack N进行二进制处理,json数据有3个参数,例如:
````json
{"controller":"Index","action":"index","param":{"name":"\u4ed9\u58eb\u53ef"}}
````
实现解析器[Parser.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Parser.php)
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
        //为了方便,我们将json字符串作为协议标准
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
     * 只处理pack,json交给控制器
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
### 实现控制器[Index.php](https://github.com/easy-swoole/demo/blob/3.x-subtcp/App/TcpController/Index.php)
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

## 开启子服务
在`EasySwooleEvent`中注册。
```php
<?php
public static function mainServerCreate(EventRegister $register)
{
       ############# tcp 服务器3 tcp控制器实现+处理粘包############
      
              $subPort3 = $server->addListener(Config::getInstance()->getConf('MAIN_SERVER.LISTEN_ADDRESS'), 9504, SWOOLE_TCP);
      
              $socketConfig = new \EasySwoole\Socket\Config();
              $socketConfig->setType($socketConfig::TCP);
              $socketConfig->setParser(new \App\TcpController\Parser());
              //设置解析异常时的回调,默认将抛出异常到服务器
              $socketConfig->setOnExceptionHandler(function ($server, $throwable, $raw, $client, $response) {
                  echo  "tcp服务3  fd:{$client->getFd()} 发送数据异常 \n";
                  $server->close($client->getFd());
              });
              $dispatch = new \EasySwoole\Socket\Dispatcher($socketConfig);
      
              $subPort3->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) use ($dispatch) {
                  echo "tcp服务3  fd:{$fd} 发送消息:{$data}\n";
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
                  echo "tcp服务3  fd:{$fd} 已连接\n";
              });
              $subPort3->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
                  echo "tcp服务3  fd:{$fd} 已关闭\n";
              });

}
```

## 测试客户端
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
 * tcp 客户端3,验证数据包处理粘包 以及转发到控制器写法
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
            'name' => '仙士可'
        ],
    ];
    $str = json_encode($data);
    var_dump($str);
    $client->send(encode($str));
    $data = $client->recv();//服务器已经做了pack处理
    $data = decode($data);//需要自己剪切解析数据
    echo "服务端回复: $data \n";

    $data = [
        'controller' => 'Index',
        'action'     => 'args',
        'param'      => [
            'name' => '仙士可'
        ],
    ];
    $str = json_encode($data);
    $client->send(encode($str));
    $data = $client->recv();//服务器已经做了pack处理
    $data = decode($data);//需要自己剪切解析数据
    echo "服务端回复: $data \n";




//    $client->close();
});

/**
 * 数据包 pack处理
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


## HTTP往TCP推送
HTTP控制器
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

> 实际生产中，一般是用户TCP连接上来后，做验证，然后以userName=>fd的格式，存在redis中，需要http，或者是其他地方，
比如定时器往某个连接推送的时候，就是以userName去redis中取得对应的fd，再send。注意，通过addServer形式创建的子服务器，
>以再完全注册自己的网络事件，你可以注册onclose事件，然后在连接断开的时候，删除userName=>fd对应。