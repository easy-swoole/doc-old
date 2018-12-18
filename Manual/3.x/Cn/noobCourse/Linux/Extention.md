## php扩展安装
在windows中,只需要将dll文件移动到扩展目录,并在php.ini中引入即可  
linux中类似,我们需要安装扩展的软件(例如mysql扩展,我们需要先安装mysql),再安装mysql操作扩展(mysqli,pdo)生成.so文件,在php.ini中引入.so文件即可

### 编译安装
swoole扩展,先下载swoole官方源码:https://github.com/swoole/swoole-src
解压,进入目录
```
phpize #当不存在./configure时
./configure --with-php-config=/usr/local/php/bin/php-config
make 
make install
```
这时候.so文件会自动生成到php扩展目录(有些扩展需要自己移动进去),
在php.ini最后面加上
```
 extension = swoole.so
```
然后`php -m`查看扩展,就能看到swoole扩展安装好了