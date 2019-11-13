---
title: Smtp
meta:
  - name: description
    content: Easyswoole提供了一个发送邮件组件，电子邮件是—种用电子手段提供信息交换的通信方式，是互联网应用最广的服务。电子邮件几乎是每个web应用程序不可或缺的，无论是时事通讯还是订单确认。本组件采用swoole协程客户端实现了电子邮件的发送。
  - name: keywords
    content: easyswoole|Smtp
---

# Smtp

电子邮件是—种用电子手段提供信息交换的通信方式，是互联网应用最广的服务。电子邮件几乎是每个web应用程序不可或缺的，无论是时事通讯还是订单确认。本库采用swoole协程客户端实现了电子邮件的发送。

## 安装
```php
composer require easyswoole/smtp
```
## 使用
```php
use EasySwoole\Smtp\Mailer;
use EasySwoole\Smtp\MailerConfig;
use EasySwoole\Smtp\Message\Html;
use EasySwoole\Smtp\Message\Attach;
// 必须用go
go(function (){
    $config = new MailerConfig();
    $config->setServer('smtp.163.com');
    $config->setSsl(false);
    $config->setUsername('huizhang');
    $config->setPassword('*******');
    $config->setMailFrom('xx@163.com');
    $config->setTimeout(10);//设置客户端连接超时时间
    $config->setMaxPackage(1024*1024*5);//设置包发送的大小：5M

    //设置文本或者html格式
    $mimeBean = new Html();
    $mimeBean->setSubject('Hello Word!');
    $mimeBean->setBody('<h1>Hello Word</h1>');

    //添加附件
    $mimeBean->addAttachment(Attach::create('./test.txt'));

    $mailer = new Mailer($config);
    $mailer->sendTo('xx@qq.com', $mimeBean);
});

```
