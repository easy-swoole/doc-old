---
title: Rpc跨平台
meta:
  - name: description
    content: RPC cross-platform implementation in EasySwoole
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Rpc cross-platform|swoole RPC|RPC
---

# Cross-platform
Rpc's request response is through the tcp protocol, and the service broadcast uses the udp protocol. We only need to implement the network protocol.
## PHP sample code
````php
<?php
/**
 * Created by PhpStorm.
 * User: xcg
 * Date: 2019/6/17
 * Time: 14:30
 */
$data = [
    'command' => 1,//1:Request, 2: status rpc status of each service
    'request' => [
        'serviceName' => 'UserService',
        'action' => 'register',//Behavior name
        'arg' => [
            'args1' => 'args1',
            'args2' => 'args2'
        ]
    ]
];

//$raw = serialize($data);//Note the serialization type, you need to agree with the RPC server agreement $serializeType

$raw = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$fp = stream_socket_client('tcp://127.0.0.1:9600');
fwrite($fp, pack('N', strlen($raw)) . $raw);//Pack data check

$data = fread($fp, 65533);
//Length check
$len = unpack('N', $data);
$data = substr($data, '4');
if (strlen($data) != $len[1]) {
    echo 'data error';
} else {
    $data = json_decode($data, true);
    // This is the result returned by the server.，
    var_dump($data); // By default, a response object will be returned. Modify by $serializeType
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
	// The big endian (network byte order) big end is to put the high byte to the low address end of the memory, and the low byte to the high address end.
	// In the network transmission (such as TCP/IP), the low address end (high byte) is placed at the beginning of the stream. For the 2-byte string (AB), the transmission order is:A(0-7bit)、B(8-15bit)。
	sendData = int32ToBytes8(int32(len(data)))
	// Assemble the data byte to the back of sendData
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

## Java
````
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class Main {
    public static void main(String[] args) throws IOException {
        byte[] msg = "{\"command\":1,\"request\":{\"serviceName\":\"UserService\",\"action\":\"register\",\"arg\":{\"args1\":\"args1\",\"args2\":\"args2\"}}}".getBytes();
        byte[] head = Main.toLH(msg.length);
        byte[] data = Main.mergeByteArr(head, msg);

        //Create a Socket object and connect to the server
        Socket socket=new Socket("127.0.0.1",9600);
        //Get the byte output stream and write the data to the server through the socket object Socket method of the client.
        OutputStream out=socket.getOutputStream();
        out.write(data);

        //Read the data sent back by the server, using the byte input stream in the socket socket object
        InputStream in=socket.getInputStream();
        byte[] response=new byte[1024];
        int len=in.read(response);
        System.out.println(new String(response,4, len-4));
        socket.close();
    }

    static byte[] toLH(int n) {
        byte[] b = new byte[4];
        b[3] = (byte) (n & 0xff);
        b[2] = (byte) (n >> 8 & 0xff);
        b[1] = (byte) (n >> 16 & 0xff);
        b[0] = (byte) (n >> 24 & 0xff);
        return b;
    }


    static byte[] mergeByteArr(byte[] a, byte[] b) {
        byte[] c= new byte[a.length + b.length];
        System.arraycopy(a, 0, c, 0, a.length);
        System.arraycopy(b, 0, c, a.length, b.length);
        return c;
    }
}
````

::: warning 
 Other languages only need to implement the tcp protocol.
:::
