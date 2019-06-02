## Openssl
Openssl class encapsulates Openssl encryption and decryption methods, examples:
```php
<?php
$openssl = new \EasySwoole\Component\Openssl('key','DES-EDE3');
$msg = $openssl->encrypt('huizhang');
var_dump($msg);
$msg = $openssl->decrypt($msg);
var_dump($msg);
```
输出:
````
string(24) "XrqPCC4WtFugfwZuGILEoQ=="
string(8) "huizhang"
````
