# ArrayToTextTable

## Purpose
Used to output table information.

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

$data = [
    [
        'name' => 'James',
        'age' => '20',
        'sex'=>'man'
    ],
    [
        'name' => 'test name',
        '年龄' => 50,
        'email' => '291323003@qq.com',
    ],
];

$renderer = new \EasySwoole\Utility\ArrayToTextTable($data);
$renderer->setIndentation("\t");
$renderer->isDisplayHeader(true);
$renderer->setKeysAlignment(\EasySwoole\Utility\ArrayToTextTable::AlignLeft);
$renderer->setValuesAlignment(\EasySwoole\Utility\ArrayToTextTable::AlignLeft);
$renderer->setFormatter(function (&$value,$key){
    if($key == 'sex'){
        if(empty($value)){
            $value = 'Unknown sex';
        }
    }else if($key == 'email'){
        if(empty($value)){
            $value = 'Unknown mail';
        }
    }
});

$table =  $renderer->getTable();

echo $renderer;

```

> ps:When executing, please run in command line mode; if the outline of the table is not aligned, please check whether the space ratio of Chinese font to English font is 2:1.

## Core Object Method

Core class：EasySwoole\Utility\ArrayToTextTable

### getTable

Get the table：

- mixed    $data     Tabular data

```php
public function getTable($data = null)
```
### setIndentation

Setting table indentation

- mixed    $indentation     Setting indentation

```php
public function setIndentation($indentation)
```

### isDisplayHeader

Setting table header

- bool    $displayHeader     Do you need table headers?

```php
public function isDisplayHeader(bool $displayHeader)
```

### setKeysAlignment

Set the header alignment of the table

- mixed    $keysAlignment     Form Header Alignment

```php
public function setKeysAlignment($keysAlignment)
```

### setValuesAlignment

Setting the alignment of table data

- mixed    $valuesAlignment    Alignment of table data

```php
public function setValuesAlignment($valuesAlignment)
```

### setFormatter

Processing table data format

- mixed    $formatter     Data mode

```php
public function setFormatter($formatter)
```
