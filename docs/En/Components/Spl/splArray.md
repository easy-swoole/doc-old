---
title: SplArray
meta:
  - name: description
    content: EasySwoole SplArray
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole,SplArray
---

## SplArray related methods

Method list

| Method name  | parameter                  | Description            | Remarks |
| :----------- | :------------------------- | :--------------------- | :--- |
| set          | $key,$value                | Setting parameters     |      |
| get          | $key                       | Get parameters         |      |
| __toString   |                            | Transfer character     |      |
| getArrayCopy |                            | Array assignment       |      |
| unset        | $key                       | Destroy array elements |      |
| delete       | $key                       | Remove a data item     |      |
| unique       |                            | Array value unique     |      |
| multiple     |                            | Get duplicate values in an array      |      |
| asort        |                            | Sort and maintain index relationships |      |
| ksort        |                            | Sort by key name       |      |
| sort         | $sort_flags = SORT_REGULAR | Custom sort            |      |
| column       | $key                       | Get a column           |      |
| flip         |                            | Swap keys and values in an array   |      |
| filter       | $key,[$key2....],$bool     | Filter array data      |      |
| keys         | $key                       | Get array index        |      |
| values       |                            | Get all the values in the array   |      |
| flush        |                            | Clear data             |      |
| loadArray    | $data                      | Reload data            |      |
| toXML        |                            | Convert to xml         |      |




The basic tools for easyswoole to handle array encapsulation are as follows:

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
        'name1' => 'LuffyQAQ',
        'name2' => 'LuffyQAQ'
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
