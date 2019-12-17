---
title: File
meta:
  - name: description
    content: Used to manipulate files or directories.
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|Component Library|Miscellaneous Tools|File
---

# File

## Use

Used to manipulate files or directories.


## Core Object Class

To implement this component function you need to load the core class:

```php
EasySwoole\Utility\File
```



## Core Object Method

#### createDirectory

Create a directory:

- string $dirPath directory path
- string $permissions directory permissions

```php
static function createDirectory($dirPath, $permissions = 0755):bool
```



#### cleanDirectory

Empty the directory:

- string $dirPath directory path
- string $keepStructure whether to maintain the directory structure

```php
static function cleanDirectory($dirPath, $keepStructure = false):bool
```



#### deleteDirectory

Delete directory:

- string $dirPath directory path

```php
static function deleteDirectory($dirPath):bool
```



#### copyDirectory

Copy directory:

- string $source source location
- string $target target location
- bool $overwrite whether to overwrite

```php
static function copyDirectory($source, $target, $overwrite = true):bool
```



#### moveDirectory

Mobile directory:

- string $source source location
- string $target target location
- bool $overwrite whether to overwrite

```php
Static function moveDirectory($source, $target ,$overwrite = true):bool
```



#### copyFile

Copy the file:

- string $source source location
- string $target target location
- bool $overwrite whether to overwrite

```php
Static function copyFile($source, $target, $overwrite = true):bool
```



#### touchFile

Create an empty file:

- string $filePath filename
- bool $overwrite whether to overwrite

```php
static function touchFile($filePath, $overwrite = true):bool
```



#### createFile

Create a content file:

- string $filePath filename
- string $content content
- bool $overwrite whether to overwrite

```php
Static function createFile($filePath, $content, $overwrite = true):bool
```



#### moveFile

Move files:

- string $source source location
- string $target target location
- bool $overwrite whether to overwrite

```php
Static function moveFile($source, $target, $overwrite = true):bool

```



### scanDir

Get an array of file directories or directory files:

- string $dirPath directory path

```php
static function scanDir($dirPath)
```

