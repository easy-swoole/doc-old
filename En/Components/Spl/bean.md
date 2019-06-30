# SplBean

## Purpose
Used to define table structure and filter out invalid field data.

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

class Apple extends \EasySwoole\Spl\SplBean {
    protected $name;
    protected $price;
    protected $number;

    protected function setKeyMapping(): array
    {
        return ['price' => 'as'];
    }
}

$apple = new Apple(['name' => 'test', 'price' => 12, 'number' => 12, 'age' => 2], true);
print_r($apple->toArray());
print_r($apple->toArrayWithMapping());
echo '---------------------------------------'.PHP_EOL;
$apple->restore(['name' => 'blank', 'price' => 12, 'number' => 12]);
print_r($apple->toArray());
print_r($apple->toArrayWithMapping());

/**
 * Output results:
 * Array
 * (
 *     [name] => test
 *     [price] => 12
 *     [number] => 12
 *     [age] => 2
 * )
 * Array
 * (
 *     [name] => test
 *     [number] => 12
 *     [age] => 2
 *     [as] => 12
 * )
 * ---------------------------------------
 * Array
 * (
 *     [name] => blank
 *     [price] => 12
 *     [number] => 12
 * )
 * Array
 * (
 *     [name] => blank
 *     [number] => 12
 *     [as] => 12
 * )
 */

```

## Core Object Method

Core class：EasySwoole\Spl\SplBean。

### __construct

Constructor to initialize bean data

* array     $data                   data
* mixed     $autoCreateProperty     Whether to filter member data of non-class member variables

public function __construct(array $data = null,$autoCreateProperty = false)

### allProperty

Get all public and protected member variables of the class

final public function allProperty()

### toArray

Filter and convert array data

* array     $columns    Filtered fields
* mixed     $filter     Filtering data that meets certain conditions

function toArray(array $columns = null,$filter = null)

### toArrayWithMapping

Gets filtered array data with field aliases

* array     $columns    Filtered fields
* mixed     $filter     Filtering data that meets certain conditions

function toArrayWithMapping(array $columns = null,$filter = null)

### arrayToBean

Setting class properties

* array     $data                   data
* mixed     $autoCreateProperty     Whether to create non-class member variables

final private function arrayToBean(array $data,$autoCreateProperty = false):SplBean

### addProperty

Setting class member variables

* mixed     $name       Membership variable name
* mixed     $value      Membership variable value

final public function addProperty($name,$value = null):void

### getProperty

Get the class member variable value

* mixed     $name       Membership variable name

final public function getProperty($name)

### jsonSerialize

Get the set of class member variables

final public function jsonSerialize():array

### initialize

Initialization operation

protected function initialize()

### setKeyMapping

Set the keyMapping relationship, which is the field alias

protected function setKeyMapping()

### setClassMapping

Set up the classMapping relationship, which is the associated class

protected function setClassMapping()

### restore

Reinitialize bean data

* array     $data                   data
* mixed     $autoCreateProperty     Whether to filter member data of non-class member variables

public function restore(array $data = [], $autoCreateProperty = false)

### classMap

Binding associative classes

private function classMap()

