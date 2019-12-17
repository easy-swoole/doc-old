---
title: bootstrap事件
meta:
  - name: description
    content: bootstrap事件
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole|swoole|bootstrap事件
---
# bootstrapEvent

Bootstrap allows other businesses to be initialized before the framework is initialized

This event was added after ```version 3.2.5```

In the easyswoole startup script file that is generated after installation:

The ```bootstrap.php``` file in the application root directory will be automatically determined，If there is，Load。

So we can create this file in the application root directory and execute the initialization business code we want：Such as register command line support, global general functions and other functions。

```php
<?php

use EasySwoole\EasySwoole\Command\CommandRunner;

defined('IN_PHAR') or define('IN_PHAR', boolval(\Phar::running(false)));
defined('RUNNING_ROOT') or define('RUNNING_ROOT', realpath(getcwd()));
defined('EASYSWOOLE_ROOT') or define('EASYSWOOLE_ROOT', IN_PHAR ? \Phar::running() : realpath(getcwd()));

$file = EASYSWOOLE_ROOT.'/vendor/autoload.php';
if (file_exists($file)) {
    require $file;
}else{
    die("include composer autoload.php fail\n");
}

if(file_exists(EASYSWOOLE_ROOT.'/bootstrap.php')){
    require_once EASYSWOOLE_ROOT.'/bootstrap.php';
}

$args = $argv;
//trim first command
array_shift($args);
$ret = CommandRunner::getInstance()->run($args);
if(!empty($ret)){
    echo $ret."\n";
}
```

::: warning
f you are an old swoole upgrade, you will need to delete the '/easyswoole' file.

Then again ` PHP/vendor/easyswoole/easyswoole/bin/easyswoole install ` installation(Report errors or other reasons.Please review the framework installation section to perform the installation steps)

can use the bootstrap event
:::

## Call the coroutine API before starting
```php
use Swoole\Coroutine\Scheduler;
$scheduler = new Scheduler();
$scheduler->add(function() {
    /*  Call the coroutine API */
});
$scheduler->start();
//Clear all timers
\Swoole\Timer::clearAll();
```
