# 服务热重启

由于 `swoole` 常驻内存的特性，修改文件后需要重启worker进程才能将被修改的文件重新载入内存中，我们可以自定义Process的方式实现文件变动自动进行服务重载

## 热重载进程

新建文件 `App/Process/HotReload.php` 并添加如下内容，也可以放在其他位置，请对应命名空间

```php
<?php
/**
 * Created by PhpStorm.
 * User: evalor
 * Date: 2018-11-26
 * Time: 23:18
 */

namespace App\Process;

use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\EasySwoole\Swoole\Process\AbstractProcess;
use EasySwoole\Utility\File;
use Swoole\Process;
use Swoole\Table;
use Swoole\Timer;

/**
 * 暴力热重载
 * Class HotReload
 * @package App\Process
 */
class HotReload extends AbstractProcess
{
    /** @var \swoole_table $table */
    protected $table;
    protected $isReady = false;

    /**
     * 启动定时器进行循环扫描
     * @param Process $process
     */
    public function run(Process $process)
    {
        $disableInotify = $this->getArg('disableInotify');
        if (extension_loaded('inotify') && !$disableInotify) {
            // 扩展可用 优先使用扩展进行处理
            $this->registerInotifyEvent();
            echo "server hot reload start : use inotify\n";
        } else {
            // 扩展不可用时 进行暴力扫描
            $this->table = new Table(2048);
            $this->table->column('mtime', Table::TYPE_INT, 4);
            $this->table->create();
            $this->runComparison();
            Timer::tick(1000, function () {
                $this->runComparison();
            });
            echo "server hot reload start : use timer tick comparison\n";
        }
    }

    /**
     * 扫描文件变更
     */
    private function runComparison()
    {
        $startTime = microtime(true);
        $doReload = false;
        $files = File::scanDirectory(EASYSWOOLE_ROOT . '/App');
        if (isset($files['files'])) {
            foreach ($files['files'] as $file) {
                $currentTime = filemtime($file);
                $inode = crc32($file);
                if (!$this->table->exist($inode)) {
                    $doReload = true;
                    $this->table->set($inode, ['mtime' => $currentTime]);
                } else {
                    $oldTime = $this->table->get($inode)['mtime'];
                    if ($oldTime != $currentTime) {
                        $doReload = true;
                    }
                    $this->table->set($inode, ['mtime' => $currentTime]);
                }
            }
        }
        if ($doReload) {
            $count = $this->table->count();
            $time = date('Y-m-d H:i:s');
            $usage = round(microtime(true) - $startTime, 3);
            if (!$this->isReady == false) {
                echo "severReload at {$time} use : {$usage} s total: {$count} files\n";
                ServerManager::getInstance()->getSwooleServer()->reload();
            } else {
                echo "hot reload ready at {$time} use : {$usage} s total: {$count} files\n";
                $this->isReady = true;
            }
        }
    }

    /**
     * 注册Inotify监听事件
     */
    private function registerInotifyEvent()
    {
        // 因为进程独立 且当前是自定义进程 全局变量只有该进程使用
        // 在确定不会造成污染的情况下 也可以合理使用全局变量
        global $lastReloadTime;
        global $inotifyResource;

        $lastReloadTime = 0;
        $files = File::scanDirectory(EASYSWOOLE_ROOT . '/App');
        $files = array_merge($files['files'], $files['dirs']);

        $inotifyResource = inotify_init();

        // 为当前所有的目录和文件添加事件监听
        foreach ($files as $item) {
            inotify_add_watch($inotifyResource, $item, IN_CREATE | IN_DELETE | IN_MODIFY);
        }

        // 加入事件循环
        swoole_event_add($inotifyResource, function () {
            global $lastReloadTime;
            global $inotifyResource;
            $events = inotify_read($inotifyResource);
            if ($lastReloadTime < time() && !empty($events)) { // 限制1s内不能进行重复reload
                $lastReloadTime = time();
                ServerManager::getInstance()->getSwooleServer()->reload();
            }
        });
    }

    public function onShutDown()
    {
        // TODO: Implement onShutDown() method.
    }

    public function onReceive(string $str)
    {
        // TODO: Implement onReceive() method.
    }
}
```

添加好后在全局的 `EasySwooleEvent.php` 中，注册该自定义进程

```php
public static function mainServerCreate(EventRegister $register)
{
    $swooleServer = ServerManager::getInstance()->getSwooleServer();
    $swooleServer->addProcess((new HotReload('HotReload', ['disableInotify' => false]))->getProcess());
}
```

> 因为虚拟机中inotify无法监听到FTP/SFTP等文件上传的事件，将 disableInotify 设置为 true ，可以关闭inotify方式的热重启，使得虚拟机环境下，强制使用文件循环扫描来触发重载操作，同理 OSX 开发环境下，没有Inotify扩展，将自动使用扫描式重载
