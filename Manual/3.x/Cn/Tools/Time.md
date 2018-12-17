## Time
时间戳助手,用法示例:
```php
<?php

$time = time();
$date = date('Y-m-d H:i:s',$time);
echo "现在时间是:$date,时间戳是:$time\n";
var_dump(\EasySwoole\Utility\Time::createDateTimeClass($time));
var_dump(\EasySwoole\Utility\Time::createDateTimeClass($date));//创建datetime对象
var_dump(\EasySwoole\Utility\Time::startTimestamp($time));//获取一个日期的开始时间
var_dump(\EasySwoole\Utility\Time::startTimestamp($date));//获取一个日期的开始时间
var_dump(\EasySwoole\Utility\Time::endTimestamp($time));//获取一个日期的结束时间
var_dump(\EasySwoole\Utility\Time::endTimestamp($date));//获取一个日期的结束时间
var_dump(\EasySwoole\Utility\Time::parserDateTime($time));//从DateTime对象中获取年月日时分秒
var_dump(\EasySwoole\Utility\Time::parserDateTime($date));//从DateTime对象中获取年月日时分秒



```