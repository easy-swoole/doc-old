# Hash

## Purpose
Scenarios for fast hash cryptography and data integrity checking

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

## Core object method

Core class：EasySwoole\Utility\Hash

### makePasswordHash

Producing Hash from a Clear Value

* mixed    $value        Need to produce hash text
* mixed    $cost         Number of recursive layers

static function makePasswordHash($value, $cost = 10)

### validatePasswordHash

Check whether plaintext value matches hash

* mixed    $value        Original text
* mixed    $cost         Hash Encrypted Text

static function validatePasswordHash($value, $hashValue)