## Custom Command
Custom commands need to implement 3 methods of the `EasySwoole\Console\ModuleInterface` interface
### Creating a Controller
Create a new file `App\Console\TestConsole.php`

````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/11 0011
 * Time: 11:41
 */

namespace App\console;


use EasySwoole\Console\ModuleInterface;
use EasySwoole\Socket\Bean\Caller;
use EasySwoole\Socket\Bean\Response;

class TestConsole implements ModuleInterface
{
    /**
     * Execution of command
     * exec
     * @param Caller $caller
     * @param Response $response
     * @author Tioncico
     * Time: 11:47
     */
    public function exec(Caller $caller, Response $response)
    {
        $args = $caller->getArgs();
        $actionName = array_shift($args);
        $caller->setArgs($args);
        switch ($actionName) {
            case 'echo':
                $this->echo($caller, $response);
                Break;
            default :
                $this->help($caller, $response);
        }
        // TODO: Implement exec() method.
    }

    /**
     * the help of this command
     * help
     * @param Caller $caller
     * @param Response $response
     * @author Tioncico
     * Time: 11:48
     */
    public function help(Caller $caller, Response $response)
    {
        // TODO: Implement help() method.
        $help = <<<HELP
tested custom controller

usage: Command [command parameter]

test echo [string] | output string, test method
HELP;
        $response->setMessage($help);
        // TODO: Implement help() method.
    }

    /**
     * return controller name
     * moduleName
     * @return string
     * @author Tioncico
     * Time: 11:48
     */
    public function moduleName(): string
    {
        return 'Test';
        // TODO: Implement moduleName() method.
    }

    /**
     * output method
     * echo
     * @param $arg
     * @author Tioncico
     * Time: 11:50
     */
    private function echo(Caller $caller, Response $response)
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
### Calling the Controller
After logging in to the console, type `test echo XianShiKe` to get the result:
````
[root@localhost tioncico_demo]# php easyswoole console
Connect to tcp://127.0.0.1:9500 success
Welcome to EasySwoole Console
auth fail,please auth, auth {USER} {PASSWORD}
auth root 123456
auth success
help
Welcome to EasySwoole remote console
Usage: command [action] [...arg]
For help: help [command] [...arg]
Current command list:

test
help
auth
server
log
test echo XianShiKe
XianShiKe

````
