# SplArray

## 用途
用于处理数组数据，比如排序，过滤等等。

## 核心对象方法

核心类：EasySwoole\Spl\SplArray。

### get

获取数组中某项的值。

* mixed     $name     数据项索引

function get($path)

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 12,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->get('fruit.apple'));

/**
 * 输出结果过：
 * int(2)
 */

```

### set

设置数组中某项的值。

* mixed     $path     数据项索引
* mixed     $value    数据

function set($path, $value)

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 12,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);

$splArray->set('fruit.apple', 3);

var_dump($splArray->get('fruit.apple'));

/**
 * 输出结果过：
 * int(3)
 */

```

### __toString

进行 JSON 编码

function __toString()

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 12,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->__toString());

/**
 * 输出结果过：
 * string(80) "{"fruit":{"apple":2,"orange":1,"grape":4},"color":{"red":12,"blue":8,"green":6}}"
 */

```

### getArrayCopy

强制转换成数组

function getArrayCopy()

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 12,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->__toString());

/**
 * 输出结果过：
 * array(2) {
 *   ["fruit"]=>
 *   array(3) {
 *     ["apple"]=>
 *     int(2)
 *     ["orange"]=>
 *     int(1)
 *     ["grape"]=>
 *     int(4)
 *   }
 *   ["color"]=>
 *   array(3) {
 *     ["red"]=>
 *     int(12)
 *     ["blue"]=>
 *     int(8)
 *     ["green"]=>
 *     int(6)
 *   }
 * }
 * 
 */

```

### unset

去除某个数据项

* mixed     $path     数据项索引

function unset($path)

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 12,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);

$splArray->unset('fruit.apple');

var_dump($splArray->__toString());

/**
 * 输出结果过：
 * array(2) {
 *   ["fruit"]=>
 *   array(2) {
 *     ["orange"]=>
 *     int(1)
 *     ["grape"]=>
 *     int(4)
 *   }
 *   ["color"]=>
 *   array(3) {
 *     ["red"]=>
 *     int(12)
 *     ["blue"]=>
 *     int(8)
 *     ["green"]=>
 *     int(6)
 * }
 }

 */

```

### delete

去除某个数据项

* mixed     $key     数据项索引

public function delete($key)

ps: unset和delete方法其实是实现统一效果，因考虑旧版本用户使用情况，故而保留。

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 12,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);

$splArray->delete('fruit.apple');

var_dump($splArray->__toString());

/**
 * 输出结果过：
 * array(2) {
 *   ["fruit"]=>
 *   array(2) {
 *     ["orange"]=>
 *     int(1)
 *     ["grape"]=>
 *     int(4)
 *   }
 *   ["color"]=>
 *   array(3) {
 *     ["red"]=>
 *     int(12)
 *     ["blue"]=>
 *     int(8)
 *     ["green"]=>
 *     int(6)
 *   }
 * }
 */

```

### unique

移除数组中重复的值

public function unique()

>例子

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
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->unique()->getArrayCopy());

/**
 * 输出结果过：
 * array(4) {
 *   ["apple"]=>
 *   int(2)
 *   ["orange"]=>
 *   int(1)
 *   ["pear"]=>
 *   int(4)
 *   ["banana"]=>
 *   int(8)
 * }
 */

```

### multiple

获取数组中重复的值

public function multiple()

>例子

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
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->unique()->getArrayCopy());

/**
 * 输出结果过：
 * array(1) {
 *   ["grape"]=>
 *   int(2)
 * }
 */

```

### asort

进行排序并保持索引关系

public function asort()

>例子

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
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->asort()->getArrayCopy());

/**
 * 输出结果过：
 * array(5) {
 *   ["orange"]=>
 *   int(1)
 *   ["apple"]=>
 *   int(2)
 *   ["grape"]=>
 *   int(2)
 *   ["pear"]=>
 *   int(4)
 *   ["banana"]=>
 *   int(8)
 * }
 */

```

### ksort

按照键名排序

public function ksort()

>例子

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
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->ksort()->getArrayCopy());

/**
 * 输出结果过：
 * array(5) {
 *   ["apple"]=>
 *   int(2)
 *   ["banana"]=>
 *   int(8)
 *   ["grape"]=>
 *   int(2)
 *   ["orange"]=>
 *   int(1)
 *   ["pear"]=>
 *   int(4)
 * }
 */

```

### sort

自定义排序

* mixed    $sort_flags     比较类型

public function sort($sort_flags = SORT_REGULAR)

* SORT_REGULAR - 正常比较单元（不改变类型）
* SORT_NUMERIC - 单元被作为数字来比较
* SORT_STRING - 单元被作为字符串来比较
* SORT_LOCALE_STRING - 根据当前的区域（locale）设置来把单元当作字符串比较，可以用 setlocale() 来改变
* SORT_NATURAL - 和 natsort() 类似对每个单元以“自然的顺序”对字符串进行排序。 PHP 5.4.0 中新增的。
* SORT_FLAG_CASE - 能够与 SORT_STRING 或 SORT_NATURAL 合并（OR 位运算），不区分大小写排序字符串。

>例子

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
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->ksort()->getArrayCopy());

/**
 * 输出结果过：
 * array(5) {
 *   [0]=>
 *   int(1)
 *   [1]=>
 *   int(2)
 *   [2]=>
 *   int(2)
 *   [3]=>
 *   int(4)
 *   [4]=>
 *   int(8)
 * }
 */

```

### column

取得某一列

* mixed    $column     列索引
* mixed    $index_key  返回数组的索引/键的列

public function column($column, $index_key = null)

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 2,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->column('apple')->getArrayCopy());

/**
 * 输出结果过：
 * array(1) {
 *   [0]=>
 *   int(2)
 * }
 */

```

### flip

交换数组中的键和值

public function flip()

>例子

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
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->flip()->getArrayCopy());

/**
 * 输出结果过：
 * array(4) {
 *   [2]=>
 *   string(5) "grape"
 *   [1]=>
 *   string(6) "orange"
 *   [4]=>
 *   string(4) "pear"
 *   [8]=>
 *   string(6) "banana"
 * }
 */

```

### filter

过滤数组数据

* mixed    $keys     需要取得/排除的键
* mixed    $exclude  true则排除设置的键名 false则仅获取设置的键名

public function filter($keys, $exclude = false)

>例子

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
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->filter('apple,orange')->getArrayCopy());

/**
 * 输出结果过：
 * array(2) {
 *   ["apple"]=>
 *   int(2)
 *   ["orange"]=>
 *   int(1)
 * }
 */

```

### keys

获取数组索引

* mixed    $path     数据项索引

public function keys($path = null)

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 2,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->keys('fruit'));

/**
 * 输出结果过：
 * array(3) {
 *   [0]=>
 *   string(5) "apple"
 *   [1]=>
 *   string(6) "orange"
 *   [2]=>
 *   string(5) "grape"
 * }
 */

```

### values

获取数组中所有的值

public function values()

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 2,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->values()->getArrayCopy());

/**
 * 输出结果过：
 * array(2) {
 *   [0]=>
 *   array(3) {
 *     ["apple"]=>
 *     int(2)
 *     ["orange"]=>
 *     int(1)
 *     ["grape"]=>
 *     int(4)
 *   }
 *   [1]=>
 *   array(3) {
 *     ["red"]=>
 *     int(2)
 *     ["blue"]=>
 *     int(8)
 *     ["green"]=>
 *     int(6)
 *   }
 * }
 */

```

### flush

清空数据

public function flush()

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 2,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->flush()->getArrayCopy());

/**
 * 输出结果过：
 * array(0) {
 * }
 */

```

### loadArray

重新加载数据

* array    $data     数据

public function loadArray(array $data)

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 2,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);

$data = [
    'apple' => 2,
    'orange' => 1,
    'grape' => 2,
    'pear' => 4,
    'banana' => 8
];

var_dump($splArray->loadArray($data)->getArrayCopy());

/**
* 输出结果过：
 * array(5) {
 *   ["apple"]=>
 *   int(2)
 *   ["orange"]=>
 *   int(1)
 *   ["grape"]=>
 *   int(2)
 *   ["pear"]=>
 *   int(4)
 *   ["banana"]=>
 *   int(8)
 * }
 */

```

### toXML

转化成xml

* mixed    $CD_DATA     是否需要CDTA标志
* mixed    $rootName    跟节点名称
* mixed    $encoding    编码

public function toXML($CD_DATA = false,$rootName = 'xml',$encoding = 'UTF-8')

>例子

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
    'fruit' => [
        'apple' => 2,
        'orange' => 1,
        'grape' => 4
    ],
    'color' => [
        'red' => 2,
        'blue' => 8,
        'green' => 6
    ]
];

$splArray = new \EasySwoole\Spl\SplArray($data);
var_dump($splArray->toXML());

/**
 * 输出结果过：
 * string(134) "<xml><fruit><apple>2</apple><orange>1</orange><grape>4</grape></fruit><color><red>2</red><blue>8</blue><green>6</green></color></xml>"
 */

```
