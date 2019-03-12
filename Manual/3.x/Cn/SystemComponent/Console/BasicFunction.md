## 基础功能
console组件提供了3个基础控制器和一个帮助控制器.

### Help 
帮助控制器,通过这命令,可显示当前控制台组件的可用命令列表:
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
> 所有控制器都应该要有关于该控制器相关的帮助

### Auth
权限验证控制器,当用户配置了user和password配置项时,使用console组件必须要通过auth控制器验证权限:
````
[root@localhost tioncico_demo]# php easyswoole console
connect to  tcp://127.0.0.1:9500 success 
Welcome to EasySwoole Console
auth fail,please auth, auth {USER} {PASSWORD}
auth root 123456
auth success
````

### Server
服务控制器,进行服务端的管理,服务控制器提供了以下几个方法,可通过`Server help`进行查看:
````
server help
进行服务端的管理

用法: 命令 [命令参数]

server status                    | 查看服务当前的状态
server hostIp                    | 显示服务当前的IP地址
server reload                    | 重载服务端
server shutdown                  | 关闭服务端
server clientInfo [fd]           | 查看某个链接的信息
server close [fd]                | 断开某个链接
````

### Log 
远程控制台日志推送控制器,提供的方法可通过`log help`查看:
````
log help
远程控制台日志推送管理
用法 : 
    log enable 开启日志推送
    log disable 关闭日志推送
    log category 查看当前推送分类
    log setCategory {category} 仅推送某分类日志
    log clearCategory 清除推送分类限制
````

> 在默认情况,日志推送为关闭状态,需要`log enable`进行开启日志推送

开启日志推送之后,系统的错误将会推送到控制台,例如在index控制器new一个不存在的类,则会:
````
[root@localhost tioncico_demo]# php easyswoole console
connect to  tcp://127.0.0.1:9500 success 
Welcome to EasySwoole Console
auth fail,please auth, auth {USER} {PASSWORD}
auth root 123456
auth success
log enable
已经开启日志推送
[2019-03-11 11:29:18][Exception][file:/www/easyswoole/tioncico_demo/App/HttpController/Index.php][line:28]Class 'App\HttpController\a' not found
````

