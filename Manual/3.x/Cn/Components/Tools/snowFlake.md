# 雪花算法

## 用途
生成唯一编号

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

$str = \EasySwoole\Utility\SnowFlake::make(1,1);//传入数据中心id(0-31),任务进程id(0-31)
var_dump($str);
var_dump(\EasySwoole\Utility\SnowFlake::unmake($str));

/**
 * 输出结果:
 * int(194470364728922112)
 * object(stdClass)#3 (4) {
 *   ["timestamp"]=>
 *   int(1532127766018)
 *   ["dataCenterID"]=>
 *   int(1)
 *   ["workerID"]=>
 *   int(1)
 *   ["sequence"]=>
 *   int(0)
 * }
 */

```

## 核心对象方法

核心类：EasySwoole\Utility\SnowFlake

### make

生成基于雪花算法的随机编号

* mixed     $dataCenterID       数据中心
* mixed     $workerID           任务进程I

static function make($dataCenterID = 0, $workerID = 0)

### unmake

反向解析雪花算法生成的编号

* mixed     $snowFlakeId        编号

static function unmake($snowFlakeId)