---
title: Smtp
meta:
  - name: description
    content: Easyswoole提供了一个发送邮件组件，电子邮件是—种用电子手段提供信息交换的通信方式，是互联网应用最广的服务。电子邮件几乎是每个web应用程序不可或缺的，无论是时事通讯还是订单确认。本组件采用swoole协程客户端实现了电子邮件的发送。
  - name: keywords
    content: easyswoole|Smtp
---

# 内容配置

## set

设置协议版本
```php
public function setMimeVersion($mimeVersion): void
```

设置contentType
```php
public function setContentType($contentType): void
```

设置字符
```php
public function setCharset($charset): void
```

设置编码
```php
public function setContentTransferEncoding($contentTransferEncoding): void
````

设置主题
```php
public function setSubject($subject): void
```

设置邮件内容
```php
public function setBody($body): void
````

添加附件
```php
public function addAttachment($attachment)
```

## get

获取协议版本
```php
public function getMimeVersion()
```

获取contenttype
```php
public function getContentType()
```

获取字符
```php
public function getCharset()
```

获取编码
```php
public function getContentTransferEncoding()
```

获取主题
```php
public function getSubject()
```

获取邮件内容
```php
public function getBody()
```

获取附件
```php
public function getAttachments()
```
