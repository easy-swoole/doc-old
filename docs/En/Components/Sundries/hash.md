---
title: Hash
meta:
  - name: description
    content: Used to quickly process hash passwords and data integrity check scenarios.
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Component Library|Miscellaneous Tools|Hash
---

# Hash



## Use

Used to quickly process hash passwords and data integrity check scenarios



## Core Object Class

To implement this component function you need to load the core class:

```php
EasySwoole\Utility\Hash
```



## Core Object Method



#### makePasswordHash

Produce a hash from a plaintext value

- mixed $value needs to produce the original text of the hash
- mixed $cost recursive layers

```php
Static function makePasswordHash($value, $cost = 10)
```



#### validatePasswordHash

Check if the plaintext value matches the hash

- mixed $value
- mixed $cost hash encrypted
```php
static function validatePasswordHash($value, $hashValue)
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

$password = 123456;
$hash = \EasySwoole\Utility\Hash::makePasswordHash($password);
var_dump($hash);
var_dump(\EasySwoole\Utility\Hash::validatePasswordHash($password, $hash));

/**
 * Output results:
 * string(60) "$2y$10$ESx0z8TGSJpMI3Hgr6nJJOdbretS2TBqv4d5L0XjlTkSjSiCiq/f6"
 * bool(true) 
 */
```

