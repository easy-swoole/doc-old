---
title: SplFileStream
meta:
  - name: description
    content: EasySwoole SplFileStream
  - name: keywords
    content: easyswoole,SplFileStream
---
# SplFileStream

## 用途
文件资源流数据操作

## 操作方法

| 方法名称           | 参数                          | 说明                              |
|:------------------|:------------------------------|:---------------------------------|
| __construct       | $file,$mode = 'c+'            | 初始化资源和读写操作               |
| lock              | $mode = LOCK_EX               | 文件锁定                          |                    
| unlock            | $mode = LOCK_UN               | 释放锁定                          |                                                                                                   


## 例子

### __construct

初始化资源和读写操作

* mixed     $file       文件
* mixed     $mode       读写操作类型

```php
function __construct($file,$mode = 'c+')
```

::: warning 
例子
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
 * 输出结果过：
 * string(5) "STDIO"
 */

```

### lock

文件锁定

* mixed     $mode       锁定类型

锁定类型:

* LOCK_SH  取得共享锁定（读取的程序）
* LOCK_EX  取得独占锁定（写入的程序）
* LOCK_UN  释放锁定（无论共享或独占）
```php
function lock($mode = LOCK_EX)
```

::: warning 
例子
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
 * 输出结果过：
 * bool(true)
 */

```

### unlock

释放锁定

* mixed     $mode       锁定类型
```php
function unlock($mode = LOCK_UN)
```

::: warning 
例子
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
 * 输出结果过：
 * bool(true)
 */

```