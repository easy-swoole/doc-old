---
title: Rpc跨平台
meta:
  - name: description
    content: EasySwoole中Rpc跨平台实现
  - name: keywords
    content: easyswoole|Rpc跨平台|swoole RPC|RPC
---

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

        //创建Socket对象，连接服务器
        Socket socket=new Socket("127.0.0.1",9600);
        //通过客户端的套接字对象Socket方法，获取字节输出流，将数据写向服务器
        OutputStream out=socket.getOutputStream();
        out.write(data);

        //读取服务器发回的数据，使用socket套接字对象中的字节输入流
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
 其他语言只需要实现tcp协议即可
:::
