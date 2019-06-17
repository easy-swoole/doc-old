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
> 其他语言只需要实现tcp协议即可
