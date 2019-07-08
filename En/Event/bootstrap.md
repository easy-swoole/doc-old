# Bootstrap Event

If you want to do something before `EasySwoole` framework is initialized, you could put a `bootstrap.php` file in the application root folder. 
In class `EasySwoole\EasySwoole\Core`:
```php
function __construct()
{
    defined('SWOOLE_VERSION') or define('SWOOLE_VERSION',intval(phpversion('swoole')));
    defined('EASYSWOOLE_ROOT') or define('EASYSWOOLE_ROOT', realpath(getcwd()));
    defined('EASYSWOOLE_SERVER') or define('EASYSWOOLE_SERVER',1);
    defined('EASYSWOOLE_WEB_SERVER') or define('EASYSWOOLE_WEB_SERVER',2);
    defined('EASYSWOOLE_WEB_SOCKET_SERVER') or define('EASYSWOOLE_WEB_SOCKET_SERVER',3);
    defined('EASYSWOOLE_REDIS_SERVER') or define('EASYSWOOLE_REDIS_SERVER',4);
    /*
     * The boostrap.php file will be executed
     */
    if(file_exists(EASYSWOOLE_ROOT.'/bootstrap.php')){
        require_once EASYSWOOLE_ROOT.'/bootstrap.php';
    }
}
```