---
title: SplEnum
meta:
  - name: description
    content: EasySwoole SplEnum
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole,SplEnum
---



## Use
Used to define a collection of enumerations and normalize enumeration data.

# SplEnum related methods

Method list

| Method Name | Parameters | Description | Notes |
| :----------- | :----------- | :--------------------- | :--- |
| __construct | $val       | Constructor |      |
| getName     |            | Get the key that defines the constant |        |
| getValue    |            | Get defined constants |            |
| isValidName | string $name | Finding if the constant's key value is valid |       |
| isValidValue | $val       | Finding if the value of a constant is valid |     |
| getEnumList  |            | Get Enumeration Collection |      |
| getConstants |            | Get Enumeration Collection |      |

## how to use

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

