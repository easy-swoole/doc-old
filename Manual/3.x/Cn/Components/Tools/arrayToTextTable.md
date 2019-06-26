# ArrayToTextTable

## 用途
用于输出表格信息。

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

$data = [
    [
        '姓名' => 'James',
        '年龄' => '20',
        'sex'=>'男'
    ],
    [
        '姓名' => '这是测试姓名啊',
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
            $value = '未知性别';
        }
    }else if($key == 'email'){
        if(empty($value)){
            $value = '未知邮箱';
        }
    }
});

$table =  $renderer->getTable();

echo $renderer;

```

> ps: 执行的时候请用命令行的模式运行；如若遇到表格的外框线没有对齐，请检查中文字体和英文的字体所占用的空间比是否为2：1。

## 核心对象方法

核心类：EasySwoole\Utility\ArrayToTextTable

### getTable

获取表格：

- mixed    $data     表格数据

```php
public function getTable($data = null)
```
### setIndentation

设置表格缩进

- mixed    $indentation     设置缩进

```php
public function setIndentation($indentation)
```

### isDisplayHeader

设置表格头部

- bool    $displayHeader     是否需要表格头部

```php
public function isDisplayHeader(bool $displayHeader)
```

### setKeysAlignment

设置表格头部对齐方式

- mixed    $keysAlignment     表格头部对齐方式

```php
public function setKeysAlignment($keysAlignment)
```

### setValuesAlignment

设置表格数据对齐方式

- mixed    $valuesAlignment    表格数据对齐方式

```php
public function setValuesAlignment($valuesAlignment)
```

### setFormatter

处理表格数据格式

- mixed    $formatter     数据方式

```php
public function setFormatter($formatter)
```
