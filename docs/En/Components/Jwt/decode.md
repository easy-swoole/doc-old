---
title: component
meta:
  - name: description
    content: JSON based on easysoole component web token
  - name: keywords
    content: swoole|swoole Expand|swoole frame|easyswoole|JWT component
---

## Decoding correlation method

Decode
```php
    public function decode(?string $raw):?JwtObject
```

Get decoding status, 1: pass, - 1: invalid, - 2: token expired
```php
    public function getStatus(): int
```

Get encryption method
```php
    public function getAlg()
```

get user
```php
    public function getAud()
```

Get expiration time
```php
    public function getExp()
```

Get release time
```php
    public function getIat()
```

Get issuer
```php
    public function getIss(): string
```

Get jwt-id
```php
    public function getJti()
```

Get effective time
```php
    public function setNbf($nbf): void
```

Get topic
```php
    public function getSub()
```

Get custom data
```php
    public function getData()
```

Get signature
```php
    public function getSignature()
```

Get relevant data through key
```php
    final public function getProperty($name)
```
