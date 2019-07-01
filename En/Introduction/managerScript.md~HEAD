# ManagerScript
after install success, you may see ***easyswoole*** file at your project root.
run:
```
php easyswoole
```
display:
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
help
install
start
stop
reload
console
```
## manager command
run easyswoole
```
//load dev.php config
php easyswoole start
//load produce config
php easyswoole start produce
```
if you want to run swoole in daemonize model
```
//load dev.php config
php easyswoole start d
//load produce config
php easyswoole start produce d
```
stop easyswoole when you start in daemonize model
```
php easyswoole stop
```
reload easyswoole when you start in daemonize model
```
//only reload task worker
php easyswoole reload
//reload task and worker 
php easyswoole reload all 
```

> if you want to hook file change and auto reload server,you may use inotify at user process ,see more at demo.