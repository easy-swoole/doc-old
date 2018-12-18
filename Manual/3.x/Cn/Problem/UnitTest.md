# 单元测试（[demo例子](https://github.com/easy-swoole/demo/tree/3.x/PhpUnit/UserModelTest.php)）

单元测试是对单独的代码对象进行测试的过程，比如对函数、类、方法进行测试。如何用EasySwoole框架进行单元测试？

#### Composer 安装

```
composer require phpunit/phpunit
```

### 测试用例

文中采用修改用户名称的例子，在根目录下创建PhpUnit目录并创建一个测试用例类。

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-13
 * Time: 上午10:04
 */

namespace PhpUnit;


use App\Model\User\UserBean;
use App\Model\User\UserModel;
use App\Utility\Pool\MysqlPool;
use EasySwoole\Component\Pool\PoolManager;
use PHPUnit\Framework\TestCase;

class UserModelTest extends TestCase
{

    function testUpdateUserName() {
        $db = PoolManager::getInstance()->getPool(MysqlPool::class)->getObj();
        if ($db) {
            $userModel = new UserModel($db);
            $userBean = new UserBean(['id' => 3]);
            // 获取更新前user信息
            $originUser = $userModel->getOne($userBean);
            if (!empty($originUser)) {
                // 获取更新前user名字
                $originName = $originUser->getName();
                $name = '王丽';
                $userModel->update($userBean, ['name' => $name]);
                $currentUser = $userModel->getOne($userBean);
                if (!empty($currentUser)) {

                    // 名字是否被更新
                    $this->assertEquals($name, $currentUser->getName());
                    $user = $currentUser;
                    $user->setName($originName);
                    $this->assertEquals(json_encode($user), json_encode($originUser));
                } else {
                    PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
                    throw new \PHPUnit\Framework\Exception('can not find this people', 400);
                }
            } else {
                PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
                throw new \PHPUnit\Framework\Exception('can not find this people', 400);
            }
        } else {
            PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
            throw new \PHPUnit\Framework\Exception('db pool is empty', 400);
        }
        PoolManager::getInstance()->getPool(MysqlPool::class)->recycleObj($db);
    }
}
```

记得在composer.json里面注入PhpUnit命名空间。

```json
{
    "name": "easyswoole/demo",
    "autoload": {
        "psr-4": {
            "App\\": "App/",
            "PhpUnit\\": "PhpUnit/"
        }
    }
}
```
执行一下composer dump-autoload更新一下目录和命名空间之间的映射。

```
composer dump-autoload
```

连接池必须在协程中使用，在根目录下新建phpUnit.php

```php
<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 18-11-14
 * Time: 上午10:37
 */

require_once "./vendor/autoload.php";

go(function() {
    \EasySwoole\EasySwoole\Core::getInstance()->initialize();
    require_once "./vendor/bin/phpunit";
});
```

执行``` php phpUnit.php PhpUnit/UserModelTest.php  ```

最终结果：

```
#!/usr/bin/env php
PHPUnit 7.4.3 by Sebastian Bergmann and contributors.

.                                                                   1 / 1 (100%)

Time: 70 ms, Memory: 4.00MB

OK (1 test, 2 assertions)

```


