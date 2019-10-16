
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


::: warning 
可查看swoole官方文档:https://wiki.swoole.com/wiki/page/287.html
:::

## 实现粘包处理  

### 服务端:

````php
<?php
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