# EasySwoole CONSOLE Component

EasySwoole provides the console component which can communicate with the server through commands and services, view the running status of the server, and push the running logic in real time when the project is running.

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

## Steps for Usage
1: `php easyswoole start` normal service start or `php easyswoole start d` daemon
2: switch the command line window or in the current command line window (easyswoole service can not stop), enter `php easyswoole console`
3: if you have `USER` and `PASSWORD` configured, you need to press auth {user} {password} to enter the authentication permission.
4: enter the console command, such as `help`, click enter
5: for example:
````
[root@localhost tioncico_demo]# php easyswoole console
connect to tcp://127.0.0.1:9500 success // connect to the command line service successfully
welcome to EasySwoole Console // welcome
auth fail, please auth, auth {USER} {PASSWORD} // verify account password failed
auth root 123456 // enter account, password verification
auth success // verification success
help // help command, will output the help file of the console
Welcome to EasySwoole remote console
Usage: command [action] [...arg]
For help: help [command] [...arg]
Current command list: // list all currently available commands

help
auth
server
log


````
