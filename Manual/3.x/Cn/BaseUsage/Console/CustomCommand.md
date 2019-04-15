## 自定义命令  
自定义命令需要实现`EasySwoole\Console\ModuleInterface`接口的3个方法  
### 创建控制器
新建文件`App\Console\TestConsole.php`

````php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/11 0011
 * Time: 11:41
 */

namespace App\Console;


use EasySwoole\Console\ModuleInterface;
use EasySwoole\Socket\Bean\Caller;
use EasySwoole\Socket\Bean\Response;

class TestConsole implements ModuleInterface
{
    /**
     * 命令执行
     * exec
     * @param Caller   $caller
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
                break;
            default :
                $this->help($caller, $response);
        }
        // TODO: Implement exec() method.
    }

    /**
     * 该命令的帮助
     * help
     * @param Caller   $caller
     * @param Response $response
     * @author Tioncico
     * Time: 11:48
     */
    public function help(Caller $caller, Response $response)
    {
        // TODO: Implement help() method.
        $help = <<<HELP
测试的自定义控制器

用法: 命令 [命令参数]

test echo [string]                   | 输出字符串,测试方法
HELP;
        $response->setMessage($help);
        // TODO: Implement help() method.
    }

    /**
     * 返回控制器名称
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
     * 输出方法
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
### 注册控制器
在`EasySwooleEvent.php`的`initialize`事件中注册该命令控制器:
````php
<?php
\EasySwoole\Console\ConsoleModuleContainer::getInstance()->set(new \App\Console\TestConsole());
````
### 调用控制器
登陆控制台之后,输入`test echo 仙士可`即可出现结果:
````
[root@localhost tioncico_demo]# php easyswoole console
connect to  tcp://127.0.0.1:9500 success 
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
test echo 仙士可
仙士可

````

