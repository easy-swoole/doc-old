
## 同步
同步代码主要是指调用某个逻辑时,会等待到该逻辑返回调用结果.  
例如:
```php
<?php
$num = 30;
$result = M('test')->select();//伪代码,查询数据库
sleep(3);//伪代码,当成执行了3秒才返回
echo json_encode($result);//返回数据
```
只有当select查询到数据时,才会返回数据给$result,这个值一定是数据库操作完毕返回的值

例如:
```php
<?php
$num = -30;
$result = abs($num);
echo json_encode($result);//返回数据

```
abs会返回数据给$result,这个值一定是abs正确操作的值

例如:  
用户请求www.easyswoole.com,页面会一直等待easyswoole响应数据.

例如:
```php
<?php
//模拟发送邮件中
$status = send();
sleep(30);//发送邮件花费30秒

echo "发送邮件".$status?'完成':'失败';
```
等待发送邮件的成功/失败,就是同步

## 异步
异步代码主要是指调用某个逻辑时,不会等待该逻辑返回的结果,只会返回是否已经调用的最初结果(或不返回)  
例如:

调用$.ajax(),默认情况下是异步ajax,它会继续往下执行代码,当有结果返回时通过回调事件进行处理.

例如:
```php
<?php
$pid = pcntl_fork();
if ($pid == 0) {
    //子进程
    //模拟发送邮件
    sleep(30);//发送邮件花费30秒
    exit(0);
}

pcntl_waitpid($pid, $status, WNOHANG);
echo "发送邮件中";
```
通过新开一个进程去处理发送邮件的任务,在当前进程中不关心发送邮件的结果,直接往下执行

![同步异步](Async.png)
