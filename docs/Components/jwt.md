---
title: JWT组件
meta:
  - name: description
    content: 基于EasySwoole组件实现的json web token
  - name: keywords
    content: easyswoole|JWT组件
---

# jwt

基于easyswoole组件实现的Json Web Token

## 安装
可以通过composer安装
```php
composer require easyswoole/jwt 
```

## 依赖
::: warning 
* PHP version >= PHP 7.1
* easyswoole 组件包括 spl 与 utility
:::

## 使用示例
```php
<?php

require 'vendor/autoload.php';

/** @var \EasySwoole\Jwt\JwtObject $obj */
//设置加密方式 支持AES 与 HMACSHA256 设置密钥默认为EasySwoole
$obj = \EasySwoole\Jwt\Jwt::getInstance()->algMethod('AES')->setSecretKey('测试呀')->publish();

$data = '测试用例';

### 设置Payload ###

//设置过期时间 默认为当前时间加2小时
$obj->setExp(time()+3600);
//设置签发时间,默认time()
$obj->setIat(time());
//设置签发者.默认为EasySwoole
$obj->setIss('测试');

$token = $obj->__toString();

var_dump($token);

//decode token
$jwt =  \EasySwoole\Jwt\Jwt::getInstance();

try{
    //验证token,解密并验证签名验证过期时间
    /** @var \EasySwoole\Jwt\JwtObject $result */
    $result = $jwt -> decode($token);
    
    var_dump($result);
    
    switch ($result->getStatus())
    {
        case  1:
            echo '验证通过';
            break;
        case  2:
            echo '验证失败';
            break;
        case  3:
            echo 'token过期';
            break;
    }
    //根据解密之后的结果完善业务逻辑
}catch (\Exception $e){

}

```
### 输出结果:
```php
string(470) "eyJhbGciOiJBRVMiLCJpc3MiOiLmtYvor5UiLCJleHAiOjE1NjgyODg5MTMsInN1YiI6bnVsbCwibmJmIjoxNTY4Mjg1MzEzLCJhdWQiOm51bGwsImlhdCI6MTU2ODI4NTMxMywianRpIjoicDlhQVo0RnhxbyIsInNpZ25hdHVyZSI6IjZ2dUxMZE1ZcjRsQUtxWE55Uy9tVUlKb3hxV1FwblZXRGZFWkFXcUtNbXFzV002UENkbTZJZDlhZ0EzL3J6Y3pxd295UWdrR291eGdLdVlUTThnNVluZ2NZVnhGeFErYVY4U1lqZ256dGZYMlN2cXBYNnhDaVBNQnZ5K3c1Qi9Dc2I0VzBDelEwMXQ1STNFeVo5Uy9PRjBtQzdhaTN6TElIdkhvQkxRbEQvM3pmY09maHhnVUZGSXlLOG1adERYKyIsInN0YXR1cyI6MSwiZGF0YSI6bnVsbH0%3D"
object(EasySwoole\Jwt\Object)#4 (11) {
  ["alg":protected]=>
  string(3) "AES"
  ["iss":protected]=>
  string(6) "测试"
  ["exp":protected]=>
  int(1568288913)
  ["sub":protected]=>
  NULL
  ["nbf":protected]=>
  int(1568285313)
  ["aud":protected]=>
  NULL
  ["iat":protected]=>
  int(1568285313)
  ["jti":protected]=>
  string(10) "p9aAZ4Fxqo"
  ["signature":protected]=>
  string(192) "6vuLLdMYr4lAKqXNyS/mUIJoxqWQpnVWDfEZAWqKMmqsWM6PCdm6Id9agA3/rzczqwoyQgkGouxgKuYTM8g5YngcYVxFxQ+aV8SYjgnztfX2SvqpX6xCiPMBvy+w5B/Csb4W0CzQ01t5I3EyZ9S/OF0mC7ai3zLIHvHoBLQlD/3zfcOfhxgUFFIyK8mZtDX+"
  ["status":protected]=>
  int(1)
  ["data":protected]=>
  NULL
}
验证通过
```
