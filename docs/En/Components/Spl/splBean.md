---
title: SplBean
meta:
  - name: description
    content: EasySwoole SplBean
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole,SplBean
---



## Use

Used to define the table structure and filter out invalid field data.

# SplBean related methods

Method list

| Method Name | Parameters | Description | Notes |
| :---------- | :--------- | :---------- | :---- |
| __construct | array $data = null,$autoCreateProperty = false | Constructor, initialize bean data           |      |
| allProperty        |                                                | Filter and convert to array data               |      |
| toArray            | array $columns = null,$filter = null           | Transfer character                             |      |
| toArrayWithMapping | array $columns = null,$filter = null           | Get filtered array data with field aliases   |      |
| arrayToBean        | array $data,$autoCreateProperty = false        | Set class properties                         |      |
| addProperty        | $name,$value = null                            | Set class member variables                     |      |
| getProperty        | $name                                          | Get class member variable values                   |      |
| jsonSerialize      |                                                | Get class member variable collection                 |      |
| initialize         |                                                | Initialization operation                         |      |
| setKeyMapping      |                                                | Set the keyMapping relationship, which is the field alias |      |
| setClassMapping    |                                                | Set the classMapping relationship, which is the associated class. |      |
| restore            | array $data = [], $autoCreateProperty = false  | Reinitialize bean data                 |      |
| classMap           |                                                | Binding association class                         |      |

## how to use

```php

/**
 *
 * User: LuffyQAQ
 * Date: 2019/10/16 16:45
 * Email: <1769360227@qq.com>
 */
include "./vendor/autoload.php";
use EasySwoole\Spl\SplBean;

class TestBean extends SplBean
{
    public $a = 2;
    protected $b;
    private $c;
    protected $d_d;


    protected function setKeyMapping(): array
    {
        return [
            'd-d' => "d_d"
        ];
    }
}

$bean = new TestBean([
    'a'=>'a',
    'b'=>'b',
    'c'=>'c',
    'd_d'=>'d_d'
]);

var_dump($bean->allProperty());


$data = $bean->toArray(null, function ($a) {
    if (in_array($a, ['d_d'])) {
        return $a;
    }
});

$bean = new TestBean([
    'a'=>1,
    'b'=>2,
    'c'=>3,
    'd_d'=>4
]);
$data = $bean->toArrayWithMapping(['a', 'b', 'd-d'], function ($val) {
    return $val;
});

var_dump($data);

var_dump($bean->toArrayWithMapping(['a','d-d']));

$bean = new TestBean();
$bean->addProperty('a', 'es');
$bean->addProperty('b', 'es');
$bean->addProperty('d_d', 'es');


var_dump($bean->toArray());

var_dump($bean->getProperty('a'));

var_dump( $bean->jsonSerialize());


var_dump($bean->restore()->toArray());

```

