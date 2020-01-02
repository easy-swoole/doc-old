---
title: SplFileStream
meta:
  - name: description
    content: EasySwoole SplFileStream
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole,SplFileStream
---
# SplFileStream

## Use
File resource stream data operation

## How to operate

| Method Name       | Parameters            | Description                      |
|:------------------|:----------------------|:---------------------------------|
| __construct       | $file,$mode = 'c+'    | Initialize resources and read and write operations |
| lock              | $mode = LOCK_EX       | File Lock         |
| unlock            | $mode = LOCK_UN       | Release Lock      |                                                                                                 

::: warning 
The SplFileStream class inherits SplStream, and other related methods refer to [SplStream](./splStream.md)。
:::


## example

### __construct

Initialize resources and read and write operations

* mixed $file file
* mixed $mode read and write operation type

```php
function __construct($file,$mode = 'c+')
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 上午10:25
 */

require_once 'vendor/autoload.php';

$fileStream = new \EasySwoole\Spl\SplFileStream('./test.txt');
$type = $fileStream->getMetadata('stream_type');
var_dump($type);

/**
 * The output is over:
 * string(5) "STDIO"
 */

```

### lock

File lock

* mixed $mode lock type

Lock type:

* LOCK_SH gets shared lock (read program)
* LOCK_EX gets exclusive lock (written program)
* LOCK_UN release lock (whether shared or exclusive)
```php
function lock($mode = LOCK_EX)
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 上午10:25
 */

require_once 'vendor/autoload.php';

$fileStream = new \EasySwoole\Spl\SplFileStream('./test.txt');
$lock = $fileStream->lock();
var_dump($lock);

/**
 * The output is over:
 * bool(true)
 */

```

### unlock

Release lock

* mixed     $mode       Lock type
```php
function unlock($mode = LOCK_UN)
```

::: warning 
example
:::

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 19-7-2
 * Time: 上午10:25
 */

require_once 'vendor/autoload.php';

$fileStream = new \EasySwoole\Spl\SplFileStream('./test.txt');
$unlock = $fileStream->unlock();
var_dump($unlock);

/**
 * The output is over:
 * bool(true)
 */

```
