## SplStream
SplStream实现了流数据操作,直接将数据存储进内存中,提供了各种操作方法.
示例:
```php
<?php
$file = fopen('./test.php','a+');
$file = new \EasySwoole\Spl\SplStream($file);
//var_dump($file);
//var_dump($file->__toString());//魔术方法,将指针指向数据头,输出资源内容
//$file->close();//关闭该数据流
//var_dump($file->detach());//关闭数据流,返回原始数据(资源句柄,类等)
//var_dump($file->getSize());//获取数据大小
//var_dump($file->tell());//返回数据流当前位置
//var_dump($file->eof());//判断流指针是否到了末尾
//var_dump($file->isSeekable());//是否可以偏移指针
//var_dump($file->seek(10),$file->getContents());//偏移指针//偏移后内容变化
//var_dump($file->rewind());//指针归零
//var_dump($file->isWritable());//是否可写
//var_dump($file->write($file->__toString()));//写入数据
//var_dump($file->isReadable());//是否可读
//var_dump($file->read(500));//读取x字节的数据
//var_dump($file->getContents());//从指针开始获取数据内容
//var_dump($file->getMetadata());//获取文件meta信息
//var_dump($file->getStreamResource());//获取原始资源
//var_dump($file->truncate());//修改文件大小
```
