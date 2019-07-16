# Custom commands
EasySwoole has five default commands:  
````text
php easyswoole help  Command Help
php easyswoole install Installation (called in. /vendor/easyswoole/easyswoole/bin/easyswoole file)
php easyswoole start  Start
php easyswoole stop   Stop(Need to guard the process)
php easyswoole reload  Hot restart(Need to guard the process)
````
> Details of default commands are available[Service management](../Introduction/server.md)
## Define commands
By implementing `EasySwoole\EasySwoole\Command\CommandInterface` interface, you can customize commands
````php
public function commandName():string;
public function exec(array $args):?string ;
public function help(array $args):?string ;
````
New create App/Command/Test.php:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/7/8 0008
 * Time: 13:43
 */
namespace App\Command;

use EasySwoole\EasySwoole\Command\CommandInterface;
use EasySwoole\EasySwoole\Command\Utility;


class Test implements CommandInterface
{
    public function commandName(): string
    {
        return 'test';
    }

    public function exec(array $args): ?string
    {
        //Print parameters, print test values
        var_dump($args);
        echo 'test'.PHP_EOL;
        return null;
    }

    public function help(array $args): ?string
    {
        //echo logo
        $logo = Utility::easySwooleLog();
        return $logo.<<<HELP_START
        This is test.
        
HELP_START;
    }
}
````

## Injection command
New add `/bootstrap.php` file:
````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/7/8 0008
 * Time: 13:48
 */
\EasySwoole\EasySwoole\Command\CommandContainer::getInstance()->set(new \App\Command\Test());
````
> Bootstrap is a new event in 3.2.5 that allows users to execute custom events before the framework is initialized

## Execution of command
````text

[root@localhost easyswoole-test]# php easyswoole test
array(0) {
}
test
[root@localhost easyswoole-test]# php easyswoole test 123 456
array(2) {
  [0]=>
  string(3) "123"
  [1]=>
  string(3) "456"
}
test
[root@localhost easyswoole-test]# php easyswoole help test
  ______                          _____                              _
 |  ____|                        / ____|                            | |
 | |__      __ _   ___   _   _  | (___   __      __   ___     ___   | |   ___
 |  __|    / _` | / __| | | | |  \___ \  \ \ /\ / /  / _ \   / _ \  | |  / _ \
 | |____  | (_| | \__ \ | |_| |  ____) |  \ V  V /  | (_) | | (_) | | | |  __/
 |______|  \__,_| |___/  \__, | |_____/    \_/\_/    \___/   \___/  |_|  \___|
                          __/ |
                         |___/
        This is test
        
````
