# SplBean

## 用途
用于定义表结构，过滤掉无效字段数据。

## 如何使用

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
 * 输出结果:
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

## 核心对象方法

核心类：EasySwoole\Spl\SplBean。

### __construct

构造函数，初始化bean数据

* array     $data                   数据
* mixed     $autoCreateProperty     是否过滤非类成员变量成员数据

public function __construct(array $data = null,$autoCreateProperty = false)

### allProperty

获取类所有的public和protected 成员变量

final public function allProperty()

### toArray

过滤并转换成数组数据

* array     $columns    要过滤的字段数据
* mixed     $filter     过滤满足某种条件的数据

function toArray(array $columns = null,$filter = null)

### toArrayWithMapping

获取过滤后带有字段别名的数组数据

* array     $columns    要过滤的字段数据
* mixed     $filter     过滤满足某种条件的数据

function toArrayWithMapping(array $columns = null,$filter = null)

### arrayToBean

设置类属性

* array     $data                   数据
* mixed     $autoCreateProperty     是否创建非类成员变量

final private function arrayToBean(array $data,$autoCreateProperty = false):SplBean

### addProperty

设置类成员变量

* mixed     $name       成员变量名字
* mixed     $value      成员变量值

final public function addProperty($name,$value = null):void

### getProperty

获取类成员变量值

* mixed     $name       成员变量名字

final public function getProperty($name)

### jsonSerialize

获取类成员变量集合

final public function jsonSerialize():array

### initialize

初始化操作

protected function initialize()

### setKeyMapping

设置keyMapping关系，也就是字段别名

protected function setKeyMapping()

### setClassMapping

设置classMapping关系，也就是关联类

protected function setClassMapping()

### restore

重新初始化bean数据

* array     $data                   数据
* mixed     $autoCreateProperty     是否过滤非类成员变量成员数据

public function restore(array $data = [], $autoCreateProperty = false)

### classMap

绑定关联类

private function classMap()

