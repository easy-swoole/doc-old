---
title: Verification code
meta:
  - name: description
    content: EasySwoole verification code component,Can be customized to generate QR code graphics or base64 encoding.
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Verification code|swoole Verification code
---
# EasySwoole verification code component 

::: warning 
Warehouse Address: [Verification Code Component](https://github.com/easy-swoole/verifyCode)
:::


EasySwoole provides a separate `verification code component`, which can output a verification code in a few lines of code.

## composer installation
```php
composer require easyswoole/verifycode=3.x
```

### Example:  
```php
<?php
/**
 * Created by PhpStorm.
 * User: Apple
 * Date: 2018/11/12 0012
 * Time: 16:30
 */

namespace App\HttpController;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\VerifyCode\Conf;

class VerifyCode extends Controller
{
    function index()
    {
        $config = new Conf();
        $code = new \EasySwoole\VerifyCode\VerifyCode($config);
        $this->response()->withHeader('Content-Type','image/png');
        $this->response()->write($code->DrawCode()->getImageByte());
    }

    function getBase64(){
        $config = new Conf();
        $code = new \EasySwoole\VerifyCode\VerifyCode($config);
        $this->response()->write($code->DrawCode()->getImageBase64());
    }
}
```
