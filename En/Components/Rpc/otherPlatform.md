<head>
     <title>EasySwoole Rpc|swoole Rpc|swoole distributed|swoole microservices|php microservices|php Rpc</title>
     <meta name="keywords" content="EasySwoole Rpc|swoole Rpc|swoole distributed|swoole microservices|php microservices|php Rpc"/>
     <meta name="description" content="EasySwoole Rpc|swoole Rpc|swoole distributed|swoole microservices|php microservices|php Rpc"/>
</head>
---<head>---

# Cross platform
Rpc's request response is through TCP protocol. Service broadcasting uses UDP protocol. We only need to implement network protocol.
## PHP sample code
````php
<?php
/**
 * Created by PhpStorm.
 * User: xcg
 * Date: 2019/2/27
 * Time: 16:02
 */
/**
 * Native PHP call
 */
$data = [
    'action' => 'call1',//Behavior Name
    'arg' => [
        'args1' => 'args1',
        'args2' => 'args2'
    ]
];

$raw = serialize($data);//Note the serialization type, and you need to agree on the protocol $serializeType with the RPC server

$fp = stream_socket_client('tcp://127.0.0.1:9527');
fwrite($fp, pack('N', strlen($raw)) . $raw);//Pack data validation

$data = fread($fp, 65533);
//Check length head
$len = unpack('N', $data);
$data = substr($data, '4');
if (strlen($data) != $len[1]) {
    echo 'data error';
} else {
    $data = unserialize($data);
//    //This is what the server returns.
    var_dump($data);//By default, a response object is returned and modified by $serializeType
}
fclose($fp);
````

## Go sample code
````
package main

import (
	"encoding/binary"
	"net"
)

func main() {
	var tcpAddr *net.TCPAddr
	tcpAddr,_ = net.ResolveTCPAddr("tcp","127.0.0.1:9600")
	conn,_ := net.DialTCP("tcp",nil,tcpAddr)
	defer conn.Close()
	sendEasyswooleMsg(conn)
}

func sendEasyswooleMsg(conn *net.TCPConn) {
	var sendData []byte
	data := `{"command":1,"request":{"serviceName":"UserService","action":"register","arg":{"args1":"args1","args2":"args2"}}}`
	b := []byte(data)
	sendData = int32ToBytes8(int32(len(data)))
	for _, value := range b {
		sendData = append(sendData, value)
	}
	conn.Write(sendData)
}

func int32ToBytes8(n int32) []byte {
	var buf = make([]byte, 4)
	binary.BigEndian.PutUint32(buf, uint32(n))
	return buf
}
````
> Other languages only need to implement TCP protocol
