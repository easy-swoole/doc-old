---
title: initialize
meta:
  - name: description
    content: 框架初始化事件
  - name: keywords
    content: EasySwoole,initialize
---
# 框架初始化事件

## 函数原型

```php
public static function initialize(): void
{
}
```

## 已完成工作

在执行框架初始化事件时，EasySwoole已经完成的工作有：

- 全局常量EASYSWOOLE_ROOT的定义
- 系统默认Log/Temp目录的定义


## 可处理内容

在该事件中，可以进行一些系统常量的更改和全局配置，例如：

- 修改并创建系统默认Log/Temp目录。
- 引入用户自定义配置
- 注册 数据库,redis 连接池
- trace链追踪器注册

## 启动前调用协程API
```php
use Swoole\Coroutine\Scheduler;
$scheduler = new Scheduler();
$scheduler->add(function() {
    /*  调用协程API */
});
$scheduler->start();
//清除全部定时器
\Swoole\Timer::clearAll();
```