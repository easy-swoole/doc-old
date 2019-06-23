# Str

## Purpose
Str string assistant

## Core object method

Core class：EasySwoole\Utility\Str

### contains

Check whether a string contains another string

* mixed     $haystack       Checked string
* mixed     $needles        Strings to be included
* mixed     $strict         Case-sensitive or not

static function contains($haystack, $needles, $strict = true)

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

var_dump(\EasySwoole\Utility\Str::contains('hello, easyswoole', 'Swoole', false));

/**
 * Output results:
 * bool(true)
 */

```

### startsWith

Check whether a string begins with a string

* mixed     $haystack       Checked string
* mixed     $needles        Strings to be included
* mixed     $strict         Case-sensitive or not

static function startsWith($haystack, $needles, $strict = true)

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

var_dump(\EasySwoole\Utility\Str::startsWith('hello, easyswoole', 'Hello', false));

/**
 * Output results:
 * bool(true)
 */

```

### endsWith

Check whether a string ends with a string

* mixed     $haystack       Checked string
* mixed     $needles        Strings to be included
* mixed     $strict         Case-sensitive or not

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