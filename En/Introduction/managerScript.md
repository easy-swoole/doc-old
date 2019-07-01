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

欢迎使用为API而生的 easySwoole 框架 当前版本: 3.x

使用:
  easyswoole [操作] [选项]

操作:
  install       安装easySwoole
  start         启动easySwoole
  stop          停止easySwoole
  reload        重启easySwoole
  help          查看命令的帮助信息

有关某个操作的详细信息 请使用 help 命令查看 
如查看 start 操作的详细信息 请输入 easyswoole help -start
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