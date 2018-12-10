## FastCache组件
EasySwoole FastCache组件通过新开进程,使用SplArray存储,unix sock 高速通信方式,实现了多进程共享数据.

### 使用配置:
```
FAST_CACHE.PROCESS_NUM = 1 进程数
```

### 简单示例:
```php
<?php
$cache = \EasySwoole\EasySwoole\FastCache\Cache::getInstance();
$cache->set('name','仙士可');
$cache->set('name2','仙士可2号');//设置
$cache->unset('name');//销毁
$keys = $cache->keys();//获取全部key
$str = "现在存储的数据有:";
foreach ($keys as $key) {
    $value = $cache->get($key);//获取
    $str .= "$key:$value\n";
}
echo $str;
```
> FastCache只能在服务启动之后使用