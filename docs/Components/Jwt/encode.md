---
title: JWT组件
meta:
  - name: description
    content: 基于EasySwoole组件实现的json web token
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|JWT组件
---

## 编码相关方法

设置加密方式，默认HMACSHA256
```php
    function algMethod(string $method):Jwt
```

设置秘钥，默认Easyswoole
```php
    function setSecretKey(string $key):Jwt
```

初始化一个没有附带信息的token的JwtObject
```php
    public function publish():JwtObject
```

设置加密方式, 默认HMACSHA256
```php
    public function setAlg($alg): void
```

设置用户
```php
    public function setAud($aud): void
```

设置过期时间
```php
    public function setExp($exp): void
```

设置发布时间
```php
    public function setIat($iat): void
```

设置发行人
```php
    public function setIss(string $iss): void
```

设置jwt-id，用于标识该jwt
```php
    public function setJti($jti): void
```

在此之前不可用
```php
    public function setNbf($nbf): void
```

设置主题
```php
    public function setSub($sub): void
```

设置其他数据
```php
    public function setData($data): void
```

获取token
```php
    function __toString()
```
