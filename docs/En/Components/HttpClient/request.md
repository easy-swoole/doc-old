---
title: request
meta:
  - name: description
    content: EasySwoole Coroutine HTTPClient component
  - name: keywords
    content: swoole|swoole extension|swoole framework|request|easyswoole|Coroutine HTTPClient|Curl component|Coroutine curl
---

## Request

### Instantiate the client
````php
<?php
/**
 * Created by PhpStorm.
 * User: tioncico
 * Date: 19-6-22
 * Time: 2:43
 */

include "./vendor/autoload.php";
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
go(function () {
    //Instantiation
    $client = new \EasySwoole\HttpClient\HttpClient('http://easyswoole.com');
});
````

### Request instance:

```php
<?php
     /**
      * Created by PhpStorm.
      * User: tioncico
      * Date: 19-6-22
      * Time: 2:43
      */
     
     include "./vendor/autoload.php";
     \EasySwoole\EasySwoole\Core::getInstance()->initialize();
     go(function () {
         //Instantiation
         $client = new \EasySwoole\HttpClient\HttpClient('http://easyswoole.com');
     
         //Initiate a simple get request
         $response = $client->get();
         var_dump($response);
     
         //Initiate a simple head request
         $response = $client->head();
         var_dump($response);
     
         //Initiate a delete request
         $response = $client->delete();
     
         //Initiate a put request
         $response = $client->put('testPut');
     
     
         //Initiate a post request
         $response = $client->post([
             'post1' => 'post1'
         ]);
     
         //Initiate a patch request
         $response = $client->patch('testPath');
     
         //Initiate an option request
         $response = $client->options(['op' => 'op1'], ['head' => 'headtest']);
     
         //Initiate a post, xml format request
         $response = $client->postXml('<xml></xml>');
     
         //Initiate a post, json format request
         $response = $client->postJson(json_encode(['json' => 'json1']));
     
         //Initiate a download request, the requested content will be directly written to the file, saving one read and write process
         $response = $client->download('./test.html');
     
         //Initiate a post request
         $response = $client->post('postStr');
     
         //Initiate a post request for a new file
         $response = $client->post([
             'post1' => 'post1',
             'file'  => new \CURLFile(__FILE__)
         ]);
     
         //Set the head
         $client->setHeaders([
             'head1' => 'head1',
             'head2' => 'head2'
         ]);
         $client->setHeader('head1', 'head1');
     
         // set basic auth 
         $client->setBasicAuth('admin', '111111');
         
         //Set cookie
         $client->addCookies([
             'cookie1' => 'cookie1',
             'cookie2' => 'cookie2'
         ]);
         $client->addCookie('cookie1', 'cook');
         // Set form data data
         $client->setContentTypeFormData();
         ///Set the current URL to request
         $client->setUrl('http://easyswoole.com');
         //Set whether to enable ssl
         $client->setEnableSSL(false);
         //Set wait timeout
         $client->setTimeout(5);
         //Set connection timeout
         $client->setConnectTimeout(10);
         // Enable or disable HTTP long connections
         $client->setKeepAlive(true);
         // Enable or disable server certificate verification
         // Can be set at the same time whether to allow self-signed certificate (not allowed by default)
         $client->setSslVerifyPeer(true,true);
         // Set the server host name
         // Use with ssl_verify_peer configuration or Client::verifyPeerCert
         $client->setSslHostName('');
         //Set the SSL certificate for verification
         $client->setSslCafile('');
         //Set the SSL certificate directory (for verification)
         $client->setSslCapath('');
         //Set the certificate file used for the request
         $client->setSslCertFile('');
         //Set the certificate key file to be used for the request
         $client->setSslKeyFile('');
         //Set up an HTTP proxy
         $client->setProxyHttp('127.0.0.1','8080','user','pass');
         //Set up the Socks5 agent
         $client->setProxySocks5('127.0.0.1','8080','user','pass');
         // Set the port binding
         // when the client has multiple network cards
         // Set the client's underlying Socket using which network card and port to communicate
         $client->setSocketBind('127.0.0.1','8090');
         //Set client configuration directly
         $client->setClientSetting('timeout',1);
         $client->setClientSetting('keep_alive',true);
         //Directly set client configuration in batches
         $client->setClientSettings([
             'bind_address'=>'127.0.0.1',
             'bind_port'=>'8090',
         ]);
         //Setting request method
         $client->setMethod('POST');
         //Set to XMLHttpRequest request
         $client->setXMLHttpRequest();
         //Set to Json request
         $client->setContentTypeJson();
         //Set to Xml request
         $client->setContentTypeXml();
         //Set to FromData request
         $client->setContentTypeFormData();
         //Set to FromUrlencoded request
         $client->setContentTypeFormUrlencoded();
         //Set ContentType
         $client->setContentType(\EasySwoole\HttpClient\HttpClient::CONTENT_TYPE_APPLICATION_XML);
         //
     });
```


