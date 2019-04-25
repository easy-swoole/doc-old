## Custom Command
Custom commands need to implement 3 methods of the `EasySwoole\Console\ModuleInterface` interface
### Creating a controller
Create a new file `App\Console\TestConsole.php`

````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/11 0011
 * Time: 11:41
 */

Namespace App\console;


Use EasySwoole\Console\ModuleInterface;
Use EasySwoole\Socket\Bean\Caller;
Use EasySwoole\Socket\Bean\Response;

Class TestConsole implements ModuleInterface
{
    /**
     * Command execution
     * exec
     * @param Caller $caller
     * @param Response $response
     * @author Tioncico
     * Time: 11:47
     */
    Public function exec(Caller $caller, Response $response)
    {
        $args = $caller->getArgs();
        $actionName = array_shift($args);
        $caller->setArgs($args);
        Switch ($actionName) {
            Case 'echo':
                $this->echo($caller, $response);
                Break;
            Default :
                $this->help($caller, $response);
        }
        // TODO: Implement exec() method.
    }

    /**
     * The help of this command
     * help
     * @param Caller $caller
     * @param Response $response
     * @author Tioncico
     * Time: 11:48
     */
    Public function help(Caller $caller, Response $response)
    {
        // TODO: Implement help() method.
        $help = <<<HELP
Tested custom controller

Usage: Command [command parameter]

Test echo [string] | output string, test method
HELP;
        $response->setMessage($help);
        // TODO: Implement help() method.
    }

    /**
     * Return controller name
     * moduleName
     * @return string
     * @author Tioncico
     * Time: 11:48
     */
    Public function moduleName(): string
    {
        Return 'Test';
        // TODO: Implement moduleName() method.
    }

    /**
     * Output method
     * echo
     * @param $arg
     * @author Tioncico
     * Time: 11:50
     */
    Private function echo(Caller $caller, Response $response)
    {
        $msg = array_shift($caller->getArgs());
        $response->setMessage($msg);
    }
}
````
### Registration Controller
Register the command controller in the `initialize` event of `EasySwooleEvent.php`:
````php
<?php
\EasySwoole\Console\ConsoleModuleContainer ::getInstance()->set(new TestConsole());
````
### Calling the controller
After logging in to the console, type `test echo XianShiKe` to get the result:S
````
[root@localhost tioncico_demo]# php easyswoole console
Connect to tcp://127.0.0.1:9500 success
Welcome to EasySwoole Console
Auth fail,please auth, auth {USER} {PASSWORD}
Auth root 123456
Auth success
Help
Welcome to EasySwoole remote console
Usage: command [action] [...arg]
For help: help [command] [...arg]
Current command list:

Test
Help
Auth
Server
Log
Test echo
XianShiKe

````
