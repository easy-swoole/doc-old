---
title: EasySwoole通用连接池
meta:
  - name: description
    content: EasySwoole通用连接池,协程连接池,easyswoole连接池
  - name: keywords
    content: swoole|swoole 拓展|swoole 框架|easyswoole|连接池|swoole 连接池|通用连接池
---
## 通用连接池

EasySwoole通用的协程连接池管理。

## 安装
```php
composer require easyswoole/pool
```


## 基础实例代码
### 定义池对象
```php
class Std implements \EasySwoole\Pool\ObjectInterface {
    function gc()
    {
        /*
         * 本对象被pool执行unset的时候
         */
    }

    function objectRestore()
    {
        /*
         * 回归到连接池的时候
         */
    }

    function beforeUse(): ?bool
    {
        /*
         * 取出连接池的时候，若返回false，则当前对象被弃用回收
         */
        return true;
    }

    public function who()
    {
        return spl_object_id($this);
    }
}
```
### 定义池
```php

class StdPool extends \EasySwoole\Pool\AbstractPool{
    
    protected function createObject()
    {
        return new Std();
    }
}

```
> 不一定非要创建返回 ```EasySwoole\Pool\ObjectInterface``` 对象，任意类型对象均可

在pool组件版本`>= 1.0.2 `后，提供了`魔术池`支持，可以快速进行定义池

```php
use \EasySwoole\Pool\MagicPool;
$magic = new MagicPool(function (){
    return new \stdClass(); // 示例，可以返回实现了 ObjectInterface 的对象
});

// 注册后获取
$test = $magic->getObj();
// 归还
$magic->recycleObj($test);
```

魔术池构造方法的第二个参数，可以接收一个 config（EasySwoole\Pool\Config类），用于定义池数量等配置。


### 使用
```php

$config = new \EasySwoole\Pool\Config();
$pool = new StdPool($config);

go(function ()use($pool){
    $obj = $pool->getObj();
    $obj2 = $pool->getObj();
    var_dump($obj->who());
    var_dump($obj2->who());
});
```
