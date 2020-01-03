---
title: Verification code
meta:
  - name: description
    content: EasySwoole verification code component, can be customized to generate QR code graphics or base64 encoding.
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|Verification code|Swoole verification code
---

## Verification code generation
 
### VerifyCode.php
VerifyCode verification code operation class, if you do not pass in the Config instance, automatically instantiate a

#### Calling method:
```php
$config = new Conf();
$code = new \EasySwoole\VerifyCode\VerifyCode($config);
$code->DrawCode();//Generate a verification code and return a Result object
```

### Result.php
The captcha result class, created and returned by the VerifyCode captcha operation class when the DrawCode() method is called

Method list:
```php
    /**
     * Get captcha image
     * @author : evalor <master@evalor.cn>
     * @return mixed
     */
    function getImageByte()
    {
        return $this->CaptchaByte;
    }

    /**
     * Return image Base64 string
     * @author : evalor <master@evalor.cn>
     * @return string
     */
    function getImageBase64()
    {
        $base64Data = base64_encode($this->CaptchaByte);
        $Mime = $this->CaptchaMime;
        return "data:{$Mime};base64,{$base64Data}";
    }

    /**
     * Get verification code content
     * @author : evalor <master@evalor.cn>
     * @return mixed
     */
    function getImageCode()
    {
        return $this->CaptchaCode;
    }

    /**
     * Get Mime information
     * @author : evalor <master@evalor.cn>
     */
    function getImageMime()
    {
        return $this->CaptchaMime;
    }

    /**
     * Get the verification code file path
     * @author: eValor < master@evalor.cn >
     */
    function getImageFile()
    {
        return $this->CaptchaFile;
    }
```
