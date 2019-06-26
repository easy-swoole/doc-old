## 请求

### 实例化客户端
````php
<?php
/**
 * Created by PhpStorm.
 * User: tioncico
 * Date: 19-6-22
 * Time: 下午2:43
 */

include "./vendor/autoload.php";
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
go(function () {
    //实例化
    $client = new \EasySwoole\HttpClient\HttpClient('http://easyswoole.com');
});
````

### 请求实例：

```php
<?php
     /**
      * Created by PhpStorm.
      * User: tioncico
      * Date: 19-6-22
      * Time: 下午2:43
      */
     
     include "./vendor/autoload.php";
     \EasySwoole\EasySwoole\Core::getInstance()->initialize();
     go(function () {
         //实例化
         $client = new \EasySwoole\HttpClient\HttpClient('http://easyswoole.com');
     
         //发起一个简单get请求
         $response = $client->get();
         var_dump($response);
     
         //发起一个简单head请求
         $response = $client->head();
         var_dump($response);
     
         //发起一个delete请求
         $response = $client->delete();
     
         //发起一个put请求
         $response = $client->put('testPut');
     
     
         //发起一个post请求
         $response = $client->post([
             'post1' => 'post1'
         ]);
     
         //发起一个patch请求
         $response = $client->patch('testPath');
     
         //发起一个option请求
         $response = $client->options(['op' => 'op1'], ['head' => 'headtest']);
     
         //发起post  xml格式请求
         $response = $client->postXml('<xml></xml>');
     
         //发起post json格式请求
         $response = $client->postJson(json_encode(['json' => 'json1']));
     
         //发起下载请求，请求的内容将直接写入文件，节省一次读取写入的过程
         $response = $client->download('./test.html');
     
         //发起一个post请求
         $response = $client->post('postStr');
     
         //发起一个post 新增文件的请求
         $response = $client->post([
             'post1' => 'post1',
             'file'  => new \CURLFile(__FILE__)
         ]);
     
         //设置head头
         $client->setHeaders([
             'head1' => 'head1',
             'head2' => 'head2'
         ]);
         $client->setHeader('head1', 'head1');
     
         //设置cookie
         $client->addCookies([
             'cookie1' => 'cookie1',
             'cookie2' => 'cookie2'
         ]);
         $client->addCookie('cookie1', 'cook');
         //设置form data数据
         $client->setContentTypeFormData();
         ///设置当前要请求的URL
         $client->setUrl('http://easyswoole.com');
         //设置是否开启ssl
         $client->setEnableSSL(false);
         //设置等待超时时间
         $client->setTimeout(5);
         //设置连接超时时间
         $client->setConnectTimeout(10);
         // 启用或关闭HTTP长连接
         $client->setKeepAlive(true);
         //启用或关闭服务器证书验证
         //可以同时设置是否允许自签证书(默认不允许)
         $client->setSslVerifyPeer(true,true);
         //设置服务器主机名称
         //与ssl_verify_peer配置或Client::verifyPeerCert配合使用
         $client->setSslHostName('');
         //设置验证用的SSL证书
         $client->setSslCafile('');
         //设置SSL证书目录(验证用)
         $client->setSslCapath('');
         //设置请求使用的证书文件
         $client->setSslCertFile('');
         //设置请求使用的证书秘钥文件
         $client->setSslKeyFile('');
         //设置HTTP代理
         $client->setProxyHttp('127.0.0.1','8080','user','pass');
         //设置Socks5代理
         $client->setProxySocks5('127.0.0.1','8080','user','pass');
         // 设置端口绑定
         // 用于客户机有多张网卡的时候
         // 设置本客户端底层Socket使用哪张网卡和端口进行通讯
         $client->setSocketBind('127.0.0.1','8090');
         //直接设置客户端配置
         $client->setClientSetting('timeout',1);
         $client->setClientSetting('keep_alive',true);
         //直接批量设置客户端配置
         $client->setClientSettings([
             'bind_address'=>'127.0.0.1',
             'bind_port'=>'8090',
         ]);
         //设置请求方法
         $client->setMethod('POST');
         //设置为XMLHttpRequest请求
         $client->setXMLHttpRequest();
         //设置为Json请求
         $client->setContentTypeJson();
         //设置为Xml请求
         $client->setContentTypeXml();
         //设置为FromData请求
         $client->setContentTypeFormData();
         //设置为FromUrlencoded请求
         $client->setContentTypeFormUrlencoded();
         //设置ContentType
         $client->setContentType(\EasySwoole\HttpClient\HttpClient::CONTENT_TYPE_APPLICATION_XML);
         //
     });
```


