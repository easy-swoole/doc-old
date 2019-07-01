# Random

## 用途
用于生成随机验证码,随机字符串等等

## 如何使用

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
 * 输出结果:
 * string(6) "W94ohx"
 * string(6) "986543"
 * string(3) "two"
 */

```

## 核心对象方法

核心类：EasySwoole\Utility\Random

### character

字符串随机生成：

- int       $length     生成长度
- string    $alphabet   自定义生成字符集

```php
static function character($length = 6, $alphabet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789')
```

### number

纯数字字符串随机生成：

- int       $length     生成长度

```php
static function number(length = 6)
```

### arrayRandOne

从集合里面随机产生一个个体：

- array       $length     数组集合

static function arrayRandOne(array $data)
