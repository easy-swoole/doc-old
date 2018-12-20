## Str

> 字符串工具类: EasySwoole\Utility\Str

Str字符串助手,使用示例:
```php
<?php
$str="EasySwoole";
$str2="easy_swoole";
$str3="swoole";

var_dump(\EasySwoole\Utility\Str::contains($str,$str3,false));//检查str是否包含str3,false为不检查大小写
var_dump(\EasySwoole\Utility\Str::startsWith($str,$str3,false));//检查str是否以str3开头,false为不检查大小写
var_dump(\EasySwoole\Utility\Str::endsWith($str,$str3,false));//检查str是否以str3结尾,false为不检查大小写

var_dump(\EasySwoole\Utility\Str::camel($str2));//下划线转驼峰(首字母小写)
var_dump(\EasySwoole\Utility\Str::studly($str2));//下划线转驼峰(首字母大写)
var_dump(\EasySwoole\Utility\Str::snake($str));//驼峰转下划线(改为小写)
```
