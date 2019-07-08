# bootstrap事件

bootstrap 允许在 框架未初始化之前,允许其他初始化业务
EasySwoole\EasySwoole\Core实现代码:
````php
function __construct()
{
    defined('SWOOLE_VERSION') or define('SWOOLE_VERSION',intval(phpversion('swoole')));
    defined('EASYSWOOLE_ROOT') or define('EASYSWOOLE_ROOT', realpath(getcwd()));
    defined('EASYSWOOLE_SERVER') or define('EASYSWOOLE_SERVER',1);
    defined('EASYSWOOLE_WEB_SERVER') or define('EASYSWOOLE_WEB_SERVER',2);
    defined('EASYSWOOLE_WEB_SOCKET_SERVER') or define('EASYSWOOLE_WEB_SOCKET_SERVER',3);
    defined('EASYSWOOLE_REDIS_SERVER') or define('EASYSWOOLE_REDIS_SERVER',4);
    /*
     * 可以在外部做最高一层级的hook
     */
    if(file_exists(EASYSWOOLE_ROOT.'/bootstrap.php')){
        require_once EASYSWOOLE_ROOT.'/bootstrap.php';
    }
}
````

