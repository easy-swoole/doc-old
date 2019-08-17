# 基础开发示例

## 安装
### 框架安装
- 我们先安装好swooole拓展，执行 ```php --ri swoole``` 确保可以看到swoole拓展最版本为4.4.3 
- 建立一个目录，名为```Test```,执行```composer require easyswoole/easyswoole=3.x``` 引入easyswoole
- 执行```php vendor/bin/easyswoole install``` 进行安装

### 命名空间注册
编辑```Test```根目录下的 composer.json 文件，加入```"App\\": "App/"``` ，大体结构如下：

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "App/"
        }
    },
    "require": {
        "easyswoole/easyswoole": "3.x"
    }
}
```

### 安装后目录结构

```
Test                   项目部署目录
├─App                     应用目录
│  ├─HttpController       控制器目录(需要自己创建)
├─Log                     日志文件目录（启动后创建）
├─Temp                    临时文件目录（启动后创建）
├─vendor                  第三方类库目录
├─composer.json           Composer架构
├─composer.lock           Composer锁定
├─EasySwooleEvent.php     框架全局事件
├─easyswoole              框架管理脚本
├─easyswoole.install      框架安装锁定文件
├─dev.php                 开发配置文件
├─produce.php             生产配置文件
```

执行以下命令进行名称空间的更新：
```
composer dumpautoload 
```

## 连接池实现
### 配置项
我们在dev.php 配置文件中，加入以下配置信息，注意：***请跟进自己的mysql服务器信息填写账户密码***。
```php
 'MYSQL'  => [
        'host'          => '',
        'port'          => 3300,
        'user'          => '',
        'password'      => '',
        'database'      => '',
        'timeout'       => 5,
        'charset'       => 'utf8mb4',
 ]
```

### 引入Mysqli库

执行以下命令用于实现Mysqli库的引入
```
composer require easyswoole/mysqli
```

### 定义连接对象
```php
namespace App\Utility\Pool;


use EasySwoole\Component\Pool\PoolObjectInterface;
use EasySwoole\Mysqli\Mysqli;

class MysqlConnection extends Mysqli implements PoolObjectInterface
{

    function gc()
    {
        $this->resetDbStatus();
        $this->getMysqlClient()->close();
    }

    function objectRestore()
    {
        $this->resetDbStatus();
    }

    function beforeUse(): bool
    {
        return $this->getMysqlClient()->connected;
    }
}
```

> 注意，请自己建立 ```Test/App/Utility/Pool``` 这个目录

### 定义连接池

```
namespace App\Utility\Pool;


use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\EasySwoole\Config;

class MysqlPool extends AbstractPool
{

    protected function createObject()
    {
        // TODO: Implement createObject() method.
        $conf = Config::getInstance()->getConf('MYSQL');
        $dbConf = new \EasySwoole\Mysqli\Config($conf);
        return new MysqlConnection($dbConf);
    }
}
```

> 注意，请自己建立 ```Test/App/Utility/Pool``` 这个目录

### 事件注册

我们编辑根目录下的```EasySwooleEvent.php```文件，在```mainServerCreate```事件中进行连接池的注册，大体结构如下：

```php

namespace EasySwoole\EasySwoole;

use App\Utility\Pool\MysqlPool;
use EasySwoole\Component\Context\ContextManager;
use EasySwoole\Component\Pool\PoolManager;
use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Implement initialize() method.
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        /**
         * **************** 连接池注册 **********************
         */
        PoolManager::getInstance()->register(MysqlPool::class, Config::getInstance()->getConf('MYSQL.POOL_MAX_NUM'));
    }

    public static function onRequest(Request $request, Response $response): bool
    {
        // TODO: Implement onRequest() method.
        return true;
    }

    public static function afterRequest(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}
```

## 模型定义
### 基础模型定义
### 管理员模型
### 普通用户模型
### 公告模型

## 控制器定义
### 公共基础控制器定义
### 公共控制器
### 管理员基础控制器定义
### 管理员登录控制器
### 管理员用户管理控制器
### 普通用户基础控制器定义
### 普通用户登录控制器