# SplStream

## 用途
资源流数据操作

## 核心对象方法

核心类：EasySwoole\Utility\SplStream

初始化资源和读写操作

* mixed     $resource       资源
* mixed     $mode           读写操作类型

function __construct($resource = '',$mode = 'r+')

输出资源

public function __toString()

关闭一个打开的文件指针

public function close()

获取资源并重置资源对象

public function detach()

获取资源大小

public function getSize()

返回文件指针读/写的位置

public function tell()

文件指针是否到了文件结束的位置

public function eof()

获取是否可以在当前流中定位

public function isSeekable()

在文件指针中定位

* mixed     $offset       偏移量
* mixed     $whence       指定类型

public function seek($offset, $whence = SEEK_SET)

指定类型：

* SEEK_SET  设定位置等于 offset 字节
* SEEK_CUR  设定位置为当前位置加上 offset
* SEEK_END  设定位置为文件尾加上 offset

倒回文件指针的位置

public function rewind()

是否可写

public function isWritable()

写入内容

* mixed     $string       内容

public function write($string)

是否可读

public function isReadable()

读取内容

* mixed     $length       长度

public function read($length)

读取资源流到一个字符串

public function getContents()

从封装协议文件指针中取得报头／元数据

public function getMetadata($key = null)

获取资源

function getStreamResource()

将文件截断到给定的长度

* mixed     $size       截取文件大小

function truncate($size = 0)

> ps: 资源和资源流是有区别的,这里说的资源也就是数据或是变量,资源流是一种文件流。

