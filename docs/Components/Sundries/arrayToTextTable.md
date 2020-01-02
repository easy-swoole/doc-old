---
title: ArrayToTextTable
meta:
  - name: description
    content: 用于输出表格信息。
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|组件库|杂项工具
---

# ArrayToTextTable



## 用途

用于把数组数据转为表格输出。

## 核心对象类

实现该组件功能需加载核心类：
`EasySwoole\Utility\ArrayToTextTable`

## 核心对象方法

#### getTable

获取表格

- mixed $data 表格数据

```php
public function getTable($data = null)
```



#### setIndentation

设置表格缩进

- mixed $indentation 设置缩进

```php
public function setIndentation($indentation)
```



#### isDisplayHeader

设置表格头部

- bool $displayHeader 是否需要表格头部

```php
public function isDisplayHeader(bool $displayHeader)
```



#### setKeysAlignment

设置表格头部对齐方式

- mixed $keysAlignment 表格头部对齐方式

```php
public function setKeysAlignment($keysAlignment)
```



#### setValuesAlignment

设置表格数据对齐方式

- mixed $keysAlignment 表格头部对齐方式

```php
public function setValuesAlignment($valuesAlignment)
```



#### setFormatter

处理表格数据格式

- mixed $formatter 数据方式

```php
public function setFormatter($formatter)
```





## 如何使用



### 创建核心类的对象

```php
$data = [
    [
        'name' => 'James',
        'age' => '20',
        'sex'=>'男'
    ],
    [
        'name' => 'Tony',
        'age' => 50,
        'email' => '291323003@qq.com',
    ],
];
//创建核心类的对象，并带入了数据参数  $data
$renderer = new \EasySwoole\Utility\ArrayToTextTable($data);
//设置表格缩进
$renderer->setIndentation("\t");
//设置表格头部
$renderer->isDisplayHeader(true);
//设置表格头部对齐方式
$renderer->setKeysAlignment(\EasySwoole\Utility\ArrayToTextTable::AlignLeft);
//设置表格数据对齐方式
$renderer->setValuesAlignment(\EasySwoole\Utility\ArrayToTextTable::AlignLeft);
//处理表格数据格式
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

::: tip

​		ps: 执行的时候请用命令行的模式运行；如若遇到表格的外框线没有对齐，请检查中文字体和英文的字体所占用的空间比是否为2：1。

:::



