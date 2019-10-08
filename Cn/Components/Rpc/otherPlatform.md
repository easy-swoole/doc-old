<head>
     <title>EasySwoole Rpc|swoole Rpc|swoole 分布式|swoole 微服务|php 微服务|php Rpc</title>
     <meta name="keywords" content="EasySwoole Rpc|swoole Rpc|swoole 分布式|swoole 微服务|php 微服务|php Rpc"/>
     <meta name="description" content="EasySwoole Rpc|swoole Rpc|swoole 分布式|swoole 微服务|php 微服务|php Rpc"/>
</head>
---<head>---

# 跨平台
Rpc的请求响应通过tcp协议,服务广播使用udp协议,我们只需要实现网络协议即可
## PHP示例代码
````php
<?php
/**
 * Created by PhpStorm.
 * User: xcg
 * Date: 2019/6/17
 * Time: 14:30
 */
$data = [
    'command' => 1,//1:请求,2:状态rpc 各个服务的状态
    'request' => [
        'serviceName' => 'UserService',
        'action' => 'register',//行为名称
        'arg' => [
            'args1' => 'args1',
            'args2' => 'args2'
        ]
    ]
];

//$raw = serialize($data);//注意序列化类型,需要和RPC服务端约定好协议 $serializeType

$raw = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$fp = stream_socket_client('tcp://127.0.0.1:9600');
fwrite($fp, pack('N', strlen($raw)) . $raw);//pack数据校验

$data = fread($fp, 65533);
//做长度头部校验
$len = unpack('N', $data);
$data = substr($data, '4');
if (strlen($data) != $len[1]) {
    echo 'data error';
} else {
    $data = json_decode($data, true);
//    //这就是服务端返回的结果，
    var_dump($data);//默认将返回一个response对象 通过$serializeType修改
}
fclose($fp);
````

## Go示例代码
```go
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
	// 大端字节序(网络字节序)大端就是将高位字节放到内存的低地址端，低位字节放到高地址端。
	// 网络传输中(比如TCP/IP)低地址端(高位字节)放在流的开始，对于2个字节的字符串(AB)，传输顺序为：A(0-7bit)、B(8-15bit)。
	sendData = int32ToBytes8(int32(len(data)))
	// 将数据byte拼装到sendData的后面
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
```

> 其他语言只需要实现tcp协议即可
