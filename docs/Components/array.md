---
title: SplArray
meta:
  - name: description
    content: EasySwoole SplArray
  - name: keywords
    content: easyswoole,SplArray
---
# SplArray

easyswoole用于处理数组封装的基础工具,用法如下:

```php
<?php
include "./vendor/autoload.php";
\EasySwoole\EasySwoole\Core::getInstance()->initialize();
$data = [
    'fruit' => [
        'apple' => 2,
    ],
    'test' => [
        'apple' => 2,
    ],
    'color' => [
        'red' => 2,
        'blue' => 8,
        'green' => 6
    ],
];

$splArray = new \EasySwoole\Spl\SplArray($data);

$splArray->get('fruit.apple');//获取值,支持点分隔
$splArray->set('fruit.apple',1);//设置值,支持点分隔
var_dump($splArray->getArrayCopy());//将对象转为数组
var_dump($splArray->unset('fruit.apple'));//删除一个对象属性,支持点分隔
$splArray->delete('fruit.apple');//unset的别名方法
var_dump($splArray->unique());//数组去重,取唯一值 array_unique函数的封装
var_dump($splArray->multiple());//返回数组的重复值
var_dump($splArray->asort());//按照键值升序排序 asort函数的封装
var_dump($splArray->ksort());//按照键名升序排序 ksort函数的封装

var_dump($splArray->sort());//自定义排序数组,sort函数的封装
//0 = SORT_REGULAR - 默认。把每一项按常规顺序排列（Standard ASCII，不改变类型）
//1 = SORT_NUMERIC - 把每一项作为数字来处理。
//2 = SORT_STRING - 把每一项作为字符串来处理。
//3 = SORT_LOCALE_STRING - 把每一项作为字符串来处理，基于当前区域设置（可通过 setlocale() 进行更改）。
//4 = SORT_NATURAL - 把每一项作为字符串来处理，使用类似 natsort() 的自然排序。
//5 = SORT_FLAG_CASE - 可以结合（按位或）SORT_STRING 或 SORT_NATURAL 对字符串进行排序，不区分大小写。


var_dump($splArray->column('apple'));//array_column函数的封装,取得数组某一个字段的值,
$splArray->flip();//array_flip的封装,只能对一维数组使用,否则报错
var_dump($splArray->filter('fruit,test'));//过滤数组的值
var_dump($splArray->filter(['test','fruit'],true));//过滤数组的值,排除
var_dump($splArray->keys(''));//获取数组内的一组键名
var_dump($splArray->keys('color'));//获取数组内的一组键名
var_dump($splArray->values());//提取数组中的值
var_dump($splArray->flush());//清空数组
var_dump($splArray->loadArray(['a'=>1]));//给当前对象覆盖数组
var_dump($splArray->merge(['a'=>1]));//给当前对象合并一个数组
var_dump($splArray->toXML());//数组转为xml格式

```