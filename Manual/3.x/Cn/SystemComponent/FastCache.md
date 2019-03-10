## FastCache组件
EasySwoole FastCache组件通过新开进程,使用SplArray存储,unix sock 高速通信方式,实现了多进程共享数据.[组件地址](https://github.com/easy-swoole/fast-cache)

> 该组件为 3.0.8 版本新增，如需要使用，请手动增加 `FAST_CACHE.PROCESS_NUM` 配置项到配置文件里

### 使用配置:
```
'FAST_CACHE'=>[
    'PROCESS_NUM'=>5
]
```

### 简单示例:
```php
<?php
$cache = \EasySwoole\FastCache\Cache::getInstance();
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
### 全部例子:
```php
<?php
$cache = Cache::getInstance();
$cache->set('name', '仙士可');//设置
$cache->get('name');//获取
$cache->keys();//获取所有key
$cache->unset('name');//删除key
$cache->flush();//清空所有key
($cache->enQueue('listA', '1'));//增加一个队列数据
($cache->enQueue('listA', '2'));//增加一个队列数据
($cache->enQueue('listA', '3'));//增加一个队列数据
var_dump($cache->queueSize('listA'));//队列大小
//      var_dump(  $cache->unsetQueue('listA');//删除队列
//        var_dump($cache->queueList('listA'));//队列列表
var_dump($cache->flushQueue());//清空队列
var_dump($cache->deQueue('listA'));//出列
var_dump($cache->deQueue('listA'));//出列



```

### 落地重启恢复方案
FastCache提供了3个方法,用于数据落地以及重启恢复,在`EasySwooleEvent.php`中的`mainServerCreate`回调事件中设置以下方法:
```php
<?php
Cache::getInstance()->setTickInterval(5 * 1000);//设置定时频率
Cache::getInstance()->setOnTick(function (CacheProcess $cacheProcess) {
    $data = [
        'data'  => $cacheProcess->getSplArray(),
        'queue' => $cacheProcess->getQueueArray()
    ];
    $path = EASYSWOOLE_ROOT . '/Temp/' . $cacheProcess->getProcessName();
    File::createFile($path,serialize($data));//每隔5秒将数据存回文件
});
Cache::getInstance()->setOnStart(function (CacheProcess $cacheProcess) {
    $path = EASYSWOOLE_ROOT . '/Temp/' . $cacheProcess->getProcessName();
    if(is_file($path)){
        $data = unserialize(file_get_contents($path));
        $cacheProcess->setQueueArray($data['queue']);
        $cacheProcess->setSplArray($data['data']);
    }//启动时将存回的文件重新写入
});
Cache::getInstance()->setOnShutdown(function (CacheProcess $cacheProcess) {
    $data = [
        'data'  => $cacheProcess->getSplArray(),
        'queue' => $cacheProcess->getQueueArray()
    ];
    $path = EASYSWOOLE_ROOT . '/Temp/' . $cacheProcess->getProcessName();
    File::createFile($path,serialize($data));//在守护进程时,php easyswoole stop 时会调用,落地数据
});

```


> FastCache只能在服务启动之后使用,需要有创建unix sock权限(建议使用vm,docker或者linux系统开发)

### unable to connect to unix:///报错
该报错是因为系统不支持unix sock或没有权限创建/访问unix sock,请换成换成linux系统或虚拟机,docker等环境
> 使用虚拟机,docker等方式开发,不能在共享文件夹使用EasySwoole,如果需要在vm下开发,建议使用sftp上传文件.