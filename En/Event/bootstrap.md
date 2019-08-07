# Bootstrap event

Bootstrap allows other initialization services before the framework is initialized
This event was added after version 3.2.5. The default implementation is to start the script in easyswoole:
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

If you are upgrading the old version to the new version, you need to delete the `easyswoole` file and reinstall `php ./vendor/easyswoole/easyswoole/bin/easyswoole install`.
You can use bootstrap events
