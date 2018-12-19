## Hash

> Hash工具类: EasySwoole\Utility\Hash

 用于快速处理哈希密码以及数据完整性校验等场景.
示例:
```php
<?php
$password=123456;
$hash = \EasySwoole\Utility\Hash::makePasswordHash($password);
var_dump($hash);
var_dump(\EasySwoole\Utility\Hash::validatePasswordHash($password,$hash));
```
