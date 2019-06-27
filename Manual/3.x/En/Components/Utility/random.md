# Random

 ## Purpose
Used to generate random validation codes, random strings, etc.

 ## How to use it

 ```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 上午10:10
 */
 require './vendor/autoload.php';
 var_dump(\EasySwoole\Utility\Random::character());
var_dump(\EasySwoole\Utility\Random::number());
var_dump(\EasySwoole\Utility\Random::arrayRandOne(['one', 'two', 'three']));
 /**
 * Output results:
 * string(6) "W94ohx"
 * string(6) "986543"
 * string(3) "two"
 */
 ```

 ## Core object method

 Core class：EasySwoole\Utility\Random

 ### character

 Random String Generation：

 - int       $length     Generation length
- string    $alphabet   Custom Generated Character Set

 ```php
static function character($length = 6, $alphabet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789')
```

 ### number

 Random Generation of Pure Digital Strings：

 - int       $length     Generation length

 ```php
static function number(length = 6)
```

 ### arrayRandOne

 Random generation of an individual from a set：

 - array       $length     Array set

 static function arrayRandOne(array $data)