## Basic Function
The console component provides 3 basic controllers and 1 help controller.

### Help
Through this command, Help controller displays a list of available commands for the current console component:
````
help
Welcome to EasySwoole remote console
Usage: command [action] [...arg]
For help: help [command] [...arg]
Current command list:

help
auth
server
log
````
> All controllers should have the help of controller

### Auth
Permission verification controller, when the user configures the user and password configuration items, the console component must use the auth controller to verify permissions:
````
[root@localhost tioncico_demo]# php easyswoole console
Connect to tcp://127.0.0.1:9500 success
Welcome to EasySwoole Console
auth fail,please auth, auth {USER} {PASSWORD}
auth root 123456
auth success
````

### Server
The service controller performs server-side management. The service controller provides the following methods, which can be viewed by `server help`:
````
server help
server-side management

usage: command [command parameter]

server status | view the current status of the service
server hostIp | display the current IP address of the service
server reload | overload server
server shutdown | close the server
server clientInfo [fd] | view information about a link
server close [fd] | disconnect a link
````

### Log
Remote console log push controller, the provided method can be viewed by `log help`:
````
log help
remote console log push management
usage:
    log enable | enable log push
    log disable | turn off log push
    log category | view current push categories
    log setCategory {category} | push only a kind of category logs
    log clearCategory | clear push classification restrictions
````

> By default, log push is off, and `log enable` is required to enable log push.

After the log push is turned on, the system error will be pushed to the console. For example, if the index controller new does not exist in the class, it will:
````
[root@localhost tioncico_demo]# php easyswoole console
Connect to tcp://127.0.0.1:9500 success
Welcome to EasySwoole Console
auth fail,please auth, auth {USER} {PASSWORD}
auth root 123456
auth success
log enable
log push has been turned on
[2019-03-11 11:29:18][Exception][file:/www/easyswoole/tioncico_demo/App/HttpController/Index.php][line:28]Class 'App\HttpController\a' not found
````
