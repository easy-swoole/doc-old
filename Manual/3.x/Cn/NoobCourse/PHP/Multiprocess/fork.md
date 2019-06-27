## 多进程使用
怎么才能在一个php脚本中,开启多进程处理呢?这里我们可以使用2种方法(注意,本教程只适用于linux,php-cli环境)

### pcntl扩展
pcntl是php官方的多进程扩展,只能在linux环境使用,例如:
```php
<?php
$num=1;
$str="EasySwoole,Easy学swoole\n";
$pid = pcntl_fork();//新开一个子进程,上面的变量内存将会复制一份到子进程中.这个函数,在主进程中返回子进程进程id,在子进程返回0,开启失败在主进程返回-1
echo $str;//这下面的代码,将会被主进程,子进程共同执行

if($pid>0){//主进程代码
    echo "我是主进程,子进程的pid是{$pid}\n";
}elseif($pid==0){
    echo "我是子进程,我的pid是".getmypid()."\n";
}else{
    echo "我是主进程,我现在慌得一批,开启子进程失败了\n";
}
```
详细内容可自行搜索了解

### swoole扩展
swoole扩展是面向生产环境的 PHP 异步网络通信引擎,它也有着进程管理模块
```php
<?php
$num = 1;
$str = "EasySwoole,Easy学swoole\n";

$process = new swoole_process(function () use ($str) {//实例化一个进程类,传入回调函数
    echo $str;//变量内存照常复制一份,只不过swoole的开启子进程后使用的是回调方法运行
    echo "我是子进程,我的pid是" . getmypid() . "\n";
});
$pid = $process->start();//开启子进程,创建成功返回子进程的PID，创建失败返回false。
echo $str;
if ($pid > 0) {//主进程代码
    echo "我是主进程,子进程的pid是{$pid}\n";
}else{
    echo "我是主进程,我现在不慌了,失败就失败吧\n";
}
```
详细内容可自行搜索了解
