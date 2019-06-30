# SplEnum

## 用途
用于定义枚举一个集合，规范化枚举数据。

## 如何使用

```php
<?php
/**
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

class Month extends \EasySwoole\Spl\SplEnum {
    const JANUARY = 1;
    const FEBRUARY = 2;
    const MARCH = 3;
    const APRIL = 4;
    const MAY = 5;
    const JUNE = 6;
    const JULY = 7;
    const AUGUST = 8;
    const SEPTEMBER = 9;
    const OCTOBER = 10;
    const NOVEMBER = 11;
    const DECEMBER = 12;
}

$month = new Month(1);
echo $month->getName();

/**
 * 输出结果：
 * JANUARY
 */

```

## 核心对象方法

核心类：EasySwoole\Spl\SplEnum。

### __construct

构造函数

* mixed     $val     查找的值

final public function __construct($val)

### getName

获取定义常量的键

final public function getName():string

### getValue

获取定义常量

final public function getValue()

### isValidName

查找常量的键值是否有效

* string     $name     查找常量的键值

final public static function isValidName(string $name):bool

### isValidValue

查找常量的值是否有效

* mixed     $val     查找常量的值

final public static function isValidValue($val)

### getEnumList

获取枚举集合

final public static function getEnumList():array

### getConstants

获取枚举集合

private final static function getConstants():array
