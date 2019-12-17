---
title: Random
meta:
  - name: description
    content: Used to generate random verification codes, random strings, and more.
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Component Library|Miscellaneous Tools|Random
---

# Random


## Use

Used to generate random verification codes, random strings, etc.



## Core Object Class

To implement this component function you need to load the core class:

```php
EasySwoole\Utility\Random
```



## Core Object Method

#### Character

Strings are randomly generated:

- int $length generation length
- string $alphabet custom generated character set

```php
static function character($length = 6, $alphabet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789')
```



#### Number

Pure numeric strings are randomly generated:

- int $length generation length

```php
Static function number(length = 6)
```



#### ArrayRandOne

Generate an individual randomly from the collection:

- array $length array collection

```php
Static function arrayRandOne(array $data)
```



## How to use

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-1-9
 * Time: 10:10
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

