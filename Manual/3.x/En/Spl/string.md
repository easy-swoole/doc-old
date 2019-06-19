# SplArray

## Purpose
Used to process strings.

## Core Object Method

Core class：EasySwoole\Spl\SplString。

### setString

Set string.

* string     $string     Data Item Index

function setString( string $string ) : SplString

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

$string = new \EasySwoole\Spl\SplString();
var_dump($string->setString('Hello, EasySwoole')->__toString());

/**
 * Output results：
 * string(17) "Hello, EasySwoole"
 */

```

### split

Sets the value of an item in the array.

* int     $length     Length of each segment

function split( int $length = 1 ) : SplArray

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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->split(5)->getArrayCopy());

/**
 * Output results：
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

* string     $delimiter     Delimiter

function explode( string $delimiter ) : SplArray

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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->explode(',')->getArrayCopy());

/**
 * Output results：
 * array(2) {
 *   [0]=>
 *   string(5) "Hello"
 *   [1]=>
 *   string(11) " EasySwoole"
 * }
 */

```

### subString

substr

* int     $start     Beginning position
* int     $length    Interception length

function subString( int $start, int $length ) : SplString

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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->subString(0, 5)->__toString());

/**
 * Output results：
 * string(5) "Hello"
 */

```

### encodingConvert

Coding Conversion

* string     $desEncoding     The encoding format to be converted
* mixed      $detectList      Character encoding list

function encodingConvert( string $desEncoding, $detectList = ['UTF-8', 'ASCII', 'GBK', 'GB2312', 'LATIN1', 'BIG5', "UCS-2",] ) : SplString

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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->encodingConvert('UTF-8')->__toString());

/**
 * Output results：
 * string(17) "Hello, EasySwoole"
 }

 */

```

### utf8

Convert to UTF-8

function utf8() : SplString


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

$string = new \EasySwoole\Spl\SplString('Hello, EasySwoole');
var_dump($string->utf8()->__toString());

/**
 * Output results：
 * string(17) "Hello, EasySwoole"
 }

 */

```

### unicodeToUtf8

Converting Unicode encoding to UTF-8

function unicodeToUtf8() : SplString

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

$str = '\u4e2d';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->unicodeToUtf8()->__toString());

/**
 * Output results：
 * string(3) "中"
 */

```

### toUnicode

Convert to unicode encoding

function toUnicode() : SplString

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

$str = '中';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->toUnicode()->__toString());

/**
 * Output results：
 * string(6) "\U4E2D"
 */

```

### compare

Binary string comparison

* string     $str           Strings to compare
* int        $ignoreCase    Do you need sketchy capitalization?

function compare( string $str, int $ignoreCase = 0 ) : int

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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->compare('apple'));

/**
 * Output results：
 * int(19)
 */

```

### lTrim

Delete blank characters (or other characters) at the beginning of a string

* string     $charList           Deleted characters

function lTrim( string $charList = " \t\n\r\0\x0B" ) : SplString

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

$str = '  test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->lTrim()->__toString());

/**
 * Output results：
 * string(4) "test"
 */

```

### rTrim

Delete blank characters (or other characters) at the end of a string

* string     $charList           Deleted characters

function rTrim( string $charList = " \t\n\r\0\x0B" ) : SplString

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

$str = 'test  ';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->rTrim()->__toString());

/**
 * Output results：
 * string(4) "test"
 */

```

### trim

Remove blank characters (or other characters) at the beginning and end of a string

* string     $charList           Deleted characters

function trim( string $charList = " \t\n\r\0\x0B" ) : SplString

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

$str = '  test  ';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->trim()->__toString());

/**
 * Output results：
 * string(4) "test"
 */

```

### pad

Fill the string with another string for the specified length

* int     $length           The value is negative, less than or equal to the length of the input string, and no filling occurs.
* string  $padString        Fill in strings
* int  $pad_type            Filling type

function pad( int $length, string $padString = null, int $pad_type = STR_PAD_RIGHT ) : SplString

$pad_type type:

* STR_PAD_RIGHT     Right Fill
* STR_PAD_LEFT      Left File
* STR_PAD_BOTH      Left and right filling

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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->pad(5, 'game')->__toString());

/**
 * Output results：
 * string(5) "testg"
 */

```

### repeat

Repeat a string

* int    $times     Repetition times

function repeat( int $times ) : SplString

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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->repeat(2)->__toString());

/**
 * Output results：
 * string(8) "testtest"
 */

```

### length

Get string length

function length() : int

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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->length());

/**
 * Output results：
 * int(4)
 */

```

### upper

Converting strings to uppercase

function upper() : SplString

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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->upper()->__toString());

/**
 * Output results：
 * string(4) "TEST"
 */

```

### lower

Converting strings to lowercase

function lower() : SplString

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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->lower()->__toString());

/**
 * Output results：
 * string(4) "test"
 */

```

### stripTags

Remove HTML and PHP tags from strings

* string    $allowable_tags     Specifies a list of characters that are not removed

function stripTags( string $allowable_tags = null ) : SplString

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

$str = '<a>test</a>';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->stripTags()->__toString());

/**
* Output results：
 * string(4) "test"
 */

```

### replace

Substring substitution

* string    $find           Find the target value
* string    $replaceTo      Replacement value

function replace( string $find, string $replaceTo ) : SplString

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

$str = 'test';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replace('t', 's')->__toString());

/**
 * Output results：
 * string(4) "sess"
 */

```

### between

Gets the intermediate string of the specified target

* string    $startStr       The opening string of the specified target
* string    $endStr         End string of specified target

function between( string $startStr, string $endStr ) : SplString

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

$str = 'easyswoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->between('easy', 'le')->__toString());

/**
 * Output results：
 * string(4) "swoo"
 */

```

### regex

Find strings according to regular rules

* mixed    $regex           regularity
* bool     $rawReturn       Whether to return the original string

public function regex( $regex, bool $rawReturn = false )

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

$str = 'easyswoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->regex('/swoole/'));

/**
 * Output results：
 * string(6) "swoole"
 */
```

### exist

Is there a specified string

* string    $find           Find strings
* bool      $ignoreCase     ignore case

public function exist( string $find, bool $ignoreCase = true ) : bool

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

$str = 'easyswoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->exist('Swoole', true));

/**
 * Output results：
 * bool(true)
 */
```

### kebab

转换为烤串(这句翻译待定)

function kebab() : SplString

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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->kebab()->__toString());

/**
 * 输出结果过：
 * string(11) "easy-swoole"
 */
```

### snake

Turn into a snake

* string    $delimiter           Delimiter

function snake( string $delimiter = '_' ) : SplString

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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->kebab()->__toString());

/**
 * Output results：
 * string(11) "easy_swoole"
 */
```

### studly

hump

function studly() : SplString

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

$str = 'easy_swoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->studly()->__toString());

/**
 * Output results：
 * string(10) "EasySwoole"
 */
```

### camel

hump

function camel() : SplString

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

$str = 'easy_swoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->camel()->__toString());

/**
 * Output results：
 * string(10) "EasySwoole"
 */
```

### replaceArray

Replace each element of an array with a string

* string    $search           Find strings
* array     $replace          Replacement target

public function replaceArray( string $search, array $replace ) : SplString

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

$str = 'easy_swoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replaceArray('easy', ['as', 'bs', 'cs'])->__toString());

/**
 * Output results：
 * string(9) "as_swoole"
 */
```

### replaceFirst

The first occurrence of a given value in a substitution string

* string    $search          Find strings
* string    $replace         Replace strings

public function replaceFirst( string $search, string $replace ) : SplString

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

$str = 'easy_swoole_easy';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replaceFirst('easy', 'as')->__toString());

/**
 * Output results：
 * string(14) "as_swoole_easy"
 */
```

### replaceLast

The last occurrence of a given value in a replacement string

* string    $search          Fins strings
* string    $replace         Replace strings

public function replaceLast( string $search, string $replace ) : SplString

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

$str = 'easy_swoole_easy';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->replaceLast('easy', 'as')->__toString());

/**
 * Output results：
 * string(14) "easy_swoole_as"
 */
```

### start

Start a string with a single instance of a given value

* string    $prefix          Beginning string

public function start( string $prefix ) : SplString

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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->start('Hello,')->__toString());

/**
 * Output results：
 * string(16) "Hello,EasySwoole"
 */
```

### after

Returns the rest of the string after a given value

* string    $search       Find strings  

function after( string $search ) : SplString

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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->after('Easy')->__toString());

/**
 * Output results：
 * string(6) "Swoole"
 */
```

### before

Get a part of the string before a given value

* string    $search       查找字符串  

function before( string $search ) : SplString

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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->before('Swoole')->__toString());

/**
 * Output results：
 * string(4) "Easy"
 */
```

### endsWith

Determines whether a given string ends with a given substring

* string    $needles        Find strings

public function endsWith( $needles ) : bool

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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->endsWith('Swoole'));

/**
 * Output results：
 * bool(true)
 */
```

### startsWith

Determines whether a given string begins with a given substring

* string    $needles        Find strings  

public function startsWith( $needles ) : bool

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

$str = 'EasySwoole';
$string = new \EasySwoole\Spl\SplString($str);
var_dump($string->startsWith('Easy'));

/**
 * Output results：
 * bool(true)
 */
```