---
title: component
meta:
  - name: description
    content: JSON based on easysoole component web token
  - name: keywords
    content: swoole|swoole Expand|swoole frame|easyswoole|JWT component
---

## Coding related methods

Set encryption method, defaultHMACSHA256
```php
    function algMethod(string $method):Jwt
```

Set secret key, defaultEasyswoole
```php
    function setSecretKey(string $key):Jwt
```

Initializing the jwtobject of a token without additional information
```php
    public function publish():JwtObject
```

Set encryption method, defaultHMACSHA256
```php
    public function setAlg($alg): void
```

set user
```php
    public function setAud($aud): void
```

Set expiration time
```php
    public function setExp($exp): void
```

Set publishing time
```php
    public function setIat($iat): void
```

Set up the issuer
```php
    public function setIss(string $iss): void
```

Set JWT ID to identify the JWT
```php
    public function setJti($jti): void
```

Not available until
```php
    public function setNbf($nbf): void
```

set topic
```php
    public function setSub($sub): void
```

Set other data
```php
    public function setData($data): void
```

get token
```php
    function __toString()
```
