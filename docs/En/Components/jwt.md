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

## publish 初始化

初始化一个没有附带信息的token的JwtObject

```php
use EasySwoole\Jwt\JwtObject;
    
$jwtObject = JwtObject::getInstance()->publish();
```

## 设置信息

以下为`JwtObject`类拥有的方法，可以通过这些方法设置属性

```php
/** 
 * 设置加密方式:AES/HMACSHA256，默认HMACSHA256 
 */
public function setAlg($alg): void
/** 
 * 设置签发者.默认为EasySwoole 
 */
public function setIss(string $iss): void
/** 
 * 设置过期时间戳 默认为当前时间加2小时 
 */
public function setExp($exp): void
/** 
 * 设置主题（Subject） 
 */
public function setSub($sub): void
/** 
 * 设置在此时间戳之前不可用（Not Before），默认time()
 */
public function setNbf($nbf): void
/** 
 * 设置用户（Audience）
 */
public function setAud($aud): void
/** 
 * 设置签发时间,默认time()
 */
public function setIat($iat): void
/**
 * 设置JWT ID用于标识该JWT 
 */
public function setJti($jti): void
/** 
 * 设置数据 
 */
public function setData($data): void
```

## encode示例

```php
<?php

/** @var \EasySwoole\Jwt\JwtObject $obj */
//设置加密方式 支持AES 与 HMACSHA256 设置密钥默认为EasySwoole
$obj = \EasySwoole\Jwt\Jwt::getInstance()->algMethod('AES')->setSecretKey('测试呀')->publish();

$obj->setExp(time() + 3600);
$obj->setData('测试数据a');

$token = $obj->__toString();
echo $token;
```
### 输出结果

```
eyJhbGciOiJBRVMiLCJpc3MiOiJtZSIsImV4cCI6MTU3MTgwMDc0OSwic3ViIjoi5Li76aKYIiwibmJmIjoxNTcxNzI3NjA1LCJhdWQiOiJ5b3UiLCJpYXQiOjE1NzE3OTcxNDksImp0aSI6IjVkYWZiODlkNjM2ZjQiLCJzaWduYXR1cmUiOiI2dnVMTGRNWXI0bEFLcVhOeVMvbVVFa2lISVFQc2wzWUUyNFV1aFpKQzBhM25mRC9mc3dGeTFkWmdYRGN1cUZ6NUdkeEgybVBuY25IdWhXY1ZMeWZFa3plZVRzVGFscy9VeXVEalN2WFZqWTJxendoSCt1K203RDZBVVRFN1VGaFFtM2xvb2pBZklERVc3bHJtWWxCYXpqUldQV0dlaWYraGZTU05JY1FqYWhxSCtobkp6QWVxbUJ3cVBrVEYzZ044Znp2b2plWTRlWmhQaGpSNlhGaHZBPT0iLCJzdGF0dXMiOjEsImRhdGEiOiLmtYvor5XmlbDmja5hIn0%3D
```

## decode示例

通过客户端或者其他地方传递过来的token，可以解析，得到其中的附带数据

```php
<?php
$jwt = \EasySwoole\Jwt\Jwt::getInstance();

// 实际可能是通过传参等方式获取token
$token = 'eyJhbGciOiJBRVMiLCJpc3MiOiJtZSIsImV4cCI6MTU3MTgwMDc0OSwic3ViIjoi5Li76aKYIiwibmJmIjoxNTcxNzI3NjA1LCJhdWQiOiJ5b3UiLCJpYXQiOjE1NzE3OTcxNDksImp0aSI6IjVkYWZiODlkNjM2ZjQiLCJzaWduYXR1cmUiOiI2dnVMTGRNWXI0bEFLcVhOeVMvbVVFa2lISVFQc2wzWUUyNFV1aFpKQzBhM25mRC9mc3dGeTFkWmdYRGN1cUZ6NUdkeEgybVBuY25IdWhXY1ZMeWZFa3plZVRzVGFscy9VeXVEalN2WFZqWTJxendoSCt1K203RDZBVVRFN1VGaFFtM2xvb2pBZklERVc3bHJtWWxCYXpqUldQV0dlaWYraGZTU05JY1FqYWhxSCtobkp6QWVxbUJ3cVBrVEYzZ044Znp2b2plWTRlWmhQaGpSNlhGaHZBPT0iLCJzdGF0dXMiOjEsImRhdGEiOiLmtYvor5XmlbDmja5hIn0%3D';

try {
  /** @var \EasySwoole\Jwt\JwtObject $result */
  $result = $jwt->decode($token);

  switch ($result->getStatus()) {
    case -1:
      echo 'token无效';
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
    
  // 根据解密之后的结果完善业务逻辑
  var_dump($result);
} catch (\Exception $e) {
  // TODO: 处理异常
}
```

### 获取附带数据

```php
echo $result->getNbf() . PHP_EOL;
echo $result->getAlg() . PHP_EOL;
echo $result->getExp() . PHP_EOL;
echo $result->getIat() . PHP_EOL;
echo $result->getIss() . PHP_EOL;
echo $result->getSignature() . PHP_EOL;
// 若未set，以下值默认未null
echo $result->getAud() . PHP_EOL;
echo $result->getData() . PHP_EOL;
echo $result->getJti() . PHP_EOL;
echo $result->getSub() . PHP_EOL;

// 此外还可根据属性名解密，nbf/alg/exp/iat/iss/signature/aud/data/jti/sub
echo $result->getProperty('signature') . PHP_EOL;
```

