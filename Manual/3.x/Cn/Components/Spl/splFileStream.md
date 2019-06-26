# SplFileStream

## 用途
文件资源流数据操作

## 核心对象方法

核心类：EasySwoole\Utility\SplFileStream

### __construct

初始化资源和读写操作

* mixed     $file       文件
* mixed     $mode       读写操作类型

function __construct($file,$mode = 'c+')

### lock

文件锁定

* mixed     $mode       锁定类型

锁定类型:

* LOCK_SH  取得共享锁定（读取的程序）
* LOCK_EX  取得独占锁定（写入的程序）
* LOCK_UN  释放锁定（无论共享或独占）

function lock($mode = LOCK_EX)

### unlock

释放锁定

* mixed     $mode       锁定类型

function unlock($mode = LOCK_UN)