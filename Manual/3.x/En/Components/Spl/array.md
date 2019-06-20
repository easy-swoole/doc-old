# SplArray

## Purpose
Used to process array data, such as sorting, filtering, etc.

## Core Object Method

Core class：EasySwoole\Spl\SplArray。

### get

Gets the value of an item in the array.

* mixed     $name     Data Item Index

function get($path)

>Example

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
 * Output results：
 * int(2)
 */

```

### set

Sets the value of an item in the array.

* mixed     $path     Data Item Index
* mixed     $value    data

function set($path, $value)

>Example

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
 * Output results：
 * int(3)
 */

```

### __toString

Encoding JSON

function __toString()

>Example

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
 * Output results：
 * string(80) "{"fruit":{"apple":2,"orange":1,"grape":4},"color":{"red":12,"blue":8,"green":6}}"
 */

```

### getArrayCopy

Mandatory conversion to arrays

function getArrayCopy()

>Example

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
 * Output results：
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

Remove a data item

* mixed     $path     Data Item Index

function unset($path)

>Example

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
 * Output results：
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

Remove a data item

* mixed     $key     Data Item Index

public function delete($key)

ps: The unset and delete methods are in fact to achieve a unified effect, which is retained because of considering the use of the old version of users.

>Example

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
 * Output results：
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

Remove duplicate values from an array

public function unique()

>Example

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
 * Output results：
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

Get duplicate values in an array

public function multiple()

>Example

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
 * Output results：
 * array(1) {
 *   ["grape"]=>
 *   int(2)
 * }
 */

```

### asort

Sort and maintain indexing relationships

public function asort()

>Example

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
 * Output results：
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

Sort by key name

public function ksort()

>Example

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
 * Output results：
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

Custom Sorting

* mixed    $sort_flags     Types of comparison

public function sort($sort_flags = SORT_REGULAR)

* SORT_REGULAR - Normal Comparing Unit (No Type Change)
* SORT_NUMERIC - Units are compared as numbers
* SORT_STRING - Units are compared as strings
* SORT_LOCALE_STRING - Units are compared as strings based on the current locale settings, which can be changed with setlocale ().
* SORT_NATURAL - Similar to natsort (), each unit is sorted in a "natural order" of strings. Added in PHP 5.4.0.
* SORT_FLAG_CASE - Ability to merge with SORT_STRING or SORT_NATURAL (OR bit operation), case-insensitive sorting strings.

>Example

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
 * Output results：
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

Get a column

* mixed    $column     Row Index
* mixed    $index_key  Columns returning the index/key of an array

public function column($column, $index_key = null)

>Example

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
 * Output results：
 * array(1) {
 *   [0]=>
 *   int(2)
 * }
 */

```

### flip

Key and value in swap array

public function flip()

>Example

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
 * Output results：
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

Filtering Array Data

* mixed    $keys     Key to be acquired/excluded
* mixed    $exclude  True excludes the key name of the setting and false only gets the key name of the setting.

public function filter($keys, $exclude = false)

>Example

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
 * Output results：
 * array(2) {
 *   ["apple"]=>
 *   int(2)
 *   ["orange"]=>
 *   int(1)
 * }
 */

```

### keys

Getting Array Index

* mixed    $path     Data Item Index

public function keys($path = null)

>Example

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
 * Output results：
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

Get all the values in the array

public function values()

>Example

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
 * Output results：
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

Clear data

public function flush()

>Example

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
 * Output result：
 * array(0) {
 * }
 */

```

### loadArray

Reload data

* array    $data     data

public function loadArray(array $data)

>Example

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
* Output results：
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

Convert to XML

* mixed    $CD_DATA     Do you need CDTA markers?
* mixed    $rootName    With node name
* mixed    $encoding    Code

public function toXML($CD_DATA = false,$rootName = 'xml',$encoding = 'UTF-8')

>Example

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
 * Output results：
 * string(134) "<xml><fruit><apple>2</apple><orange>1</orange><grape>4</grape></fruit><color><red>2</red><blue>8</blue><green>6</green></color></xml>"
 */

```
