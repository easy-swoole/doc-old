---
title: bootstrap事件
meta:
  - name: description
    content: bootstrap事件
  - name: keywords
    content: EasySwoole,bootstrap事件
---
# bootstrap事件

bootstrap 允许在 框架未初始化之前,允许其他初始化业务

该事件是在`3.2.5版本之后`新增

在安装之后产生的easyswoole启动脚本文件中：

将会自动判断应用根目录下是否有`bootstrap.php`文件，如果有则加载。

所以我们可以在应用根目录下创建该文件，并执行自己想要的初始化业务代码：如注册命令行支持、全局通用函数等功能。

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
如果你是旧版升级新版,需要删除`/easyswoole` 文件

然后重新`php ./vendor/easyswoole/easyswoole/bin/easyswoole install` 安装(报错或者其他原因请重新看框架安装章节 执行安装步骤)

即可使用bootstrap事件
:::
