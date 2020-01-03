---
title: SplBean
meta:
  - name: description
    content: EasySwoole SplBean
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole,SplBean
---



## 用途

用于定义表结构，过滤掉无效字段数据。

# SplBean相关方法

方法列表

| 方法名称           | 参数                                           | 说明                               | 备注 |
| :----------------- | :--------------------------------------------- | :--------------------------------- | :--- |
| __construct        | array $data = null,$autoCreateProperty = false | 构造函数，初始化bean数据           |      |
| allProperty        |                                                | 过滤并转换成数组数据               |      |
| toArray            | array $columns = null,$filter = null           | 转字符                             |      |
| toArrayWithMapping | array $columns = null,$filter = null           | 获取过滤后带有字段别名的数组数据   |      |
| arrayToBean        | array $data,$autoCreateProperty = false        | 设置类属性                         |      |
| addProperty        | $name,$value = null                            | 设置类成员变量                     |      |
| getProperty        | $name                                          | 获取类成员变量值                   |      |
| jsonSerialize      |                                                | 获取类成员变量集合                 |      |
| initialize         |                                                | 初始化操作                         |      |
| setKeyMapping      |                                                | 设置keyMapping关系，也就是字段别名 |      |
| setClassMapping    |                                                | 设置classMapping关系，也就是关联类 |      |
| restore            | array $data = [], $autoCreateProperty = false  | 重新初始化bean数据                 |      |
| classMap           |                                                | 绑定关联类                         |      |

## 如何使用

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

