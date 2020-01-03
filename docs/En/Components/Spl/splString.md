---
title: SplString
meta:
  - name: description
    content: EasySwoole SplString
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole,SplString
---
# SplString

## Use
Used to process strings.

## Method

| Method name         | parameter                        | Description             |
|:----------------|:---------------------------|:----------------------------------|
| setString       | string $string              | Set string                       |
| split           | int $length = 1             | Split a string by length         |
| explode         | string $delimiter           | Split a string by separator      |
| subString       | int $start, int $length     | Intercept string                 |
| encodingConvert | string $desEncoding, $detectList = ['UTF-8', 'ASCII', 'GBK',...] | Code conversion  |
| utf8            |                             | Convert to utf                          |    
| unicodeToUtf8   |                             | Convert unicode encoding to utf-8            |
| toUnicode       |                             | Convert to unicode encoding (seconds)              |
| compare         | string $str, int $ignoreCase = 0       | Binary string comparison        |
| lTrim           | string $charList = " \t\n\r\0\x0B"     | Delete whitespace characters (or other characters) at the beginning of the string     |
| rTrim           | string $charList = " \t\n\r\0\x0B"     | Delete whitespace characters (or other characters) at the end of the string   |
| trim            | string $charList = " \t\n\r\0\x0B"     | Remove whitespace characters (or other characters) at the beginning and end of the string  |
| pad             | int $length, string $padString = null, int $pad_type = STR_PAD_RIGHT  | Fill the string to the specified length with another string           |                       
| repeat          | int $times                                                            | Repeat a string|
| length          |                                                                       | Get the length of the string      |                       
| upper           |                                                                       | Convert a string to uppercase    |
| lower           |                                                                       | Convert a string to lowercase    |                       
| stripTags       | string $allowable_tags = null                                         | Remove HTML and PHP tags from strings            |                       
| replace         | string $find, string $replaceTo                                       | Substring replacement     |
| between         | string $startStr, string $endStr                                      | Get the intermediate string of the specified target                     |
| regex           | $regex, bool $rawReturn = false                                       | Find strings according to regular rules                       |
| exist           | string $find, bool $ignoreCase = true                                 | Whether the specified string exists     |
| kebab           |                                                                       | Convert to skewers                      |
| snake           | string $delimiter = '_'                                               | Turn into a snake                       |
| studly          |                                                                       | hump                                    |
| camel           |                                                                       | Small hump                              |
| replaceArray    | string $search, array $replace                                        | Replace the string in turn              |
| replaceFirst    | string $search, string $replace                                       | Replace the first occurrence of the given value in the string       |                       
| replaceLast     | string $search, string $replace                                       | Replace the last occurrence of the given value in the string              |                       
| start           | string $prefix                                                        | Start a string with a single instance of a given value          |                       
| after           | string $search                                                        | Returns the rest of the string after the given value            |                       
| before          | string $search                                                        | Get a part of the string before the given value              |                       
| endsWith        | $needles                                                              | Determines if the given string ends with the given substring       |                       
| startsWith      | $needles                                                              | Determine if the given string starts with the given substring  | 

## Example

### setString

Set the string.

* `string $string` Data item index
```php
function setString( string $string ) : SplString
```

::: warning 
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

$string = new \EasySwoole\Spl\SplString();
var_dump($string->setString('Hello, EasySwoole')->__toString());

/**
 * The output is over:
 * string(17) "Hello, EasySwoole"
 */

```

### split

Sets the value of an item in the array.

* `int $length` Length of each segment
```php
function split( int $length = 1 ) : SplArray
```

::: warning 
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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->split(5)->getArrayCopy());

/**
 * The output is over:
 * array(4) {
 *   [0]=>
 *   string(5) "Hello"
 *   [1]=>
 *   string(5) ", Eas"
 *   [2]=>
 *   string(5) "ySwoo"
 *   [3]=>
 *   string(2) "le"
 * }
 */

```

### explode

Split string

* `string $delimiter` separator
```php
function explode( string $delimiter ) : SplArray
```

::: warning 
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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->explode(',')->getArrayCopy());

/**
 * The output is over:
 * array(2) {
 *   [0]=>
 *   string(5) "Hello"
 *   [1]=>
 *   string(11) " EasySwoole"
 * }
 */

```

### subString

Intercept string

* `int $start` Starting position
* `int $length` Intercept length
```php
function subString( int $start, int $length ) : SplString
```

::: warning 
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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->subString(0, 5)->__toString());

/**
 * The output is over:
 * string(5) "Hello"
 */

```

### encodingConvert

Code conversion

* `string $desEncoding` The encoding format to be converted
* `mixed $detectList` Character encoding list
```php
function encodingConvert( string $desEncoding, $detectList = ['UTF-8', 'ASCII', 'GBK', 'GB2312', 'LATIN1', 'BIG5', "UCS-2",] ) : SplString
```

::: warning 
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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->encodingConvert('UTF-8')->__toString());

/**
 * The output is over:
 * string(17) "Hello, EasySwoole"
 }

 */

```

### utf8

Convert to utf-8
```php
function utf8() : SplString
```


::: warning 
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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->utf8()->__toString());

/**
 * The output is over:
 * string(17) "Hello, EasySwoole"
 }

 */

```

### unicodeToUtf8

Convert unicode encoding to utf-8
```php
function unicodeToUtf8() : SplString
```

::: warning 
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

$str = '\u4e2d';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->unicodeToUtf8()->__toString());

/**
 * The output is over:
 * string(3) "中"
 */

```

### toUnicode

Convert to unicode encoding
```php
function toUnicode() : SplString
```

::: warning 
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

$str = '中';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->toUnicode()->__toString());

/**
 * The output is over:
 * string(6) "\U4E2D"
 */

```

### compare

Binary string comparison

* `string $str` The string to be compared
* `int $ignoreCase` Need to be slightly different
```php
function compare( string $str, int $ignoreCase = 0 ) : int
```

::: warning 
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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->compare('apple'));

/**
 * The output is over:
 * int(19)
 */

```

### lTrim

Delete whitespace characters (or other characters) at the beginning of the string

* `string $charList` Deleted characters
```php
function lTrim( string $charList = " \t\n\r\0\x0B" ) : SplString
```

::: warning 
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

$str = '  test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->lTrim()->__toString());

/**
 * The output is over:
 * string(4) "test"
 */

```

### rTrim

Delete whitespace characters (or other characters) at the end of the string

* `string $charList` Deleted characters
```php
function rTrim( string $charList = " \t\n\r\0\x0B" ) : SplString
```

::: warning 
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

$str = 'test  ';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->rTrim()->__toString());

/**
 * The output is over:
 * string(4) "test"
 */

```

### trim

Remove whitespace characters (or other characters) at the beginning and end of the string

* `string     $charList`           Deleted characters
```php
function trim( string $charList = " \t\n\r\0\x0B" ) : SplString
```

::: warning 
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

$str = '  test  ';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->trim()->__toString());

/**
 * The output is over:
 * string(4) "test"
 */

```

### pad

Fill the string to the specified length with another string

* `int $length`         Value is negative, less than or equal to the length of the input string, no padding will occur
* `string $padString`   Fills the string
* `int $pad_type`       Fill type
```php
function pad( int $length, string $padString = null, int $pad_type = STR_PAD_RIGHT ) : SplString
```
$pad_type type:

* `STR_PAD_RIGHT`     Right padding
* `STR_PAD_LEFT`      Left padding
* `STR_PAD_BOTH`      Left and right padding


::: warning 
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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->pad(5, 'game')->__toString());

/**
 * The output is over:
 * string(5) "testg"
 */

```

### repeat

Repeat a string

* `int    $times`     repeat times
```php
function repeat( int $times ) : SplString
```

::: warning 
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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->repeat(2)->__toString());

/**
 * The output is over:
 * string(8) "testtest"
 */

```

### length

Get the length of the string
```php
function length() : int
```

::: warning 
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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->length());

/**
 * The output is over:
 * int(4)
 */

```

### upper

Convert a string to uppercase
```php
function upper() : SplString
```

::: warning 
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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->upper()->__toString());

/**
 * The output is over:
 * string(4) "TEST"
 */

```

### lower

Convert a string to lowercase
```php
function lower() : SplString
```

::: warning 
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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->lower()->__toString());

/**
 * The output is over:
 * string(4) "test"
 */

```

### stripTags

Remove HTML and PHP tags from strings

* `string    $allowable_tags`     Specify a list of characters that are not removed
```php
function stripTags( string $allowable_tags = null ) : SplString
```

::: warning 
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

$str = '<a>test</a>';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->stripTags()->__toString());

/**
* The output is over:
 * string(4) "test"
 */

```

### replace

Substring replacement

* `string    $find`           Target value of lookup
* `string    $replaceTo`      Replacement value
```php
function replace( string $find, string $replaceTo ) : SplString
```

::: warning 
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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replace('t', 's')->__toString());

/**
 * The output is over:
 * string(4) "sess"
 */

```

### between

Get the intermediate string of the specified target

* `string    $startStr`       Specify the starting string of the target
* `string    $endStr`         Specify the end string of the target
```php
function between( string $startStr, string $endStr ) : SplString
```

::: warning 
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

$str = 'easyswoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->between('easy', 'le')->__toString());

/**
 * The output is over:
 * string(4) "swoo"
 */

```

### regex

Find strings according to regular rules

* `mixed    $regex`           Regular rule
* `bool     $rawReturn`       Whether to return the original string
```php
public function regex( $regex, bool $rawReturn = false )
```

::: warning 
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

$str = 'easyswoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->regex('/swoole/'));

/**
 * The output is over:
 * string(6) "swoole"
 */
```

### exist

Whether the specified string exists

* `string    $find`           Find string
* `bool      $ignoreCase`     Ignore case
```php
public function exist( string $find, bool $ignoreCase = true ) : bool
```

::: warning 
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

$str = 'easyswoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->exist('Swoole', true));

/**
 * The output is over:
 * bool(true)
 */
```

### kebab

Convert to skewers
```php
function kebab() : SplString
```

::: warning 
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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->kebab()->__toString());

/**
 * The output is over:
 * string(11) "easy-swoole"
 */
```

### snake

Turn into a snake

* `string    $delimiter`           Separator
```php
function snake( string $delimiter = '_' ) : SplString
```

::: warning 
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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->kebab()->__toString());

/**
 * The output is over:
 * string(11) "easy_swoole"
 */
```

### studly

Hump
```php
function studly() : SplString
```

::: warning 
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

$str = 'easy_swoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->studly()->__toString());

/**
 * The output is over:
 * string(10) "EasySwoole"
 */
```

### camel

Small hump
```php
function camel() : SplString
```

::: warning 
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

$str = 'easy_swoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->camel()->__toString());

/**
 * The output is over:
 * string(10) "easySwoole"
 */
```

### replaceArray

Replace the string for each element of the array

* `string    $search`           Find string
* `array     $replace`          Replacement target
```php
public function replaceArray( string $search, array $replace ) : SplString
```

::: warning 
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

$str = 'easy_swoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replaceArray('easy', ['as', 'bs', 'cs'])->__toString());

/**
 * The output is over:
 * string(9) "as_swoole"
 */
```

### replaceFirst

Replace the first occurrence of the given value in the string

* `string    $search`          Find string
* `string    $replace`         Replace string
```php
public function replaceFirst( string $search, string $replace ) : SplString
```

::: warning 
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

$str = 'easy_swoole_easy';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replaceFirst('easy', 'as')->__toString());

/**
 * The output is over:
 * string(14) "as_swoole_easy"
 */
```

### replaceLast

Replace the last occurrence of the given value in the string

* `string    $search`          Find string
* `string    $replace`         Replace string
```php
public function replaceLast( string $search, string $replace ) : SplString
```

::: warning 
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

$str = 'easy_swoole_easy';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replaceLast('easy', 'as')->__toString());

/**
 * The output is over:
 * string(14) "easy_swoole_as"
 */
```

### start

Start a string with a single instance of a given value

* `string    $prefix`          Opening string
```php
public function start( string $prefix ) : SplString
```

::: warning 
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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->start('Hello,')->__toString());

/**
 * The output is over:
 * string(16) "Hello,EasySwoole"
 */
```

### after

Returns the rest of the string after the given value

* `string    $search`       Find string  
```php
function after( string $search ) : SplString
```

::: warning 
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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->after('Easy')->__toString());

/**
 * The output is over:
 * string(6) "Swoole"
 */
```

### before

Get a part of the string before the given value

* `string    $search`       Find string  
```php
function before( string $search ) : SplString
```

::: warning 
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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->before('Swoole')->__toString());

/**
 * The output is over:
 * string(4) "Easy"
 */
```

### endsWith

Determines if the given string ends with the given substring

* `string    $needles`        Find string  
```php
public function endsWith( $needles ) : bool
```

::: warning 
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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->endsWith('Swoole'));

/**
 * The output is over:
 * bool(true)
 */
```

### startsWith

Determine if the given string starts with the given substring

* `string    $needles`        Find string  
```php
public function startsWith( $needles ) : bool
```

::: warning 
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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->startsWith('Easy'));

/**
 * The output is over:
 * bool(true)
 */
```
