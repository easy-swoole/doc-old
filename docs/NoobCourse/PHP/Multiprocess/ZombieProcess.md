## 僵尸进程
僵尸进程是当子进程比父进程先结束，而父进程又没有回收子进程，释放子进程占用的资源，此时子进程将成为一个僵尸进程。

在unix进程管理中,如果你新开的子进程运行结束,父进程将会收到一个SIGCHLD信号,子进程成为僵尸进程(保存了进程的状态等信息),等待父进程的处理,如果父进程一直不处理,该进程将会一直存在,占用系统进程表项,如果僵尸进程过多,导致系统没有可用的进程表项,于是再也无法运行其他的程序

>为了更容易理解,本文使用pcntl扩展进行进程管理  

例如:
```php
<?php
$num = 1;
$str = "EasySwoole,Easy学swoole\n";
$pid = pcntl_fork();
if ($pid > 0) {//主进程代码
    echo "我是主进程,id是".getmypid().",子进程的pid是{$pid}\n";
    pcntl_async_signals(true);
    pcntl_signal(SIGCHLD, function () {
        echo '子进程退出了,请及时处理' . PHP_EOL;
    });
    while (1) {//主进程一直不退出
        sleep(1);
    }

} elseif ($pid == 0) {
    echo "我是子进程,我的pid是" . getmypid() . "\n";
} else {
    echo "我是主进程,我慌得一批,开启子进程失败了\n";
}

```

使用ps查看僵尸进程:
```
ps -A -ostat,ppid,pid,cmd |grep -e '^[Zz]'
```
输出:
```
Z+     7136   7137 [php] <defunct>
```

>当主进程退出之后,子进程将会被init接管并处理

### 回收僵尸进程
回收僵尸进程
#### 通过pcntl_wait和pcntl_waitpid等函数等待子进程结束
```php
<?php
$pid = pcntl_fork();

if ($pid == -1) {
    die('fork error');
} else if ($pid > 0) {
//父进程阻塞着等待子进程的退出
//    pcntl_wait($status);
//    pcntl_waitpid($pid, $status);

//非阻塞方式
//    pcntl_wait($status, WNOHANG);

//    pcntl_waitpid($pid, $status, WNOHANG);

} else {
    sleep(3);
    echo "child \r\n";
    exit;
}
```

#### 通过signal函数为SIGCHLD安装handler，因为子进程结束后，父进程会收到该信号，可以在handler中调用pcntl_wait或pcntl_waitpid来回收.
```php
<?php
pcntl_async_signals(true);

pcntl_signal(SIGCHLD, function () {
    echo "SIGCHLD \r\n";
    //阻塞方式
    pcntl_wait($status);
    //pcntl_waitpid(-1, $status);

    //非阻塞
    //pcntl_wait($status, WNOHANG);
    //pcntl_waitpid(-1, $status, WNOHANG);
});

$pid = pcntl_fork();

if ($pid == -1) {
    die('fork error');
} else if ($pid) {
    sleep(10);
} else {
    sleep(3);
    echo "child \r\n";
    exit;
}
```

#### 忽略掉子进程结束信号,交给init进程管理
```php
<?php
pcntl_async_signals(true);

pcntl_signal(SIGCHLD, SIG_IGN);

$pid = pcntl_fork();
if ($pid == -1) {
    die('fork error');
} else if ($pid>0) {
    while(1){
        sleep(1);
    }
} else {
    sleep(3);
    echo "child \r\n";
    exit;
}
```