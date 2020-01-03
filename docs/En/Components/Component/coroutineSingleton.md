---
title: Coroutine Singleton
meta:
  - name: description
    content: EasySwoole Coroutine security Coroutine Singleton
  - name: keywords
    content: swoole|swoole expand|swoole frame|easyswoole|Coroutine security|Coroutine Singleton
---

# Coroutine Singleton

For the security of singleton mode under the compatible cooperation environment, coroutinesingleton can be used

Reference method can refer to common Singleton trait

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
