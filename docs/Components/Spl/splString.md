---
title: SplString
meta:
  - name: description
    content: EasySwoole SplString
  - name: keywords
    content: easyswoole,SplString
---
# SplString

## 用途
用于处理字符串。

## 方法

| 方法名称         | 参数                                                                   | 说明                                        |
|:----------------|:----------------------------------------------------------------------|:-------------------------------------------|
| setString       | string $string                                                        | 设置字符串                                  |
| split           | int $length = 1                                                       | 按长度分割字符串                             |                    
| explode         | string $delimiter                                                     | 按分隔符分割字符串                           |                    
| subString       | int $start, int $length                                               | 截取字符串                                  |                       
| encodingConvert | string $desEncoding, $detectList = ['UTF-8', 'ASCII', 'GBK',...]      | 编码转换                                    |                       
| utf8            |                                                                       | 转成utf                                    |                        
| unicodeToUtf8   |                                                                       | 将unicode编码转成utf-8                      |                       
| toUnicode       |                                                                       | 转成unicode编码(秒)                         |                       
| compare         | string $str, int $ignoreCase = 0                                      | 二进制字符串比较                             |                       
| lTrim           | string $charList = " \t\n\r\0\x0B"                                    | 删除字符串开头的空白字符（或其他字符）         |                      
| rTrim           | string $charList = " \t\n\r\0\x0B"                                    | 删除字符串末端的空白字符（或者其他字符）       |                       
| trim            | string $charList = " \t\n\r\0\x0B"                                    | 去除字符串首尾处的空白字符（或者其他字符）      |                       
| pad             | int $length, string $padString = null, int $pad_type = STR_PAD_RIGHT  | 使用另一个字符串填充字符串为指定长度           |                       
| repeat          | int $times                                                            | 重复一个字符串                              |                       
| length          |                                                                       | 获取字符串长度                              |                       
| upper           |                                                                       | 将字符串转化为大写                           |                       
| lower           |                                                                       | 将字符串转化为小写                           |                       
| stripTags       | string $allowable_tags = null                                         | 从字符串中去除 HTML 和 PHP 标记1             |                       
| replace         | string $find, string $replaceTo                                       | 子字符串替换                                |                       
| between         | string $startStr, string $endStr                                      | 获取指定目标的中间字符串                     |                       
| regex           | $regex, bool $rawReturn = false                                       | 按照正则规则查找字符串                       |                       
| exist           | string $find, bool $ignoreCase = true                                 | 是否存在指定字符串                           |                       
| kebab           |                                                                       | 转换为烤串                                  |                       
| snake           | string $delimiter = '_'                                               | 转为蛇的样子                                |                       
| studly          |                                                                       | 驼峰                                       |                       
| camel           |                                                                       | 小驼峰                                     |                       
| replaceArray    | string $search, array $replace                                        | 依次替换字符串                              |                       
| replaceFirst    | string $search, string $replace                                       | 替换字符串中给定值的第一次出现                |                       
| replaceLast     | string $search, string $replace                                       | 替换字符串中给定值的最后一次出现              |                       
| start           | string $prefix                                                        | 以一个给定值的单一实例开始一个字符串          |                       
| after           | string $search                                                        | 在给定的值之后返回字符串的其余部分            |                       
| before          | string $search                                                        | 在给定的值之前获取字符串的一部分              |                       
| endsWith        | $needles                                                              | 确定给定的字符串是否以给定的子字符串结束       |                       
| startsWith      | $needles                                                              | 确定给定的字符串是否从给定的子字符串开始                                                                 

## 例子

### setString

设置字符串。

* string     $string     数据项索引
```php
function setString( string $string ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(17) "Hello, EasySwoole"
 */

```

### split

设置数组中某项的值。

* int     $length     每一段的长度
```php
function split( int $length = 1 ) : SplArray
```

::: warning 
例子
:::

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
 * 输出结果过：
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

分割字符串

* string     $delimiter     分隔符
```php
function explode( string $delimiter ) : SplArray
```

::: warning 
例子
:::

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
 * 输出结果过：
 * array(2) {
 *   [0]=>
 *   string(5) "Hello"
 *   [1]=>
 *   string(11) " EasySwoole"
 * }
 */

```

### subString

截取字符串

* int     $start     开始位置
* int     $length    截取长度
```php
function subString( int $start, int $length ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(5) "Hello"
 */

```

### encodingConvert

编码转换

* string     $desEncoding     要转换的编码格式
* mixed      $detectList      字符编码列表
```php
function encodingConvert( string $desEncoding, $detectList = ['UTF-8', 'ASCII', 'GBK', 'GB2312', 'LATIN1', 'BIG5', "UCS-2",] ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(17) "Hello, EasySwoole"
 }

 */

```

### utf8

转成utf-8
```php
function utf8() : SplString
```


::: warning 
例子
:::

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
 * 输出结果过：
 * string(17) "Hello, EasySwoole"
 }

 */

```

### unicodeToUtf8

将unicode编码转成utf-8
```php
function unicodeToUtf8() : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(3) "中"
 */

```

### toUnicode

转成unicode编码
```php
function toUnicode() : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(6) "\U4E2D"
 */

```

### compare

二进制字符串比较

* string     $str           要比较的字符串
* int        $ignoreCase    是否需要胡略大小写
```php
function compare( string $str, int $ignoreCase = 0 ) : int
```

::: warning 
例子
:::

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
 * 输出结果过：
 * int(19)
 */

```

### lTrim

删除字符串开头的空白字符（或其他字符）

* string     $charList           删除的字符
```php
function lTrim( string $charList = " \t\n\r\0\x0B" ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "test"
 */

```

### rTrim

删除字符串末端的空白字符（或者其他字符）

* string     $charList           删除的字符
```php
function rTrim( string $charList = " \t\n\r\0\x0B" ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "test"
 */

```

### trim

去除字符串首尾处的空白字符（或者其他字符）

* string     $charList           删除的字符
```php
function trim( string $charList = " \t\n\r\0\x0B" ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "test"
 */

```

### pad

使用另一个字符串填充字符串为指定长度

* int     $length           值为负数，小于或者等于输入字符串的长度，不会发生任何填充
* string  $padString        填充字符串
* int  $pad_type            填充类型
```php
function pad( int $length, string $padString = null, int $pad_type = STR_PAD_RIGHT ) : SplString
```
$pad_type 类型:

* STR_PAD_RIGHT     右边填充
* STR_PAD_LEFT      左边填充
* STR_PAD_BOTH      左右填充


::: warning 
例子
:::

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
 * 输出结果过：
 * string(5) "testg"
 */

```

### repeat

重复一个字符串

* int    $times     重复次数
```php
function repeat( int $times ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(8) "testtest"
 */

```

### length

获取字符串长度
```php
function length() : int
```

::: warning 
例子
:::

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
 * 输出结果过：
 * int(4)
 */

```

### upper

将字符串转化为大写
```php
function upper() : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "TEST"
 */

```

### lower

将字符串转化为小写
```php
function lower() : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "test"
 */

```

### stripTags

从字符串中去除 HTML 和 PHP 标记

* string    $allowable_tags     指定不被去除的字符列表
```php
function stripTags( string $allowable_tags = null ) : SplString
```

::: warning 
例子
:::

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
* 输出结果过：
 * string(4) "test"
 */

```

### replace

子字符串替换

* string    $find           查找的目标值
* string    $replaceTo      替换值
```php
function replace( string $find, string $replaceTo ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "sess"
 */

```

### between

获取指定目标的中间字符串

* string    $startStr       指定目标的开头字符串
* string    $endStr         指定目标的结尾字符串
```php
function between( string $startStr, string $endStr ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "swoo"
 */

```

### regex

按照正则规则查找字符串

* mixed    $regex           正则规则
* bool     $rawReturn       是否返回最初字符串
```php
public function regex( $regex, bool $rawReturn = false )
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(6) "swoole"
 */
```

### exist

是否存在指定字符串

* string    $find           查找字符串
* bool      $ignoreCase     忽略大小写
```php
public function exist( string $find, bool $ignoreCase = true ) : bool
```

::: warning 
例子
:::

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
 * 输出结果过：
 * bool(true)
 */
```

### kebab

转换为烤串
```php
function kebab() : SplString
```

::: warning 
例子
:::

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

转为蛇的样子

* string    $delimiter           分隔符
```php
function snake( string $delimiter = '_' ) : SplString
```

::: warning 
例子
:::

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
 * string(11) "easy_swoole"
 */
```

### studly

驼峰
```php
function studly() : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(10) "EasySwoole"
 */
```

### camel

小驼峰
```php
function camel() : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(10) "easySwoole"
 */
```

### replaceArray

给数组每个元素替换字符串

* string    $search           查找字符串
* array     $replace          替换目标
```php
public function replaceArray( string $search, array $replace ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(9) "as_swoole"
 */
```

### replaceFirst

替换字符串中给定值的第一次出现

* string    $search          查找字符串
* string    $replace         替换字符串
```php
public function replaceFirst( string $search, string $replace ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(14) "as_swoole_easy"
 */
```

### replaceLast

替换字符串中给定值的最后一次出现

* string    $search          查找字符串
* string    $replace         替换字符串
```php
public function replaceLast( string $search, string $replace ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(14) "easy_swoole_as"
 */
```

### start

以一个给定值的单一实例开始一个字符串

* string    $prefix          开头字符串
```php
public function start( string $prefix ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(16) "Hello,EasySwoole"
 */
```

### after

在给定的值之后返回字符串的其余部分

* string    $search       查找字符串  
```php
function after( string $search ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(6) "Swoole"
 */
```

### before

在给定的值之前获取字符串的一部分

* string    $search       查找字符串  
```php
function before( string $search ) : SplString
```

::: warning 
例子
:::

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
 * 输出结果过：
 * string(4) "Easy"
 */
```

### endsWith

确定给定的字符串是否以给定的子字符串结束

* string    $needles        查找字符串  
```php
public function endsWith( $needles ) : bool
```

::: warning 
例子
:::

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
 * 输出结果过：
 * bool(true)
 */
```

### startsWith

确定给定的字符串是否从给定的子字符串开始

* string    $needles        查找字符串  
```php
public function startsWith( $needles ) : bool
```

::: warning 
例子
:::

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
 * 输出结果过：
 * bool(true)
 */
```
