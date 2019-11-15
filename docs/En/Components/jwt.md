---
title: JWT component
meta:
  - name: description
    content: Json web token based on EasySwoole component
  - name: keywords
    content: easyswoole|JWT component
---

# jwt

Json Web Token based on the easyswoole component

## Installation
Can be installed by composer
```php
composer require easyswoole/jwt 
```

## Rely
::: warning 
* PHP version >= PHP 7.1
* Easyswoole components include spl and utility
:::

## Publish Initialization

Initialize a JwtObject with a token with no information attached

```php
use EasySwoole\Jwt\JwtObject;
    
$jwtObject = JwtObject::getInstance()->publish();
```

## Setting information

The following are the methods owned by the `JwtObject` class, which can be used to set properties.

```php
/** 
 * Set the encryption method: AES/HMACSHA256, default HMACSHA256 
 */
public function setAlg($alg): void
/** 
 * Set the issuer. The default is EasySwoole 
 */
public function setIss(string $iss): void
/** 
 * Set the expiration timestamp. The default is the current time plus 2 hours.
 */
public function setExp($exp): void
/** 
 * Set theme（Subject） 
 */
public function setSub($sub): void
/** 
 * Set before this timestamp is not available (Not Before), default time()
 */
public function setNbf($nbf): void
/** 
 * Set user（Audience）
 */
public function setAud($aud): void
/** 
 * Set the signing time, default time()
 */
public function setIat($iat): void
/**
 * Set the JWT ID to identify the JWT 
 */
public function setJti($jti): void
/** 
 * Setting data 
 */
public function setData($data): void
```

## Encode example

```php
<?php

/** @var \EasySwoole\Jwt\JwtObject $obj */
//Set encryption mode Support AES and HMACSHA256 Set the default value to EasySwoole
$obj = \EasySwoole\Jwt\Jwt::getInstance()->algMethod('AES')->setSecretKey('test')->publish();

$obj->setExp(time() + 3600);
$obj->setData('Test Data');

$token = $obj->__toString();
echo $token;
```
### Output result

```
eyJhbGciOiJBRVMiLCJpc3MiOiJtZSIsImV4cCI6MTU3MTgwMDc0OSwic3ViIjoi5Li76aKYIiwibmJmIjoxNTcxNzI3NjA1LCJhdWQiOiJ5b3UiLCJpYXQiOjE1NzE3OTcxNDksImp0aSI6IjVkYWZiODlkNjM2ZjQiLCJzaWduYXR1cmUiOiI2dnVMTGRNWXI0bEFLcVhOeVMvbVVFa2lISVFQc2wzWUUyNFV1aFpKQzBhM25mRC9mc3dGeTFkWmdYRGN1cUZ6NUdkeEgybVBuY25IdWhXY1ZMeWZFa3plZVRzVGFscy9VeXVEalN2WFZqWTJxendoSCt1K203RDZBVVRFN1VGaFFtM2xvb2pBZklERVc3bHJtWWxCYXpqUldQV0dlaWYraGZTU05JY1FqYWhxSCtobkp6QWVxbUJ3cVBrVEYzZ044Znp2b2plWTRlWmhQaGpSNlhGaHZBPT0iLCJzdGF0dXMiOjEsImRhdGEiOiLmtYvor5XmlbDmja5hIn0%3D
```

## Decode example

Through the token passed by the client or other places, you can parse and get the attached data.

```php
<?php
$jwt = \EasySwoole\Jwt\Jwt::getInstance();

// Actually, it is possible to obtain a token by means of passing parameters, etc.
$token = 'eyJhbGciOiJBRVMiLCJpc3MiOiJtZSIsImV4cCI6MTU3MTgwMDc0OSwic3ViIjoi5Li76aKYIiwibmJmIjoxNTcxNzI3NjA1LCJhdWQiOiJ5b3UiLCJpYXQiOjE1NzE3OTcxNDksImp0aSI6IjVkYWZiODlkNjM2ZjQiLCJzaWduYXR1cmUiOiI2dnVMTGRNWXI0bEFLcVhOeVMvbVVFa2lISVFQc2wzWUUyNFV1aFpKQzBhM25mRC9mc3dGeTFkWmdYRGN1cUZ6NUdkeEgybVBuY25IdWhXY1ZMeWZFa3plZVRzVGFscy9VeXVEalN2WFZqWTJxendoSCt1K203RDZBVVRFN1VGaFFtM2xvb2pBZklERVc3bHJtWWxCYXpqUldQV0dlaWYraGZTU05JY1FqYWhxSCtobkp6QWVxbUJ3cVBrVEYzZ044Znp2b2plWTRlWmhQaGpSNlhGaHZBPT0iLCJzdGF0dXMiOjEsImRhdGEiOiLmtYvor5XmlbDmja5hIn0%3D';

try {
  /** @var \EasySwoole\Jwt\JwtObject $result */
  $result = $jwt->decode($token);

  switch ($result->getStatus()) {
    case -1:
      echo 'Invalid token';
    case  1:
      echo 'Verification passed';
      break;
    case  2:
      echo 'verification failed';
      break;
    case  3:
      echo 'Token expired';
      break;
  }
    
  // Improve business logic based on the results after decryption
  var_dump($result);
} catch (\Exception $e) {
  // TODO: Handling exceptions
}
```

### Get attached data

```php
echo $result->getNbf() . PHP_EOL;
echo $result->getAlg() . PHP_EOL;
echo $result->getExp() . PHP_EOL;
echo $result->getIat() . PHP_EOL;
echo $result->getIss() . PHP_EOL;
echo $result->getSignature() . PHP_EOL;
// If not set, the following values are not null by default.
echo $result->getAud() . PHP_EOL;
echo $result->getData() . PHP_EOL;
echo $result->getJti() . PHP_EOL;
echo $result->getSub() . PHP_EOL;

// It can also be decrypted based on the attribute name, nbf/alg/exp/iat/iss/signature/aud/data/jti/sub
echo $result->getProperty('signature') . PHP_EOL;
```

