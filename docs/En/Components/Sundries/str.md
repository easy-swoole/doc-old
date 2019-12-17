---
title: Str
meta:
  - name: description
    content: Str string helper
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Component Library|Miscellaneous Tools|Str
---



# Str


## Use

Str string helper


## Core Object Class

To implement this component function you need to load the core class:

```php
EasySwoole\Utility\Str
```



## Core Object Method



#### Contains

Check if another string is included in the string

- mixed $haystack checked string
- mixed $needles need to contain the string
- mixed $strict is case sensitive

```php
Static function contains($haystack, $needles, $strict = true)
```

::: tip
Example
:::
```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::contains('hello, easyswoole', 'Swoole', false));

/**
 * Output results:
 * bool(true)
 */
```



#### startsWith

Check if the string starts with a string

- mixed $haystack checked string
- mixed $needles need to contain the string
- mixed $strict is case sensitive

```php
static function startsWith($haystack, $needles, $strict = true)
```

:::tip
Example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::startsWith('hello, easyswoole', 'Hello', false));

/**
 * Output results:
 * bool(true)
 */
```



#### endsWith

Check if the string ends with a string

- mixed $haystack checked string
- mixed $needles need to contain the string
- mixed $strict is case sensitive

```php
static function endsWith($haystack, $needles, $strict = true)
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::endsWith('hello, easyswoole', 'Swoole', false));

/**
 * Output results:
 * bool(true)
 */
```



#### snake

Hump downline

- mixed $value pending string
- mixed $delimiter separator

```php
static function snake($value, $delimiter = '_')
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::snake('EasySwoole'));

/**
 * Output results:
 * string(11) "easy_swoole"
 */
```



#### camel

Underline to hump (lower initial)

- mixed $value pending string

```php
static function camel($value)
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::camel('easy_swoole'));

/**
 * Output results:
 * string(10) "easySwoole"
 */
```



#### studly

Underline to hump (initial capitalization)

- mixed $value pending string

```php
static function studly($value)
```

:::tip

Example

:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
 */

require './vendor/autoload.php';

var_dump(\EasySwoole\Utility\Str::studly('easy_swoole'));

/**
 * Output results:
 * string(10) "EasySwoole"
 */
```

