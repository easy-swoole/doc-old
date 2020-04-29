---
title: EasySwoole利用phpunit进行单元测试
meta:
  - name: description
    content: EasySwoole利用phpunit进行单元测试 swoole单元测试 协程环境单元测试
  - name: keywords
    content: swoole|swoole extension|swoole framework|EasySwoole 单元测试|swoole 单元测试|swoole phpunit
---

# Phpunit

Easyswoole/Phpunit 是对 Phpunit 的协程定制化封装，主要为解决自动协程化入口的问题。并屏蔽了Swoole ExitException

## Installation 
```
composer require easyswoole/phpunit
```
## 使用
执行
```
./vendor/bin/co-phpunit tests
```


::: warning 
 tests为你写的测试文件的目录，可以自定义
:::

## 预处理
```php
/*
 * 允许自动的执行一些初始化操作，只初始化一次
 */
if(file_exists(getcwd().'/phpunit.php')){
    require_once getcwd().'/phpunit.php';
}
```

easyswoole/phpunit 支持在项目目录下定义一个phpunit.php，用户可以在该文件下进行统一的测试前预处理

其他测试与phpunit一致

## EasySwoole中使用
自3.2.5版本的Easyswoole起，已经默认集成了 easyswoole/phpunit 组件。命令行下执行：
```
php easyswoole phpunit tests
```

即可进行测试，若部分测试需要Http或者tcp等服务，可以先以启动easyswoole并进入守护模式，再进行测试



::: warning 
 tests为你写的测试文件的目录，可以自定义
:::
