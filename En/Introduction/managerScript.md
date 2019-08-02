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
## Service startup
开发模式Development Model： 
```
php easyswoole start
```
## Daemon mode startup
```
php easyswoole start d
```
## Production environment (default configuration loads dev.php, which was dev.env, produce.env before production.php 3.1.2 was loaded with this command)
```
php easyswoole start produce
```
## Service stops (the default configuration loads dev.php, which used to load produce.php 3.1.2 before dev.env, produce.env)
```
php easyswoole stop produce
```
> Note that stop is required in daemon mode, otherwise control + c or termination will exit the process.

## Restart service
```text
php easyswoole reload Restart task process only
php easyswoole reload all  Restart task + worker process
```
> Note that reload is required in daemon mode, otherwise control + c or the terminal will exit the process when disconnected. This is a hot restart, which can be used to update the file (business logic) loaded after worker start. The main process (such as configuration file) will not be restarted. HTTP custom routing configuration will not be updated, need stop + start;

## File Hot Loading

Because of the `swoole` resident memory feature, it is necessary to restart the worker process after modifying the file to reload the modified file into memory. We can customize the process to realize the automatic service overload of file changes.

See related examples

- [Realization Principle of Hot and Heavy Load](../Other/hotReload.md)


## Other

- [Project Document Warehouse](https://github.com/easy-swoole/doc)

- [DEMO](https://github.com/easy-swoole/demo/)

- QQ exchange group
     - VIP group 579434607 (this group needs to pay 599 RMB)
     - EasySwoole official group 633921431 (full)
     - EasySwoole official second group 709134628
    
- Business support:
     - QQ 291323003
     - EMAIL admin@fosuss.com
     
- Translate by
     - NAME: huizhang
     - QQ: 2788828128
     - EMAIL: <a href="mailto:tuzisir@163.com">tuzisir@163.com</a>


- **easySwoole**'s documentation uses **GitBook** as a document writing tool. If you find that the document needs to be corrected/supplemented during use, please **fork** project's document repository for modification , submit **Pull Request** and contact us