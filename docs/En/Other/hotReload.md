---
title: Service hot restart
meta:
  - name: description
    content: Easyswoole, service hot restart
  - name: keywords
    content: Easyswoole|service hot restart
---
## Service hot restart

Due to the characteristics of `swoole` resident memory, after modifying the file, you need to restart the worker process to reload the modified file into memory. We can customize the process to implement file change and automatically perform service overloading.

## Hot overload process

Create a new file `App/Process/HotReload.php` and add the following content, or you can put it in another location, please correspond to the namespace.

```php
<?php
/**
 * Created by PhpStorm.
 * User: evalor
 * Date: 2018-11-26
 * Time: 23:18
 */

namespace App\Process;

use EasySwoole\Component\Process\AbstractProcess;
use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\Utility\File;
use Swoole\Process;
use Swoole\Table;
use Swoole\Timer;

/**
 * Violent hot overload
 * Class HotReload
 * @package App\Process
 */
class HotReload extends AbstractProcess
{
    /** @var \swoole_table $table */
    protected $table;
    protected $isReady = false;

    protected $monitorDir; // Directory to be monitored
    protected $monitorExt; // Suffix to be monitored

    /**
     * Start timer for cyclic scan
     */
    public function run($arg)
    {
        // Specify the directory to be monitored here. It is recommended to only monitor file changes in the App directory.
        $this->monitorDir = !empty($arg['monitorDir']) ? $arg['monitorDir'] : EASYSWOOLE_ROOT . '/App';

        // Specify the extension to be monitored, not the file of the specified type, ignore the change, do not restart
        $this->monitorExt = !empty($arg['monitorExt']) && is_array($arg['monitorExt']) ? $arg['monitorExt'] : ['php'];

        if (extension_loaded('inotify') && empty($arg['disableInotify'])) {
            // Extension available, prioritize processing with extensions
            $this->registerInotifyEvent();
            echo "server hot reload start : use inotify\n";
        } else {
            // Violent scanning when extensions are not available
            $this->table = new Table(512);
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
     * Scan file change
     */
    private function runComparison()
    {
        $startTime = microtime(true);
        $doReload = false;

        $dirIterator = new \RecursiveDirectoryIterator($this->monitorDir);
        $iterator = new \RecursiveIteratorIterator($dirIterator);
        $inodeList = array();

        // Iterate through the directory of all files for inspection
        foreach ($iterator as $file) {
            /** @var \SplFileInfo $file */
            $ext = $file->getExtension();
            if (!in_array($ext, $this->monitorExt)) {
                continue; // Check only the specified type
            } else {
                // Since the file name is modified and does not need to be reloaded, it can be monitored based on the inode
                $inode = $file->getInode();
                $mtime = $file->getMTime();
                array_push($inodeList, $inode);
                if (!$this->table->exist($inode)) {
                    // New file or modified file, changed inode
                    $this->table->set($inode, ['mtime' => $mtime]);
                    $doReload = true;
                } else {
                    // Modify the file, but no inode changes have occurred
                    $oldTime = $this->table->get($inode)['mtime'];
                    if ($oldTime != $mtime) {
                        $this->table->set($inode, ['mtime' => $mtime]);
                        $doReload = true;
                    }
                }
            }
        }

        foreach ($this->table as $inode => $value) {
            // Iterating over the table to find the inode that needs to be deleted
            if (!in_array(intval($inode), $inodeList)) {
                $this->table->del($inode);
                $doReload = true;
            }
        }

        if ($doReload) {
            $count = $this->table->count();
            $time = date('Y-m-d H:i:s');
            $usage = round(microtime(true) - $startTime, 3);
            if (!$this->isReady == false) {
                // It is monitored that a hot restart is required
                echo "severReload at {$time} use : {$usage} s total: {$count} files\n";
                ServerManager::getInstance()->getSwooleServer()->reload();
            } else {
                // The first scan does not require a reboot
                echo "hot reload ready at {$time} use : {$usage} s total: {$count} files\n";
                $this->isReady = true;
            }
        }
    }

    /**
     * Register the Inotify listen event
     */
    private function registerInotifyEvent()
    {
        // Because the process is independent and is currently a custom process, global variables are only used by the process.
        // In the case of determining that it will not cause pollution, it is also possible to use global variables reasonably.
        global $lastReloadTime;
        global $inotifyResource;

        $lastReloadTime = 0;
        $files = File::scanDirectory(EASYSWOOLE_ROOT . '/App');
        $files = array_merge($files['files'], $files['dirs']);

        $inotifyResource = inotify_init();

        // Add event listeners for all current directories and files
        foreach ($files as $item) {
            inotify_add_watch($inotifyResource, $item, IN_CREATE | IN_DELETE | IN_MODIFY);
        }

        // Join the event loop
        swoole_event_add($inotifyResource, function () {
            global $lastReloadTime;
            global $inotifyResource;
            $events = inotify_read($inotifyResource);
            if ($lastReloadTime < time() && !empty($events)) { // Repetitive reload cannot be performed within 1s
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

After adding it, register the custom process in the global `EasySwooleEvent.php`

```php
public static function mainServerCreate(EventRegister $register)
{
    $swooleServer = ServerManager::getInstance()->getSwooleServer();
    $swooleServer->addProcess((new HotReload('HotReload', ['disableInotify' => false]))->getProcess());
}
```

::: warning 
Because inotify in the virtual machine cannot monitor the file uploading events such as FTP/SFTP, set disableInotify to true, you can disable the hot restart of inotify mode, so that the virtual machine environment will force the file loop scan to trigger the overload operation. In the OSX development environment, there is no Inotify extension, which will automatically use scan overloading.
:::
