## 进程管理
我们可以使用ps 查看当前进程(相当于windows的任务管理器)
```
ps -ef |grep php
```
输出:
```
root       8351   8346  0 09:07 ?        00:00:00 /usr/bin/php /www/wwwroot/es3_demo/test.php
root      10618   8970  0 14:26 pts/0    00:00:00 grep --color=auto php
```
用于筛选出当前运行中,包含php关键字的进程信息
通过kill -9 PID可杀死某一个进程:
```
kill -9 10618
```
使用killall 可杀死指定名字的进程:
```
killall -9 php
```
杀死所有php进程

>kill 和killall其实是给进程发送一个进程信号的命令,-9是SIGKILL 信号,终止进程,可通过kill ,killall命令发送其他信号