## Openssl
Openssl类封装好了Openssl加密解密方法,示例:
```php
<?php
$openssl = new \EasySwoole\Component\Openssl('key','DES-EDE3');
$msg = $openssl->encrypt('仙士可');
var_dump($msg);
$msg = $openssl->decrypt($msg);
var_dump($msg);
```
输出:
````
string(24) "Lgx3rlBCPcX+Ke+Whau87g=="
string(9) "仙士可"
````
