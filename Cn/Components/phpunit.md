<head>
     <title>EasySwoole利用phpunit进行单元测试</title>
     <meta name="keywords" content="EasySwoole 单元测试|swoole 单元测试|swoole phpunit"/>
     <meta name="description" content="EasySwoole 单元测试|swoole 单元测试|swoole phpunit"/>
</head>
---<head>---

# Phpunit

Easyswoole/Phpunit 是对 Phpunit 的协程定制化封装，主要为解决自动协程化入口的问题。并屏蔽了Swoole ExitException

## 安装 
```
composer require easyswoole/phpunit
```

## 使用
执行
```
./vendor/bin/co-phpunit tests
```

其他测试与phpunit一致

## EasySwoole中使用
最新的Easyswoole已经默认集成了 easyswoole/phpunit 组件。命令行下执行：
```
php easyswoole phpunit tests
```

即可进行测试，若部分测试需要Http或者tcp等服务，可以先以启动easyswoole并进入守护模式，再进行测试


> tests为你写的测试文件的目录，可以自定义
