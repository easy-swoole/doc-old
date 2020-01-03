---
title: SplEnum
meta:
  - name: description
    content: EasySwoole SplEnum
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole,SplEnum
---



## 用途
用于定义枚举一个集合，规范化枚举数据。

# SplEnum相关方法

方法列表

| 方法名称     | 参数         | 说明                   | 备注 |
| :----------- | :----------- | :--------------------- | :--- |
| __construct  | $val         | 构造函数               |      |
| getName      |              | 获取定义常量的键       |      |
| getValue     |              | 获取定义常量           |      |
| isValidName  | string $name | 查找常量的键值是否有效 |      |
| isValidValue | $val         | 查找常量的值是否有效   |      |
| getEnumList  |              | 获取枚举集合           |      |
| getConstants |              | 获取枚举集合           |      |

## 如何使用

```php
/**
 *
 * User: zs
 * Date: 2019/10/16 17:08
 * Email: <1769360227@qq.com>
 */


include "./vendor/autoload.php";


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

var_dump($month->getName());

var_dump($month->getValue());

var_dump(Month::isValidName('JANUARY'));

var_dump(Month::isValidValue(1));

var_dump( Month::getEnumList());


```

