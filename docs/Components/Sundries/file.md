---
title: File
meta:
  - name: description
    content: 用于操作文件或目录。
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|组件库|杂项工具|File
---

# File



## 用途

用于操作文件或目录。



## 核心对象类

实现该组件功能需加载核心类：

```php
EasySwoole\Utility\File
```



## 核心对象方法

#### createDirectory

创建目录：

- string $dirPath 目录路径
- string $permissions 目录权限

```php
static function createDirectory($dirPath, $permissions = 0755):bool
```



#### cleanDirectory

清空目录：

- string $dirPath 目录路径
- string $keepStructure 是否保持目录结构

```php
static function cleanDirectory($dirPath, $keepStructure = false):bool
```



#### deleteDirectory

删除目录：

- string $dirPath 目录路径

```php
static function deleteDirectory($dirPath):bool
```



#### copyDirectory

复制目录：

- string $source 源位置
- string $target 目标位置
- bool $overwrite 是否覆盖

```php
static function copyDirectory($source, $target, $overwrite = true):bool
```



#### moveDirectory

移动目录：

- string $source 源位置
- string $target 目标位置
- bool $overwrite 是否覆盖

```php
static function moveDirectory($source, $target ,$overwrite = true):bool
```



#### copyFile

复制文件：

- string $source 源位置
- string $target 目标位置
- bool $overwrite 是否覆盖

```php
static function copyFile($source, $target, $overwrite = true):bool
```



#### touchFile

创建空文件：

- string $filePath 文件名
- bool $overwrite 是否覆盖

```php
static function touchFile($filePath, $overwrite = true):bool
```



#### createFile

创建有内容文件：

- string $filePath 文件名
- string $content 内容
- bool $overwrite 是否覆盖

```php
static function createFile($filePath, $content, $overwrite = true):bool
```



#### moveFile

移动文件：

- string $source 源位置
- string $target 目标位置
- bool $overwrite 是否覆盖

```php
static function moveFile($source, $target, $overwrite = true):bool

```



### scanDir

获得文件目录或目录文件数组：

- string $dirPath 目录路径

```php
static function scanDir($dirPath)
```

