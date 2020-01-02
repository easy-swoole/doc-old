---
title: Smtp
meta:
  - name: description
    content: Easyswoole提供了一个发送邮件组件，电子邮件是—种用电子手段提供信息交换的通信方式，是互联网应用最广的服务。电子邮件几乎是每个web应用程序不可或缺的，无论是时事通讯还是订单确认。本组件采用swoole协程客户端实现了电子邮件的发送。
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|Smtp
---

# MailerConfig
邮件配置,建议先了解发送邮件需要哪些对应的信息，好方便与以下方法对应。
## set

设置服务器地址
```php
public function setServer(string $server): void
```

设置服务器端口
```php
public function setPort(int $port): void
```

设置ssl
```php
public function setSsl(bool $ssl): void
```

设置用户名
```php
public function setUsername(string $username): void
```

设置密码
```php
public function setPassword(string $password): void
```

设置邮件发送方
```php
public function setMailFrom(string $mailFrom): void
```

设置超时时间
```php
public function setTimeout(float $timeout): void
```

设置邮件大小
```php
public function setMaxPackage(int $maxPackage)
```

## get

获取服务地址
```php
public function getServer(): string
```

获取服务端口
```php
public function getPort(): int
```

是否设置了ssl
```php
public function isSsl(): bool
```

获取用户名
```php
public function getUsername(): string
```

获取密码
```php
public function getPassword(): string
```

获取邮件发送方
```php
public function getMailFrom(): string
```

获取超时时间
```php
public function getTimeout(): float
```

获取邮件大小
```php
public function getMaxPackage()
```
