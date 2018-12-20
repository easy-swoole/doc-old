## SplFileStream
SplFileStream继承了[SplStream](../Spl/SplStream.md),通过该访问,可将文件直接转为资源流形式,便于操作:

```php
<?php
$file = new \EasySwoole\Spl\SplFileStream('./test.php','a+');
$file->lock();//文件加锁
$file->unlock();//文件解锁
echo $file->getContents();//输出文件内容
```