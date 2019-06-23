# Str

## 用途
Str字符串助手

## 核心对象方法

核心类：EasySwoole\Utility\Str

### contains

检查字符串中是否包含另一字符串

* mixed     $haystack       被检查的字符串
* mixed     $needles        需要包含的字符串
* mixed     $strict         是否区分大小写

static function contains($haystack, $needles, $strict = true)

> 例子

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::contains('hello, easyswoole', 'Swoole', false));

/**
 * 输出结果:
 * bool(true)
 */

```

### startsWith

检查字符串是否以某个字符串开头

* mixed     $haystack       被检查的字符串
* mixed     $needles        需要包含的字符串
* mixed     $strict         是否区分大小写

static function startsWith($haystack, $needles, $strict = true)

> 例子

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::startsWith('hello, easyswoole', 'Hello', false));

/**
 * 输出结果:
 * bool(true)
 */

```

### endsWith

检查字符串是否以某个字符串结尾

* mixed     $haystack       被检查的字符串
* mixed     $needles        需要包含的字符串
* mixed     $strict         是否区分大小写

static function endsWith($haystack, $needles, $strict = true)

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::endsWith('hello, easyswoole', 'Swoole', false));

/**
 * Output results:
 * bool(true)
 */

```

### snake

Hump turn underscore

* mixed     $value          To-be-processed string
* mixed     $delimiter      Delimiter

static function snake($value, $delimiter = '_')

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::snake('EasySwoole'));

/**
 * Output results:
 * string(11) "easy_swoole"
 */

```

### camel

Underline to Hump (lowercase)

* mixed     $value          To-be-processed string

static function camel($value)

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::camel('easy_swoole'));

/**
 * Output results:
 * string(10) "easySwoole"
 */

```

### studly

Underline to Hump (capital letters)

* mixed     $value          To-be-processed string

static function studly($value)

> Example

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::studly('easy_swoole'));

/**
 * Output results:
 * string(10) "EasySwoole"
 */

```