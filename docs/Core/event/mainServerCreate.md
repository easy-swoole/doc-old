# 主服务创建事件

## 函数原型
```php
@param \EasySwoole\EasySwoole\Swoole\EventRegister $register
public static function mainServerCreate(EventRegister $register)
{
}
```
## 已完成工作
在执行该事件的时候，已经完成的工作有：
- 框架初始化事件
- 配置文件加载完成
- 主Swoole Server创建成功
- 主Swoole Server 注册了默认的onRequest,onTask,onFinish事件。

## 可处理内容

### 注册主服务回调事件
例如为主服务注册onWorkerStart事件
```php
$register->add($register::onWorkerStart,function (\swoole_server $server,int $workerId){
     var_dump($workerId.'start');
});
```
例如为主服务增加onMessage事件
```php
  // 给server 注册相关事件 在 WebSocket 模式下  message 事件必须注册 并且交给 
$register->set(EventRegister::onMessage, function (\swoole_websocket_server $server, \swoole_websocket_frame $frame) {
    var_dump($frame);
});
```

:::danger 
set方法和add方法是不同的,set将会覆盖之前配置的事件回调,而add是增加一个新的回调
:::

### 添加一个自定义进程
```php
 ServerManager::getInstance()->getSwooleServer()->addProcess((new Test('test_process'))->getProcess());
```

:::danger 
 Test 是 `EasySwoole\Component\Process\AbstractProcess` 抽象类的子类
:::

### 添加一个子服务监听
```php
$subPort = ServerManager::getInstance()->getSwooleServer()->addListener('0.0.0.0',9503,SWOOLE_TCP);
$subPort->on('receive',function (\swoole_server $server, int $fd, int $reactor_id, string $data){
    var_dump($data);
});
```


:::danger 
参考不同的Demo分支event写法: [demo分支](https://github.com/easy-swoole/demo/branches)
:::
