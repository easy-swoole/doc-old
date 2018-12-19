## 雪花算法

> 雪花算法工具类: EasySwoole\Utility\SnowFlake

使用雪花算法生成唯一编号
示例:
```php
<?php
$str = \EasySwoole\Utility\SnowFlake::make(1,1);//传入数据中心id(0-31),任务进程id(0-31)
var_dump($str);
var_dump(\EasySwoole\Utility\SnowFlake::unmake($str));
```
