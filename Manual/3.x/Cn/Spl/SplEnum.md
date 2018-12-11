## SplEnum
SplEnum在php实现了枚举类型
示例:
```php
<?php
class Month extends \EasySwoole\Spl\SplEnum {
    const January = 1;
    const February = 2;
    const March = 3;
    const April = 4;
    const May = 5;
    const June = 6;
    const July = 7;
    const August = 8;
    const September = 9;
    const October = 10;
    const November = 11;
    const December = 12;
}
$month = new Month(12);
var_dump($month);
```