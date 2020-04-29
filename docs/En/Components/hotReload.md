---
title: 热重载监视器
meta:
  - name: description
    content: 方便的热重载组件，在Linux环境下使用Inotify，其他环境或虚拟机内使用iNode脏检测扫描实现开发过程中的代码热重载，可自定义重载处理逻辑，由于可以自定义，也可以作为一个方便的文件变更事件触发器使用，在文件变更时执行一些逻辑
  - name: keywords
    content: swoole|swoole extension|swoole framework|热重载监视器|hot-reload|iNode
---

# hot-reload

## 安装
```
composer require easyswoole/hot-reload
```

## 单独使用

```php
// 创建一个服务
require_once 'vendor/autoload.php';
$server = new \Swoole\Server('0.0.0.0', '9801');
$server->on('receive', function () {});

// 设置监视器的选项
$hotReloadOptions = new \EasySwoole\HotReload\HotReloadOptions;
// 虚拟机中可以关闭Inotify检测
$hotReloadOptions->disableInotify(true);
// 可以设置多个监控目录的绝对路径
$hotReloadOptions->setMonitorFolder([dirname(__FILE__)]);
// 忽略某些后缀名不去检测
$hotReloadOptions->setIgnoreSuffix(['php', 'txt']);
// 自定义检测到变更后的事件
$hotReloadOptions->setReloadCallback(function (\Swoole\Server $server) {
    echo "File change event triggered";  // 可以执行如清理临时目录等逻辑
    $server->reload();  // 接管变更事件 需要自己执行重启
});

$hotReload = new \EasySwoole\HotReload\HotReload($hotReloadOptions);
$hotReload->attachToServer($server);
$server->start();
```

### EasySwoole框架中使用
请在全局事件(EasySwooleEvent)的mainServerCreate方法中进行注册

```php
class EasySwooleEvent {

    // 省略部分代码 ...

    /**
     * 服务启动时
     * @param EventRegister $register
     * @throws Exception
     */
    public static function mainServerCreate(EventRegister $register)
    {
        // 配置同上别忘了添加要检视的目录
        $hotReloadOptions = new \EasySwoole\HotReload\HotReloadOptions;
        $hotReload = new \EasySwoole\HotReload\HotReload($hotReloadOptions);
        $hotReloadOptions->setMonitorFolder([EASYSWOOLE_ROOT . '/App']);
        
        $server = ServerManager::getInstance()->getSwooleServer();
        $hotReload->attachToServer($server);
    }

    // 省略部分代码 ...

}
```

# hot-reload

方便的热重载组件，在Linux环境下使用Inotify，其他环境或虚拟机内使用iNode脏检测扫描实现开发过程中的代码热重载，可自定义重载处理逻辑，由于可以自定义，也可以作为一个方便的文件变更事件触发器使用，在文件变更时执行一些逻辑

::: warning 
!!!警告!!! 仅供开发使用，请勿在生产环境使用，以免意外重启造成逻辑异常
:::
