# SplArray

## Purpose
Used to define and enumerate a collection, normalize enumerated data.

## How to use it

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
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
 * Output results：
 * JANUARY
 */

```

## Core Object Method

Core class：EasySwoole\Spl\SplEnum。

### __construct

Constructor

* mixed     $val     Find value

final public function __construct($val)

### getName

Get keys that define constants

final public function getName():string

### getValue

Getting Defined Constants

final public function getValue()

### isValidName

Find out if the key value of a constant is valid

* string     $name     Find the key value of a constant

final public static function isValidName(string $name):bool

### isValidValue

Find out if constant values are valid

* mixed     $val     Find the value of a constant

final public static function isValidValue($val)

### getEnumList

Get an enumerated set

final public static function getEnumList():array

### getConstants

Get an enumerated set

private final static function getConstants():array