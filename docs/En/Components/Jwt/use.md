---
title: JWT component
meta:
  - name: description
    content: Based on easysoole component json web token
  - name: keywords
    content: swoole|swoole expand|swoole frame|easyswoole|JWT component
---

# use

## install

```php
composer require easyswoole/jwt 
```

## rely on
::: warning 
* PHP version >= PHP 7.1
* easyswoole components include spl and utility
:::

## Generate token

```php
use EasySwoole\Jwt\Jwt;

$jwtObject = Jwt::getInstance()
    ->setSecretKey('easyswoole') // Secret key
    ->publish();

$jwtObject->setAlg('HMACSHA256'); // Encryption mode
$jwtObject->setAud('user'); // user
$jwtObject->setExp(time()+3600); // Expiration date
$jwtObject->setIat(time()); // Release time
$jwtObject->setIss('easyswoole'); // Publisher
$jwtObject->setJti(md5(time())); // jwt id Used to identify the JWT
$jwtObject->setNbf(time()+60*5);
$jwtObject->setSub('theme'); // theme

// Custom data
$jwtObject->setData([
    'other_info'
]);

// Finally generated token
$token = $jwtObject->__toString();
```

## Parsing token

```php
use EasySwoole\Jwt\Jwt;

$token = "eyJhbGciOiJITUFDU0hBMjU2IiwiaXNzIjoiZWFzeXN3b29sZSIsImV4cCI6MTU3MzgzNTIxMSwic3ViIjoi5Li76aKYIiwibmJmIjoxNTczODMxOTExLCJhdWQiOiJ1c2VyIiwiaWF0IjoxNTczODMxNjExLCJqdGkiOiJjYWJhZmNiMWIxZTkxNTU3YzIxMDUxYTZiYTQ0MTliMiIsInNpZ25hdHVyZSI6IjZlNTI1ZjJkOTFjZGYzMjBmODE1NmEwMzE1MDhiNmU0ZDQ0YzhkNGFhYzZjNmU1YzMzMTNjMDIyMGJjYjJhZjQiLCJzdGF0dXMiOjEsImRhdGEiOlsib3RoZXJfaW5mbyJdfQ%3D%3D";

try {
    $jwtObject = Jwt::getInstance()->decode($token);

    $status = $jwtObject->getStatus();
    
    // If the encode has a secret key set, you need to specify
    // $status = $jwt->setSecretKey('easyswoole')->decode($token)

    switch ($status)
    {
        case  1:
            echo 'Verifying and passing';
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
        case  -1:
            echo 'invalid';
            break;
        case  -2:
            echo 'Token expired';
        break;
    }
} catch (\EasySwoole\Jwt\Exception $e) {

}
```
