---
title: Custom command
meta:
  - name: description
    content: EasySwoole Custom command implementation
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole Custom command|swoole framework|swoole Timing task|php timing
---

# Custom command
EasySwoole has five default commands:  
````
php easyswoole help  Command assistance
php easyswoole install (Need to be in./vendor/easyswoole/easyswoole/bin/easyswoole file calls)
php easyswoole start  
php easyswoole stop   (need daemons)
php easyswoole reload  warm restart(need daemons)
````

::: warning 
Default command details can be viewed[service management](../Introduction/server.md)
:::

## Define the command

Through the implementation of ```EasySwoole EasySwoole\Command\CommandInterface```interface, you can customize the Command:

````php
<?php
public function commandName():string;
public function exec(array $args):?string ;
public function help(array $args):?string ;
````

Create new file App/Command/Test.php:

````php
<?php
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
        //Print parameters and test values
        var_dump($args);
        echo 'test'.PHP_EOL;
        return null;
    }

    public function help(array $args): ?string
    {
        //return logo
        $logo = Utility::easySwooleLog();
        return $logo."this is test";
    }
}
````

## Injection the command

::: tip
check [boostrap event](../Core/event/bootstrap.md)
:::

Added`/bootstrap.php` File:

````php
<?php

\EasySwoole\EasySwoole\Command\CommandContainer::getInstance()->set(new \App\Command\Test());
````

::: warning 
 Bootstrap is a new 3.2.5 event that allows users to execute custom events before the framework is initialized.
:::

## Execute the command
````

php easyswoole test
array(0) {
}
test


php easyswoole test 123 456
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
this is test
        
````
