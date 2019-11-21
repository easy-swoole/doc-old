---
title: JWT组件
meta:
  - name: description
    content: 基于EasySwoole组件实现的json web token
  - name: keywords
    content: easyswoole|JWT组件
---

## 解码相关方法

解码
```php
    public function decode(?string $raw):?JwtObject
```

获取解码状态, -1:无效，1:通过, 2:失败, 3:token过期
```php
    public function getStatus(): int
```
获取加密方式
```php
    public function getAlg()
```

获取用户
```php
    public function getAud()
```

获取过期时间
```php
    public function getExp()
```

获取发布时间
```php
    public function getIat()
```

获取发行人
```php
    public function getIss(): string
```

获取jwt-id
```php
    public function getJti()
```

获取生效时间
```php
    public function setNbf($nbf): void
```

获取主题
```php
    public function getSub()
```

获取自定义数据
```php
    public function getData()
```

获取签名
```php
    public function getSignature()
```

通过key获取相关数据
```php
    final public function getProperty($name)
```
