# File

## Purpose
Used to manipulate files or directories.

## Core Object Method

Core class：EasySwoole\Utility\File

### createDirectory

Create directories：

- string    $dirPath        Directory path
- string    $permissions    Directory right

```php
static function createDirectory($dirPath, $permissions = 0755):bool
```

### cleanDirectory

Clear the catalogue：

- string    $dirPath        Directory path
- string    $keepStructure  Whether to keep directory structure or not

```php
static function cleanDirectory($dirPath, $keepStructure = false):bool
```

### deleteDirectory

Delete directories：

- string    $dirPath     Directory path

```php
static function deleteDirectory($dirPath):bool
```

### copyDirectory

Copy Directory：

- string    $source     Source location
- string    $target     Target location
- bool      $overwrite  Coverage or not

```php
static function copyDirectory($source, $target, $overwrite = true):bool
```

### moveDirectory

move directory：

- string    $source     Source location
- string    $target     Target location
- bool      $overwrite  Coverage or not

```php
static function moveDirectory($source, $target ,$overwrite = true):bool
```

### copyFile

copy file：

- string    $source     Source location
- string    $target     Target location
- bool      $overwrite  Coverage or not

```php
static function copyFile($source, $target, $overwrite = true):bool
```

### touchFile

touch file：

- string    $filePath       File name
- bool      $overwrite      Coverage or not

```php
static function touchFile($filePath, $overwrite = true):bool
```

### createFile

Create Content Files：

- string    $filePath       File name
- string    $content        Content
- bool      $overwrite      Coverage or not

```php
static function createFile($filePath, $content, $overwrite = true):bool
```

### moveFile

move file：

- string    $source         Source location
- string    $target         Target location
- bool      $overwrite      Coverage or not

```php
static function moveFile($source, $target, $overwrite = true):bool
```

### scanDir

Get the file directory or directory file array：

- string    $dirPath    Directory path

```php
static function scanDir($dirPath)
```
