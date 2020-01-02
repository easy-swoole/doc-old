---
title: ArrayToTextTable
meta:
  - name: description
    content: Used to output table information.
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Component Library|Miscellaneous Tools
---

# ArrayToTextTable



## Use

Used to convert array data to table output.

## Core Object Class

To implement this component function you need to load the core class:
`EasySwoole\Utility\ArrayToTextTable`

## Core Object Method

#### getTable

Get the form

- mixed $data table data

```php
Public function getTable($data = null)
```



#### setIndentation

Set table indentation

- mixed $indentation setting indentation

```php
public function setIndentation($indentation)
```



#### isDisplayHeader

Set the table header

- bool $displayHeader Do you need a table header?

```php
Public function isDisplayHeader(bool $displayHeader)
```



#### setKeysAlignment

Set table header alignment

- mixed $keysAlignment table header alignment

```php
Public function setKeysAlignment($keysAlignment)
```



#### setValuesAlignment

Set table data alignment

- mixed $keysAlignment table header alignment

```php
Public function setValuesAlignment($valuesAlignment)
```



#### setFormatter

Processing tabular data format

- mixed $formatter data mode

```php
public function setFormatter($formatter)
```



## how to use

### Creating objects of the core class

```php
$data = [
    [
        'name' => 'James',
        'age' => '20',
        'sex'=>'man'
    ],
    [
        'name' => 'Tony',
        'age' => 50,
        'email' => '291323003@qq.com',
    ],
];
// Create a core class object, and bring in the data parameter $data
$renderer = new \EasySwoole\Utility\ArrayToTextTable($data);
// Set the table indentation
$renderer->setIndentation("\t");
// Set the table header
$renderer->isDisplayHeader(true);
// Set the table header alignment
$renderer->setKeysAlignment(\EasySwoole\Utility\ArrayToTextTable::AlignLeft);
// Set the table data alignment
$renderer->setValuesAlignment(\EasySwoole\Utility\ArrayToTextTable::AlignLeft);
// Processing table data format
$renderer->setFormatter(function (&$value,$key){
    if($key == 'sex'){
        if(empty($value)){
            $value = 'Unknown gender';
        }
    }else if($key == 'email'){
        if(empty($value)){
            $value = 'Unknown mailbox';
        }
    }
});

$table =  $renderer->getTable();

echo $renderer;
```

::: tip

​		Ps: Please run in the command line mode. If the border of the table is not aligned, check whether the space ratio of the Chinese font and the English font is 2:1.

:::



