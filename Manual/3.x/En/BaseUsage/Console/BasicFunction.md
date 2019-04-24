## basic function
The console component provides 3 base controllers and a help controller.

### Help
Help controller, with this command, displays a list of available commands for the current console component:
````
Help
Welcome to EasySwoole remote console
Usage: command [action] [...arg]
For help: help [command] [...arg]
Current command list:

Help
Auth
Server
Log
````
> All controllers should have help with this controller

### Auth
Permission verification controller, when the user configures the user and password configuration items, the console component must use the auth controller to verify permissions:
````
[root@localhost tioncico_demo]# php easyswoole console
Connect to tcp://127.0.0.1:9500 success
Welcome to EasySwoole Console
Auth fail,please auth, auth {USER} {PASSWORD}
Auth root 123456
Auth success
````

### Server
The service controller performs server-side management. The service controller provides the following methods, which can be viewed by `Server help`:
````
Server help
Server-side management

Usage: Command [command parameter]

Server status | View the current status of the service
Server hostIp | Displays the current IP address of the service
Server reload | overloaded server
Server shutdown | close the server
Server clientInfo [fd] | View information about a link
Server close [fd] | Disconnect a link
````

### Log
Remote console log push controller, the provided method can be viewed by `log help`:
````
Log help
Remote console log push management
Usage:
    Log enable to enable log push
    Log disable turn off log push
    Log category View current push categories
    Log setCategory {category} push only a category log
    Log clearCategory Clear push classification restrictions
````

> By default, log push is off, and `log enable` is required to enable log push.

After the log push is turned on, the system error will be pushed to the console. For example, if the index controller new does not exist in the class, it will:
````
[root@localhost tioncico_demo]# php easyswoole console
Connect to tcp://127.0.0.1:9500 success
Welcome to EasySwoole Console
Auth fail,please auth, auth {USER} {PASSWORD}
Auth root 123456
Auth success
Log enable
Log push has been turned on
[2019-03-11 11:29:18][Exception][file:/www/easyswoole/tioncico_demo/App/HttpController/Index.php][line:28]Class 'App\HttpController\a' not found
````
