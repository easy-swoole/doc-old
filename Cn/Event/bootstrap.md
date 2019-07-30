# bootstrap事件

bootstrap 允许在 框架未初始化之前,允许其他初始化业务
该事件是在3.2.5版本之后,新增的事件,默认实现在easyswoole启动脚本:
````php
#!/usr/bin/env php
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
````

如果你是旧版升级新版,需要删除`/easyswoole` 文件,然后重新`php ./vendor/easyswoole/easyswoole/bin/easyswoole install`安装
即可使用bootstrap事件

