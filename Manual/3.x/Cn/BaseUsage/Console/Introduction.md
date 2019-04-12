#EasySwoole CONSOLE组件  

EasySwoole 提供了console控制台组件,在项目运行的时候,可通过命令和服务端进行通讯,查看服务端运行状态,实时推送运行逻辑等

## 配置
通过以下配置开启console组件功能
````php
    'CONSOLE'       => [
        'ENABLE'         => true,//是否开启
        'LISTEN_ADDRESS' => '127.0.0.1',//监听地址
        'PORT'           => 9500,//监听端口
        'USER'       => 'root',//验证用户名
        'PASSWORD'       => '123456',//验证密码
    ],
````

## 使用步骤
1:`php easyswoole start` 正常开启服务或`php easyswoole start d` 守护进程
2:切换命令行窗口或在当前命令行窗口(easyswoole服务不能停止),输入`php easyswoole console`
3:如果配置有`USER` 和`PASSWORD`,则需要通过auth {user} {password}  回车 进行验证权限
4:输入控制台命令,例如`help`,点击回车
5:例如:
````
[root@localhost tioncico_demo]# php easyswoole console
connect to  tcp://127.0.0.1:9500 success //连接命令行服务成功
Welcome to EasySwoole Console //欢迎语
auth fail,please auth, auth {USER} {PASSWORD} //验证账号密码失败
auth root 123456 //输入账号,密码验证
auth success //验证成功
help //help命令,将输出console的帮助文档
Welcome to EasySwoole remote console 
Usage: command [action] [...arg] 
For help: help [command] [...arg]
Current command list: //当前可用命令列表

help
auth
server
log


````