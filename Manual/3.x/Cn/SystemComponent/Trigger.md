# 触发器

触发器是用来主动触发错误或者异常而不中断程序继续执行。

### 用法

触发错误：

- string    `msg`    错误信息                           
- \EasySwoole\Trace\Bean\Location `location`  

```php
public function error($msg, \EasySwoole\Trace\Bean\Location $location = null)
```

触发异常：

- \Throwable    `throwable`    异常                           

public function throwable(\Throwable $throwable)

### [例子](https://github.com/easy-swoole/demo/tree/3.x/CliExample/trigger.php)

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-12-11
 * Time: 上午9:34
 */

require_once __DIR__."/../vendor/autoload.php";

$fruit = ['apple', 'orange', 'banana'];
$l = new \EasySwoole\Trace\Bean\Location();
$l->setFile(__FILE__);
$l->setLine(10);
\EasySwoole\EasySwoole\Trigger::getInstance()->error('Undefined index: key', $l);
\EasySwoole\EasySwoole\Trigger::getInstance()->throwable(new \Exception("hello easyswoole"));
var_dump($fruit);
/**
 * Error at file[/root/develop/demo/CliExample/trigger.php] line[10] message:[Undefined index: key]
 * Exception at file[/root/develop/demo/CliExample/trigger.php] line[16] message:[hello easyswoole]   
 * array(3) {
 *   [0]=>
 *   string(5) "apple"
 *   [1]=>
 *   string(6) "orange"
 *   [2]=>
 *   string(6) "banana"
 * }
 */
```