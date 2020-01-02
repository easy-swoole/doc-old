---
title: SplArray
meta:
  - name: description
    content: EasySwoole SplArray
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole,SplArray
---

## SplArray相关方法

方法列表

| 方法名称     | 参数                       | 说明                   | 备注 |
| :----------- | :------------------------- | :--------------------- | :--- |
| set          | $key,$value                | 设置参数               |      |
| get          | $key                       | 获取参数               |      |
| __toString   |                            | 转字符                 |      |
| getArrayCopy |                            | 数组赋值               |      |
| unset        | $key                       | 销毁数组元素           |      |
| delete       | $key                       | 去除某个数据项         |      |
| unique       |                            | 数组值唯一             |      |
| multiple     |                            | 获取数组中重复的值     |      |
| asort        |                            | 进行排序并保持索引关系 |      |
| ksort        |                            | 按照键名排序           |      |
| sort         | $sort_flags = SORT_REGULAR | 自定义排序             |      |
| column       | $key                       | 取得某一列             |      |
| flip         |                            | 交换数组中的键和值     |      |
| filter       | $key,[$key2....],$bool     | 过滤数组数据           |      |
| keys         | $key                       | 获取数组索引           |      |
| values       |                            | 获取数组中所有的值     |      |
| flush        |                            | 清空数据               |      |
| loadArray    | $data                      | 重新加载数据           |      |
| toXML        |                            | 转化成xml              |      |




easyswoole用于处理数组封装的基础工具,用法如下:

```php
/**
 *
 * User: LuffyQAQ
 * Date: 2019/10/16 16:02
 * Email: <1769360227@qq.com>
 */
include "./vendor/autoload.php";

$data = [
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 12,
        'blue' => 8,
        'green' => 6
    ],
    'name' => [
        'name1' => '北溟有鱼QAQ',
        'name2' => '北溟有鱼QAQ'
    ]
];
$splArray = new \EasySwoole\Spl\SplArray($data);

$splArray->set('fruit.apple', 3);

var_dump($splArray);

var_dump($splArray->get('fruit.apple'));

var_dump($splArray->__toString());

var_dump($splArray->getArrayCopy());

var_dump($splArray->unset('color'));

var_dump($splArray->delete('fruit.apple'));


var_dump($splArray->unique()->getArrayCopy());


var_dump($splArray->multiple()->getArrayCopy());


var_dump($splArray->asort()->getArrayCopy());

var_dump($splArray->ksort()->getArrayCopy());

var_dump($splArray->sort()->getArrayCopy());

var_dump($splArray->column('name')->getArrayCopy());

$splArrays = new \EasySwoole\Spl\SplArray(['es' => 'easyswoole']);

var_dump($splArrays->flip()->getArrayCopy());


var_dump($splArray->filter('green,grape', false)->getArrayCopy());

var_dump($splArray->filter('green,grape', true)->getArrayCopy());

var_dump($splArray->keys('name'));

var_dump($splArray->values()->getArrayCopy());

var_dump($splArray->flush()->getArrayCopy());


var_dump($splArray->loadArray(['name' => 'easyswoole'])->getArrayCopy());

var_dump($splArray->toXML());


```
