#EasySwoole CONSOLE component

EasySwoole provides the console console component. When the project is running, it can communicate with the server through commands and services, view the running status of the server, and push the running logic in real time.

## Configuration
Enable the console component function with the following configuration
````php
    'CONSOLE' => [
        'ENABLE' => true, / / ​​open
        'LISTEN_ADDRESS' => '127.0.0.1', // Listener address
        'PORT' => 9500, / / ​​listening port
        'USER' => 'root', // verify username
        'PASSWORD' => '123456', // verify password
    ],
````

## Steps for usage
1: `php easyswoole start` normal service or `php easyswoole start d` daemon
2: Switch the command line window or in the current command line window (easyswoole service can not stop), enter `php easyswoole console`
3: If you have `USER` and `PASSWORD` configured, you need to press auth {user} {password} to enter the authentication permission.
4: Enter the console command, such as `help`, click Enter
5: For example:
````
[root@localhost tioncico_demo]# php easyswoole console
Connect to tcp://127.0.0.1:9500 success //Connect to the command line service successfully
Welcome to EasySwoole Console //Welcome
Auth fail, please auth, auth {USER} {PASSWORD} //Verify account password failed
Auth root 123456 //Enter account, password verification
Auth success // verification success
Help //help command, will output the help file of the console
Welcome to EasySwoole remote console
Usage: command [action] [...arg]
For help: help [command] [...arg]
Current command list: //List of currently available commands

Help
Auth
Server
Log


````
