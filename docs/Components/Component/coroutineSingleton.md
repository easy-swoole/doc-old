---
title: 协程单例
meta:
  - name: description
    content: EasySwoole 协程安全 单例模式
  - name: keywords
    content: easyswoole|协程安全|单例模式
---

# 协程单例

为兼容协程环境下的单例模式安全 可以使用CoroutineSingleTon这个trait

引用方法可以参考普通Singleton trait

```php
namespace EasySwoole\Component;
use Swoole\Coroutine;
trait CoroutineSingleTon
{
    private static $instance = [];
    static function getInstance(...$args)
    {
        $cid = Coroutine::getCid();
        if(!isset(self::$instance[$cid])){
            self::$instance[$cid] = new static(...$args);
            /*
             * 兼容非携程环境
             */
            if($cid > 0){
                Coroutine::defer(function ()use($cid){
                    unset(self::$instance[$cid]);
                });
            }
        }
        return self::$instance[$cid];
    }
    function destroy(int $cid = null)
    {
        if($cid === null){
            $cid = Coroutine::getCid();
        }
        unset(self::$instance[$cid]);
    }
} 
```