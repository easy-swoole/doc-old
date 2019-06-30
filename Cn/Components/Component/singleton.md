# 单例
单例模式确保类在全局只能有一个实例，因为它的实例是由自己保存，在类的外部也无法对该类进行实例化。  

## 作用
PHP的单例模式是为了避免重复创建对象带来的资源消耗。

## 用途
实际项目中像数据库查询，日志输出，全局回调，统一校验等模块。这些模块功能单一，但需要多次访问，如果能够全局唯一，多次复用会大大提升性能。

## 例子

```php

namespace EasySwoole\Component;

class MySingleton
{
    use Singleton;
}

$mySingleton = Mysingleton::getInstance();

``` 


## 核心对象方法

核心类：EasySwoole\Component\Singleton。

获取对象

* mixed     $args     参数

static function getInstance(...$args)
    