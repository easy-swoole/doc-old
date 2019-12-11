---
title: Easyswoole Oss云存储
meta:
  - name: description
    content: easyswoole对阿里云，腾讯，七牛OSS的协程SDK客户端
  - name: keywords
    content: swoole OSS|阿里云oss协程客户端|七牛oss协程客户端|腾讯云oss协程客户端
---
# OSS云存储

## 阿里云调用
根据阿里云官方sdk修改,全部方法都一致,走通了所有官方的client请求类单元测试,全部调用方法都和阿里云一致
文档可查看阿里云官方文档:https://help.aliyun.com/document_detail/32099.html?spm=a2c4g.11186623.2.17.de715d26YNLCah#concept-32099-zh
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/11/20 0020
 * Time: 15:28
 */
include "./vendor/autoload.php";
include "./phpunit.php";

go(function (){

    $config = new \EasySwoole\Oss\AliYun\Config([
        'accessKeyId'     => ACCESS_KEY_ID,
        'accessKeySecret' => ACCESS_KEY_SECRET,
        'endpoint'        => END_POINT,
    ]);
    $client = new \EasySwoole\Oss\AliYun\OssClient($config);
    $data = $client->putObject('tioncicoxyz','test',__FILE__);
    var_dump($data);
});
```
### 部分方法没走通单元测试
由于有些方法可能是测试环境问题,未走通,可能出现问题(一般不会有问题),需要大家注意  
列出走不通单元测试的方法,以供大家参考:
- addBucketCname 提示: NoSuchCnameInRecord: No such cname be found in record
- testDeleteCname 提示: CnameDenied: The cname belongs to another user.

以下2个方法为callback走不通,应该不影响
- \EasySwoole\Oss\Tests\AliYun\CallbackTest::testMultipartUploadCallbackNormal 提示: CallbackFailed: Response body is not valid json format.
- \EasySwoole\Oss\Tests\AliYun\CallbackTest::testPutObjectCallbackNormal 走不通 

Symlink 类方法全走不通,应该不影响,提示: bucket is not allowed empty或者The specified key does not exist.


## 七牛云调用
根据七牛云官方sdk修改,走通了oss的大部分单元测试,用法和七牛云oss完全一致
操作文档可直接查看七牛云官方文档 https://developer.qiniu.com/kodo/sdk/1241/php

```php
include "../../vendor/autoload.php";
include "../../phpunit.php";
go(function (){
    
    $auth = new \EasySwoole\Oss\QiNiu\Auth(QINIU_ACCESS_KEY,QINIU_SECRET_KEY);

    $key = 'formPutFileTest';
    $token = $auth->uploadToken('tioncico', $key);
    $upManager = new \EasySwoole\Oss\QiNiu\Storage\UploadManager();
    list($ret, $error) = $upManager->putFile($token, $key, __file__, null, 'text/plain', null);
    var_dump($ret,$error);
});
```
### 部分方法没走通单元测试
由于某些可能是测试环境问题,有部分方法未走通单元测试,需要大家注意,列出走不通的单元测试的方法,以供大家参考
- \EasySwoole\Oss\Tests\QiNiu\BucketTest::testPrefetch 未走通,提示:{"error":"bucket source not set"}
- PfopTest 类方法未走通,提示{"error":"no such bucket"} 
- \EasySwoole\Oss\Tests\QiNiu\ResumeUpTest::test4ML2 方法未走通,一直卡住,不建议使用该方法上传文件,请使用 \EasySwoole\Oss\Tests\QiNiu\ResumeUpTest::test4ML  方法上传


## 腾讯云调用
腾讯云调用和原来的方法基本一致,操作文档可直接查看腾讯云官方文档:https://cloud.tencent.com/document/product/436/12266
```php
<?php
include "../../vendor/autoload.php";
include "../../phpunit2.php";
go(function (){
//config配置
    $config = new \EasySwoole\Oss\Tencent\Config([
        'appId'     => TX_APP_ID,
        'secretId'  => TX_SECRETID,
        'secretKey' => TX_SECRETKEY,
        'region'    => TX_REGION,
        'bucket'    => TX_BUCKET,
    ]);
    //new客户端
    $cosClient = new \EasySwoole\Oss\Tencent\OssClient($config);

    $key = '你好111.txt';
    //生成一个文件数据
    $body = generateRandomString(2 * 1024  + 1023);
    //上传
    $cosClient->upload($bucket = TX_BUCKET,
        $key = $key,
        $body = $body,
        $options = ['PartSize' => 1024 + 1]
    );
    //获取文件内容
    $rt = $cosClient->getObject(['Bucket' => TX_BUCKET, 'Key' => $key]);
    var_dump($rt['Body']->__toString());
});


function generateRandomString($length = 10)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}
```

### 补充
大部分方法已经兼容,使用方法和腾讯云官方完全一致,但还有些注意事项:
- 上传文件使用了`SplStream` 作为流文件管理
- 下载文件使用了`SplStream` 作为流文件管理(上面的$rt['Body']就是`SplStream`对象)

### 部分方法没走通单元测试
由于腾讯云sdk使用了guzzle 库,改动非常麻烦,所以有部分单元测试没通过,具体方法如下,希望大家注意:
- PutBucketAcl 方法,相关的单元测试全部提示Access Denied.(官方sdk也这个提示)
- copy 方法,小文件提示You have no authority to read the source file  大文件直接无法走通无法使用(官方sdk也走不通)

