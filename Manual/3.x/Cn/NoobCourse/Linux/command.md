## 命令基础

linux命令存储以下位置:
* /bin(指向/usr/bin)目录,包含基本的用户命令,默认全体用户都可使用,例如`curl`,`ls`命令
* /sbin(指向/usr/sbin),/usr/local/sbin,存放需要root权限的命令以及工具,默认root用户使用,例如`ip`,`halt`命令
* /usr/local/bin 给用户放置自己的可执行程序的地方,不会被系统升级覆盖
* /usr/local/sbin 给管理员放置自己的可执行程序的地方,不会被系统升级覆盖

如果在每个命令目录都存在某个命令时,通过系统的`$PATH`变量决定优先级
```
echo $PATH
# 每台电脑输出不同,/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/usr/local/protobuf/bin/:/root/bin
```
所以,当你输入 `ls` 命令,点击回车时,系统会以此从各个目录找到这个命令文件,然后执行该文件.

##### 执行当前目录文件
如果你的程序命令没有放在以上文件夹,我们也可通过相对路径以及绝对路径启动该命令:
```
./php -m #当你在php命令文件目录中时,
/www/server/php/72/bin/php -m,宝塔php命令目录
```
根据这个原理,我们可以安装多个php版本,并启动
```
/www/server/php/72/bin/php -m
/www/server/php/56/bin/php -m
```
