---
title: Smtp
meta:
  - name: description
    content: Easyswoole提供了一个发送邮件组件，电子邮件是—种用电子手段提供信息交换的通信方式，是互联网应用最广的服务。电子邮件几乎是每个web应用程序不可或缺的，无论是时事通讯还是订单确认。本组件采用swoole协程客户端实现了电子邮件的发送。
  - name: keywords
    content: easyswoole|Smtp
---

# 邮件内容

支持文本和html两种类型

## 文本

#### 示例
```php
$mimeBean = new \EasySwoole\Smtp\Message\Text();
$mimeBean->setSubject('Hello Word!');
$mimeBean->setBody('<h1>Hello Word</h1>');
```

#### 效果
![](./image/text.png) 

## Html
```php
$mimeBean = new \EasySwoole\Smtp\Message\Html();
$mimeBean->setSubject('Hello Word!');
$mimeBean->setBody('<h1>Hello Word</h1>');
```

#### 效果
![](./image/html.png) 

## 附件
```php
$mimeBean = new \EasySwoole\Smtp\Message\Text();
//$mimeBean = new \EasySwoole\Smtp\Message\Html();

...

// 创建附件
$createAttachment = Attach::create('./test.txt');

// 添加附件
$mimeBean->addAttachment($createAttachment);

...
```

