## php-cli
在前面的简单介绍中,我们已经了解了有php-cli这个模式,现在我们继续详细了解下php-cli和传统web模式不一样的地方吧  

### 超时时间  
在php-cli中,是没有超时时间的,也无法通过  set_time_limit 设置超时时间,例如:  

```php
<?php
set_time_limit(30);
while (1){
    echo 1;
    sleep(1);
}
```
这段代码,在常规web下运行,只要到30秒就会报Fatal error: Maximum execution time of 30 seconds exceeded in ......这样的错误  
而在php-cli中,这段代码将会一直执行,一直输出1到控制台中

### buffer缓冲 
在常规web模式中,echo,var_dump,phpinfo等输出语句/函数,默认情况是先进入php缓冲区,等缓冲区到达一定数量,才开始传输给web服务器的,但是在php-cli模式中,默认关闭buffer,直接输出,例如以下代码:  
```php
<?php
ob_start();//开启buffer缓冲区  php-cli下默认关闭buffer,由于web访问测试较麻烦,该段代码只为了查看以及测试缓冲区的作用,在web模式下,默认开启,无需手动开启,可自行配置
for($i=0;$i<1000;$i++){
    echo $i;
    sleep(1);
    if($i%10==0){
        //当i为10的倍数时,将直接结束并输出缓冲区的数据,然后再次开启缓冲区
        ob_end_flush();
        ob_start();
    }
}
```
>也可通过ob_get_contents函数获取缓冲区内容,ob缓冲系列函数可自行搜索了解  

buffer缓冲详细内容可查看:http://www.php20.cn/article/sw/buffer/104 
### 标准输入/输出/错误  
执行一个命令行都存在3个标准文件(linux一切皆文件): 
 * 标准输入 (stdin,通常对应终端的键盘,进程可通过该文件获取键盘输入的数据)
 * 标准输出 (stdout,对应终端的屏幕,进程通过写入数据到该文件,将数据显示到屏幕)
 * 标准错误 (stderr,对应终端的屏幕,进程通过写入数据到该文件,将错误信息显示到屏幕)
在php-cli命令行下,可通过以上3个文件句柄进行一系列的逻辑操作,比如:  
 启动php文件,监听标准输入,获取到输入的网址,php再进行网址的数据请求/接收 等等操作
而在常规web模式下,标准输出会被拦截 
>echo var_dump等输出函数其实就是stdout,但是在常规web访问下被重定向到了web服务器,然后由web服务器输出

了解详细内容可查看http://www.php20.cn/article/156
 

### php-cli 专属扩展
php有些扩展在常规web下运行时没用/没有意义的 例如: 
 * swoole扩展
 * socket扩展
 * 等



