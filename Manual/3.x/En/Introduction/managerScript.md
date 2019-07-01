# Manage your application The Executable Script 
Once EasySwoole is installed successfully, you will find an executable script file called ***easyswoole*** ready for you in the project root folder.
***easyswoole*** is the command-line interface included with `EasySwoole`. It provides a number of helpful commands that can assist you while you build your application. To view a list of all available EasySwoole commands, you may use the following command:
```
php easyswoole
```
Then you will get:
```
 ______                          _____                              _
 |  ____|                        / ____|                            | |
 | |__      __ _   ___   _   _  | (___   __      __   ___     ___   | |   ___
 |  __|    / _` | / __| | | | |  \___ \  \ \ /\ / /  / _ \   / _ \  | |  / _ \
 | |____  | (_| | \__ \ | |_| |  ____) |  \ V  V /  | (_) | | (_) | | | |  __/
 |______|  \__,_| |___/  \__, | |_____/    \_/\_/    \___/   \___/  |_|  \___|
                          __/ |
                         |___/

Welcome To EASYSWOOLE Command Console!
Usage: php easyswoole [command] [arg]
Get help : php easyswoole help [command]
Current Register Command:
  help          User Guide
  install       Install easySwoole
  start         Start easySwoole
  stop          Stop easySwoole
  reload        Reload easySwoole
```

The `help` command includes a "help" screen which displays and describes the command's available arguments and options. 
To view a help screen, precede the name of the command with help, for example:
```bash
php easyswoole help start
```
You will get:
```bash
Operation:
  php easyswoole start [arg1] [arg2]
Intro:
  to start current easyswoole server
Arg:
  daemonize                    run in daemonize
  produce                      load produce.php
```

## Start your application
Run the `start` command
```
php easyswoole start    // This command will load configuration values from dev.php file

php easyswoole start produce    // This command will load configuration values from produce.php file
```

## Start your application in daemon mode
```
php easyswoole start d  // This command will load configuration values from dev.php file

php easyswoole start produce d  // This command will load configuration values from dev.php file
```

## Stop your application
> You only need this command when your application is running in daemon mode.
```
php easyswoole stop
```

## Reload your application
> You only need this command when your application is running in daemon mode.
> Note: Hot reload action will only affect on worker process. Any changes related to the main process, global configurations, routes and etc, please use `stop` + `start`

```
//only reload worker processes
php easyswoole reload
//reload main task and worker processes
php easyswoole reload all 
```

### Application hot reload
Due to the swoole in-memory feature, after modifying the file, you need to restart the worker process to reload the modified file into the memory. 
We can customize the process to implement file changes and automatically perform service overloading.

> if you want to hook file change and auto reload server,you may use inotify at user process ,see more at demo.