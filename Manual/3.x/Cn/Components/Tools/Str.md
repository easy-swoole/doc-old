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

var_dump(\EasySwoole\Utility\Str::endsWith('hello, easyswoole', 'Swoole', false));

/**
 * 输出结果:
 * bool(true)
 */

```

### snake

驼峰转下划线

* mixed     $value          待处理字符串
* mixed     $delimiter      分隔符

static function snake($value, $delimiter = '_')

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

var_dump(\EasySwoole\Utility\Str::snake('EasySwoole'));

/**
 * 输出结果:
 * string(11) "easy_swoole"
 */

```

### camel

下划线转驼峰 (首字母小写)

* mixed     $value          待处理字符串

static function camel($value)

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

var_dump(\EasySwoole\Utility\Str::camel('easy_swoole'));

/**
 * 输出结果:
 * string(10) "easySwoole"
 */

```

### studly

下划线转驼峰 (首字母大写)

* mixed     $value          待处理字符串

static function studly($value)

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

var_dump(\EasySwoole\Utility\Str::studly('easy_swoole'));

/**
 * 输出结果:
 * string(10) "EasySwoole"
 */

```