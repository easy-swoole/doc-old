### Sticky bag problem
Due to the nature of tcp, data sticking may occur, for example
* A connection Server
*A send hello
*A sent another hello
* Server may receive a "hellohello" data at a time
* Server may also receive "he", "llohello" like this interrupt data

### Sticky bag solution
* By identifying the EOF, such as the http protocol, by \r\n\r\n to indicate that the data has been completed, we can customize a protocol, for example, when the "end 666" string is received, it represents the string. Has ended, if not obtained, then stored in the buffer, waiting for the end string, or if more than one is obtained, then cut out other data through the string
* Define the message header, get it through the message header of a certain length. For example, we define a protocol. The first 10 digits of the string represent the length of the data body. Then we only need 000000000512346 when transferring data (the first 10 bits are the protocol header). , indicating the size of this data, the latter is the data), each time we read only read 10 bits, get the message length, and then read the message length as much data, so as to ensure the integrity of the data (but in order not to be confused, the protocol header has to be labeled like EOF)
* By packet binary processing, equivalent to method 2, the data is spliced ​​into the message through the binary package, by verifying the binary data to read the information, sw is used this way


::: warning
See the official swoole documentation: https://wiki.swoole.com/wiki/page/287.html
:::

## Achieve sticky package processing

### Server:

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
    echo "Tcp service 2 fd:{$fd} connected\n";
    $str = 'Congratulations on connecting to the successful server 2';
    $server->send($fd, pack('N', strlen($str)) . $str);
});
$subPort2->on('close', function (\swoole_server $server, int $fd, int $reactor_id) {
    echo "Tcp service 2  fd:{$fd} closed\n";
});
$subPort2->on('receive', function (\swoole_server $server, int $fd, int $reactor_id, string $data) {
    echo "Tcp service 2  fd:{$fd} Send original message:{$data}\n";
    echo "Tcp service 2  fd:{$fd} Send a message:" . substr($data, '4') . "\n";
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
 * tcp Client 2, verify the packet, and process the sticky packet
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
    $data = $client->recv();//The server has done the package processing
    var_dump($data);//Unprocessed data, preceded by 4 (because pack type is N) bytes of pack
    $data = decode($data);//Need to cut the analytical data yourself
    var_dump($data);
//    $client->close();
});

/**
 * Packet pack processing
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