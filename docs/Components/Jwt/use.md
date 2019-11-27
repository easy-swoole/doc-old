---
title: JWT组件
meta:
  - name: description
    content: 基于EasySwoole组件实现的json web token
  - name: keywords
    content: easyswoole|JWT组件
---

# 使用

## 安装

```php
composer require easyswoole/jwt 
```

## 依赖
::: warning 
* PHP version >= PHP 7.1
* easyswoole 组件包括 spl 与 utility
:::

## 生成token

```php
use EasySwoole\Jwt\Jwt;

$jwtObject = Jwt::getInstance()
    ->setSecretKey('easyswoole') // 秘钥
    ->publish();

$jwtObject->setAlg('HMACSHA256'); // 加密方式
$jwtObject->setAud('user'); // 用户
$jwtObject->setExp(time()+3600); // 过期时间
$jwtObject->setIat(time()); // 发布时间
$jwtObject->setIss('easyswoole'); // 发行人
$jwtObject->setJti(md5(time())); // jwt id 用于标识该jwt
$jwtObject->setNbf(time()+60*5); // 在此之前不可用
$jwtObject->setSub('主题'); // 主题

// 自定义数据
$jwtObject->setData([
    'other_info'
]);

// 最终生成的token
$token = $jwtObject->__toString();
```

## 解析token

```php
use EasySwoole\Jwt\Jwt;

$token = "eyJhbGciOiJITUFDU0hBMjU2IiwiaXNzIjoiZWFzeXN3b29sZSIsImV4cCI6MTU3MzgzNTIxMSwic3ViIjoi5Li76aKYIiwibmJmIjoxNTczODMxOTExLCJhdWQiOiJ1c2VyIiwiaWF0IjoxNTczODMxNjExLCJqdGkiOiJjYWJhZmNiMWIxZTkxNTU3YzIxMDUxYTZiYTQ0MTliMiIsInNpZ25hdHVyZSI6IjZlNTI1ZjJkOTFjZGYzMjBmODE1NmEwMzE1MDhiNmU0ZDQ0YzhkNGFhYzZjNmU1YzMzMTNjMDIyMGJjYjJhZjQiLCJzdGF0dXMiOjEsImRhdGEiOlsib3RoZXJfaW5mbyJdfQ%3D%3D";

try {
    $jwtObject = Jwt::getInstance()->decode($token);

    $status = $jwtObject->getStatus();
    
    // 如果encode设置了秘钥,decode 的时候要指定
    // $status = $jwt->setSecretKey('easyswoole')->decode($token)

    switch ($status)
    {
        case -1:
            echo 'token无效';
            break;
        case  1:
            echo '验证通过';
            $jwtObject->getAlg();
            $jwtObject->getAud();
            $jwtObject->getData();
            $jwtObject->getExp();
            $jwtObject->getIat();
            $jwtObject->getIss();
            $jwtObject->getNbf();
            $jwtObject->getJti();
            $jwtObject->getSub();
            $jwtObject->getSignature();
            $jwtObject->getProperty('alg');
            break;
        case  2:
            echo '验证失败';
            break;
        case  3:
            echo 'token过期';
        break;
    }
} catch (\EasySwoole\Jwt\Exception $e) {

}
```
