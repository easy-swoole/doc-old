---
title: Basic development example
meta:
  - name: description
    content: EasySwoole basic development example, teach you how to implement an api interface website with easyswoole
  - name: keywords
    content: Easyswoole|swoole extension|swoole framework|php coroutine framework
---
# Basic development example
## Demo address
The base development example is open source, address: https://github.com/easy-swoole/demo/tree/3.x

## Installation
### Frame installation
- We first install the swooole extension, execute `php --ri swoole` to make sure you can see the swoole extension version is 4.4.8.
- Create a directory called `Test` and execute `composer require easyswoole/easyswoole=3.x` to introduce easyswoole
  - Execute ```php vendor/bin/easyswoole install``` to install

### Namespace registration
Edit the composer.json file in the ```Test``` root directory and add ```"App\\": "App/"```. The general structure is as follows:

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

### Post-installation directory structure

```
Test                   Project deployment directory
├─App                     Application directory
│  ├─HttpController       Controller directory (need to create it yourself)
├─Log                     Log file directory (created after startup)
├─Temp                    Temporary file directory (created after startup)
├─vendor                  Third-party class library directory
├─composer.json           Composer architecture
├─composer.lock           Composer lock
├─EasySwooleEvent.php     Framework global event
├─easyswoole              Framework management script
├─easyswoole.install      Frame installation lock file
├─dev.php                 Development configuration file
├─produce.php             Production profile
```

Execute the following command to update the namespace：
```
composer dumpautoload 
```

## Connection pool implementation
### Configuration item
In the dev.php configuration file, add the following configuration information, note: *** Please follow your own mysql server information to fill in the account password ***.
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

### Introducing the ORM library

Execute the following command to implement the introduction of the ORM library.
```
composer require easyswoole/orm
```

### Event registration

We edit the ```EasySwooleEvent.php``` file in the root directory and register the ORM connection in the ```mainServerCreate`` event. The general structure is as follows:
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/28
 * Time: 下午6:33
 */

namespace EasySwoole\EasySwoole;


use EasySwoole\EasySwoole\Swoole\EventRegister;
use EasySwoole\EasySwoole\AbstractInterface\Event;
use EasySwoole\Http\Request;
use EasySwoole\Http\Response;
use EasySwoole\ORM\Db\Connection;
use EasySwoole\ORM\DbManager;

class EasySwooleEvent implements Event
{

    public static function initialize()
    {
        // TODO: Time zone configuration
        date_default_timezone_set('Asia/Shanghai');
    }

    public static function mainServerCreate(EventRegister $register)
    {
        $config = new \EasySwoole\ORM\Db\Config(Config::getInstance()->getConf('MYSQL'));
        DbManager::getInstance()->addConnection(new Connection($config));
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

::: warning
Register the database connection pool in the initialize event, this $config can configure the connection pool size, etc.
:::


## Model definition
### Administrator model
#### Add administrator user table:  
```sql
CREATE TABLE  if not exists  `admin_list` (
  `adminId` int(11) NOT NULL AUTO_INCREMENT,
  `adminName` varchar(15) DEFAULT NULL,
  `adminAccount` varchar(18) DEFAULT NULL,
  `adminPassword` varchar(32) DEFAULT NULL,
  `adminSession` varchar(32) DEFAULT NULL,
  `adminLastLoginTime` int(11) DEFAULT NULL,
  `adminLastLoginIp` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`adminId`),
  UNIQUE KEY `adminAccount` (`adminAccount`),
  KEY `adminSession` (`adminSession`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `admin_list` VALUES ('1', 'Alan', 'xsk', 'e10adc3949ba59abbe56e057f20f883e', '', '1566279458', '192.168.159.1');

```
#### Add a model file  
Add the `App/Model/Admin/AdminModel.php` file: 

```php
<?php

namespace App\Model\Admin;

use EasySwoole\ORM\AbstractModel;

/**
 * Class AdminModel
 * Create With Automatic Generator
 * @property $adminId
 * @property $adminName
 * @property $adminAccount
 * @property $adminPassword
 * @property $adminSession
 * @property $adminLastLoginTime
 * @property $adminLastLoginIp
 */
class AdminModel extends AbstractModel
{
    protected $tableName = 'admin_list';

    protected $primaryKey = 'adminId';

    /**
     * @getAll
     * @keyword adminName
     * @param  int  page  1
     * @param  string  keyword
     * @param  int  pageSize  10
     * @return array[total,list]
     */
    public function getAll(int $page = 1, string $keyword = null, int $pageSize = 10): array
    {
        $where = [];
        if (!empty($keyword)) {
            $where['adminAccount'] = ['%' . $keyword . '%','like'];
        }
        $list = $this->limit($pageSize * ($page - 1), $pageSize)->order($this->primaryKey, 'DESC')->withTotalCount()->all($where);
        $total = $this->lastQueryResult()->getTotalCount();
        return ['total' => $total, 'list' => $list];
    }

    /*
     * After the login is successful, please return to the updated bean.
     */
    function login():?AdminModel
    {
        $info = $this->get(['adminAccount'=>$this->adminAccount,'adminPassword'=>$this->adminPassword]);
        return $info;
    }

    /*
     * Query by account
     */
    function accountExist($field='*'):?AdminModel
    {
        $info = $this->field($field)->get(['adminAccount'=>$this->adminAccount]);
        return $info;
    }

    function getOneBySession($field='*'):?AdminModel
    {
        $info = $this->field($field)->get(['adminSession'=>$this->adminSession]);
        return $info;
    }

    function logout()
    {
        return $this->update(['adminSession'=>'']);
    }

}
```

::: warning
 The definition of model can be viewed in the orm chapter
:::
::: warning
 Regarding the ide automatic prompt, as long as you add `@property $adminId` ide to the class comment above, you can automatically prompt this property of the class.
:::




### Ordinary user model
Common user model and administrator model are the same
#### Building a table
```sql
CREATE  TABLE if not exists `user_list` (
                           `userId` int(11) NOT NULL AUTO_INCREMENT,
                           `userName` varchar(32) NOT NULL,
                           `userAccount` varchar(18) NOT NULL,
                           `userPassword` varchar(32) NOT NULL,
                           `phone` varchar(18) NOT NULL,
                           `addTime` int(11) DEFAULT NULL,
                           `lastLoginIp` varchar(20) DEFAULT NULL,
                           `lastLoginTime` int(10) DEFAULT NULL,
                           `userSession` varchar(32) DEFAULT NULL,
                           `state` tinyint(2) DEFAULT NULL,
                           `money` int(10) NOT NULL DEFAULT '0' COMMENT 'User balance',
                           `frozenMoney` int(10) NOT NULL DEFAULT '0' COMMENT 'Freeze balance',
                           PRIMARY KEY (`userId`),
                           UNIQUE KEY `pk_userAccount` (`userAccount`),
                           KEY `userSession` (`userSession`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `user_list` VALUES ('1', 'Alan', 'xsk', 'e10adc3949ba59abbe56e057f20f883e', '', '1566279458', '192.168.159.1','1566279458','',1,'1','1');

```

#### Add a model file
Add the `App/Model/User/UserModel.php` file:

```php
<?php

namespace App\Model\User;

use EasySwoole\ORM\AbstractModel;

/**
 * Class UserModel
 * Create With Automatic Generator
 * @property $userId
 * @property $userName
 * @property $userAccount
 * @property $userPassword
 * @property $phone
 * @property $money
 * @property $addTime
 * @property $lastLoginIp
 * @property $lastLoginTime
 * @property $userSession
 * @property $state
 */
class UserModel extends AbstractModel
{
    protected $tableName = 'user_list';

    protected $primaryKey = 'userId';

    const STATE_PROHIBIT = 0;//Disabled state
    const STATE_NORMAL = 1;//normal status

    /**
     * @getAll
     * @keyword userName
     * @param  int  page  1
     * @param  string  keyword
     * @param  int  pageSize  10
     * @return array[total,list]
     */
    public function getAll(int $page = 1, string $keyword = null, int $pageSize = 10): array
    {
        $where = [];
        if (!empty($keyword)) {
            $where['userAccount'] = ['%' . $keyword . '%','like'];
        }
        $list = $this->limit($pageSize * ($page - 1), $pageSize)->order($this->primaryKey, 'DESC')->withTotalCount()->all($where);
        $total = $this->lastQueryResult()->getTotalCount();
        return ['total' => $total, 'list' => $list];
    }


    public function getOneByPhone($field='*'): ?UserModel
    {
        $info = $this->field($field)->get(['phone'=>$this->phone]);
        return $info;
    }

    /*
     * After the login is successful, please return to the updated bean.
     */
    function login():?UserModel
    {
        $info = $this->get(['userAccount'=>$this->userAccount,'userPassword'=>$this->userPassword]);
        return $info;
    }


    function getOneBySession($field='*'):?UserModel
    {
        $info = $this->field($field)->get(['userSession'=>$this->userSession]);
        return $info;
    }

    function logout(){
        return $this->update(['userSession'=>'']);
    }

}

```

### Banner model
#### Building a table

```sql
CREATE TABLE if not exists `banner_list` (
                             `bannerId` int(11) NOT NULL AUTO_INCREMENT,
                             `bannerName` varchar(32) DEFAULT NULL,
                             `bannerImg` varchar(255) NOT NULL COMMENT 'Banner image',
                             `bannerDescription` varchar(255) DEFAULT NULL,
                             `bannerUrl` varchar(255) DEFAULT NULL COMMENT 'Jump address',
                             `state` tinyint(3) DEFAULT NULL COMMENT 'State 0 hidden 1 normal',
                             PRIMARY KEY (`bannerId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `banner_list` VALUES ('1', 'Test banner', 'asdadsasdasd.jpg', 'Tested banner data', 'www.php20.cn',1);
```


#### Add a model file
Added `App/Model/Admin/BannerModel.php` file:  

```php
<?php

namespace App\Model\Admin;

use EasySwoole\ORM\AbstractModel;

/**
 * Class BannerModel
 * Create With Automatic Generator
 * @property $bannerId
 * @property $bannerImg
 * @property $bannerUrl
 * @property $state
 */
class BannerModel extends AbstractModel
{
    protected $tableName = 'banner_list';

    protected $primaryKey = 'bannerId';

    public function getAll(int $page = 1,int $state=1, string $keyword = null, int $pageSize = 10): array
    {
        $where = [];
        if (!empty($keyword)) {
            $where['bannerUrl'] = ['%' . $keyword . '%','like'];
        }
        $where['state'] = $state;
        $list = $this->limit($pageSize * ($page - 1), $pageSize)->order($this->primaryKey, 'DESC')->withTotalCount()->all($where);
        $total = $this->lastQueryResult()->getTotalCount();
        return ['total' => $total, 'list' => $list];
    }
}
```

## Controller definition

### Global base controller definition
Add the `App/Httpcontroller/BaseController` file:

```php
<?php
namespace App\HttpController;


use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\Http\AbstractInterface\AnnotationController;

class BaseController extends AnnotationController
{

    function index()
    {
        $this->actionNotFound('index');
    }

    /**
     * Get the user's real IP
     * @param string $headerName The header name passed by the proxy server
     * @return string
     */
    protected function clientRealIP($headerName = 'x-real-ip')
    {
        $server = ServerManager::getInstance()->getSwooleServer();
        $client = $server->getClientInfo($this->request()->getSwooleRequest()->fd);
        $clientAddress = $client['remote_ip'];
        $xri = $this->request()->getHeader($headerName);
        $xff = $this->request()->getHeader('x-forwarded-for');
        if ($clientAddress === '127.0.0.1') {
            if (!empty($xri)) {  // If there is xri, it is judged that the front end has an agent such as NGINX.
                $clientAddress = $xri[0];
            } elseif (!empty($xff)) {  // If there is no xri, continue to judge xff
                $list = explode(',', $xff[0]);
                if (isset($list[0])) $clientAddress = $list[0];
            }
        }
        return $clientAddress;
    }

    protected function input($name, $default = null) {
        $value = $this->request()->getRequestParam($name);
        return $value ?? $default;
    }
}
```


::: warning
 New base controller, the method inside is used to get user ip, and get api parameters  
:::

::: warning
 The base controller inherits `EasySwoole\Http\AbstractInterface\AnnotationController`, this is an annotation support controller, which can be viewed in the annotation section.
:::


### Api base controller definition
Added `App/Httpcontroller/Api/ApiBase.php` file:
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/29 0029
 * Time: 10:45
 */

namespace App\HttpController\Api;


use App\HttpController\BaseController;
use EasySwoole\EasySwoole\Core;
use EasySwoole\EasySwoole\Trigger;
use EasySwoole\Http\Exception\ParamAnnotationValidateError;
use EasySwoole\Http\Message\Status;

abstract class ApiBase extends BaseController
{
    function index()
    {
        // TODO: Implement index() method.
        $this->actionNotFound('index');
    }

    protected function actionNotFound(?string $action): void
    {
        $this->writeJson(Status::CODE_NOT_FOUND);
    }

    function onRequest(?string $action): ?bool
    {
        if (!parent::onRequest($action)) {
            return false;
        };
        return true;
    }

    protected function onException(\Throwable $throwable): void
    {
        if ($throwable instanceof ParamAnnotationValidateError) {
            $msg = $throwable->getValidate()->getError()->getErrorRuleMsg();
            $this->writeJson(400, null, "{$msg}");
        } else {
            if (Core::getInstance()->isDev()) {
                $this->writeJson(500, null, $throwable->getMessage());
            } else {
                Trigger::getInstance()->throwable($throwable);
                $this->writeJson(500, null, 'Internal system error, please try again later');
            }
        }
    }
}
```

::: warning
 Api base class controller for intercepting annotation exceptions and api exceptions, returning a json format error message to the user
:::



### Common base controller definition
Added `App/Httpcontroller/Api/Common/CommonBase.php` file: 

```php
<?php
namespace App\HttpController\Api\Common;

use App\HttpController\Api\ApiBase;

class CommonBase extends ApiBase
{
}
```


### Public controller
The public controller puts the controller that can be viewed without logging in, such as the banner list view: 

#### Added `App/HttpController/Api/Common/Banner.php` file:
```php
<?php

namespace App\HttpController\Api\Common;

use App\Model\Admin\BannerBean;
use App\Model\Admin\BannerModel;
use EasySwoole\Http\Annotation\Param;
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Validate\Validate;

/**
 * Class Banner
 * Create With Automatic Generator
 */
class Banner extends CommonBase
{

    /**
     * getOne
     * @Param(name="bannerId", alias="Primary key id", required="", integer="")
     * @throws \EasySwoole\ORM\Exception\Exception
     * @throws \Throwable
     * @author Tioncico
     * Time: 14:03
     */
    public function getOne()
	{
		$param = $this->request()->getRequestParam();
		$model = new BannerModel();
		$model->bannerId = $param['bannerId'];
		$bean = $model->get();
		if ($bean) {
		    $this->writeJson(Status::CODE_OK, $bean, "success");
		} else {
		    $this->writeJson(Status::CODE_BAD_REQUEST, [], 'fail');
		}
	}

    /**
     * getAll
     * @Param(name="page", alias="Number of pages", optional="", integer="")
     * @Param(name="limit", alias="Total number of pages", optional="", integer="")
     * @Param(name="keyword", alias="Keyword", optional="", lengthMax="32")
     * @author Tioncico
     * Time: 14:02
     */
    public function getAll()
	{
        $param = $this->request()->getRequestParam();
		$page = $param['page']??1;
		$limit = $param['limit']??20;
		$model = new BannerModel();
		$data = $model->getAll($page, 1,$param['keyword']??null, $limit);
		$this->writeJson(Status::CODE_OK, $data, 'success');
	}
}
```


::: warning 
 It can be seen that in the getAll method, there is a comment of `@Param(name="page", alias="page number", optional="", integer="")`, this is an annotation support writing method, and can be written. Can not write, after writing this comment, will constrain the page parameter must be int, the specific verification mechanism can be viewed [validate validator](../HttpServer/validate.md)
:::

::: warning
Test link: 127.0.0.1:9501/api/common/banner/getAll
:::


::: warning 
 Need to have data to see the specific output
:::



### Administrator base controller definition
Add the `App/HttpController/Api/Admin/AdminBase.php` file: 

 
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/10/26
 * Time: 5:39 PM
 */

namespace App\HttpController\Api\Admin;

use App\HttpController\Api\ApiBase;
use App\Model\Admin\AdminModel;
use EasySwoole\Http\Message\Status;

class AdminBase extends ApiBase
{
    //Public will be cleared according to the coroutine
    public $who;
    //Session cookie header
    protected $sessionKey = 'adminSession';
    //whitelist
    protected $whiteList = [];

    /**
     * onRequest
     * @param null|string $action
     * @return bool|null
     * @throws \Throwable
     * @author yangzhenyu
     * Time: 13:49
     */
    function onRequest(?string $action): ?bool
    {
        if (parent::onRequest($action)) {
            //White list judgment
            if (in_array($action, $this->whiteList)) {
                return true;
            }
            //Get login information
            if (!$this->getWho()) {
                $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'Login has expired');
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * getWho
     * @return null|AdminModel
     * @author yangzhenyu
     * Time: 13:51
     */
    function getWho(): ?AdminModel
    {
        if ($this->who instanceof AdminModel) {
            return $this->who;
        }
        $sessionKey = $this->request()->getRequestParam($this->sessionKey);
        if (empty($sessionKey)) {
            $sessionKey = $this->request()->getCookieParams($this->sessionKey);
        }
        if (empty($sessionKey)) {
            return null;
        }
        $adminModel = new AdminModel();
        $adminModel->adminSession = $sessionKey;
        $this->who = $adminModel->getOneBySession();
        return $this->who;
    }
}

```

### Administrator login controller
Added `App/HttpController/Api/Admin/Auth.php` file:   
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/10/26
 * Time: 5:39 PM
 */

namespace App\HttpController\Api\Admin;

use App\Model\Admin\AdminModel;
use EasySwoole\Http\Annotation\Param;
use EasySwoole\Http\Message\Status;

class Auth extends AdminBase
{
    protected $whiteList=['login'];


    /**
     * login
     * Login, parameter verification annotation
     * @Param(name="account", alias="account number", required="", lengthMax="20")
     * @Param(name="password", alias="password", required="", lengthMin="6", lengthMax="16")
     * @throws \EasySwoole\ORM\Exception\Exception
     * @throws \Throwable
     * @author Tioncico
     * Time: 10:18
     */
    function login()
    {
        $param = $this->request()->getRequestParam();
        $model = new AdminModel();
        $model->adminAccount = $param['account'];
        $model->adminPassword = md5($param['password']);

        if ($user = $model->login()) {
            $sessionHash = md5(time() . $user->adminId);
            $user->update([
                'adminLastLoginTime' => time(),
                'adminLastLoginIp'   => $this->clientRealIP(),
                'adminSession'       => $sessionHash
            ]);

            $rs = $user->toArray();
            unset($rs['adminPassword']);
            $rs['adminSession'] = $sessionHash;
            $this->response()->setCookie('adminSession', $sessionHash, time() + 3600, '/');
            $this->writeJson(Status::CODE_OK, $rs);
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, '', 'wrong password');
        }

    }

    /**
     * logout
     * Logout, parameter annotation
     * @Param(name="adminSession", from={COOKIE}, required="")
     * @return bool
     * @author Tioncico
     * Time: 10:23
     */
    function logout()
    {
        $sessionKey = $this->request()->getRequestParam($this->sessionKey);
        if (empty($sessionKey)) {
            $sessionKey = $this->request()->getCookieParams('adminSession');
        }
        if (empty($sessionKey)) {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'Not logged in');
            return false;
        }
        $result = $this->getWho()->logout();
        if ($result) {
            $this->writeJson(Status::CODE_OK, '', "exit successfully");
        } else {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'fail');
        }
    }

    function getInfo()
    {
        $this->writeJson(200, $this->getWho()->toArray(), 'success');
    }
}
```

::: warning
 It can be seen that in the getAll method, there is a comment of `@Param(name="account", alias="account", required="", lengthMax="20")`, this is an annotation support writing method, and can be written as well. Can not write, after writing this comment, will constrain the page parameter must be int, the specific verification mechanism can be viewed [validate validator](../HttpServer/validate.md)
:::

::: warning 
Request 127.0.0.1:9501/Api/Admin/Auth/login?account=xsk&password=123456 to return:
:::

```
{
    "code": 200,
    "result": {
        "adminId": 1,
        "adminName": "Alan",
        "adminAccount": "xsk",
        "adminSession": "d45de0cd6dd91122db4bd7e976c7deb8",
        "adminLastLoginTime": 1566279458,
        "adminLastLoginIp": "192.168.159.1"
    },
    "msg": null
}
```

### Administrator user management controller
Add the `App/httpController/Api/Admin/User.php` file:


```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/10/26
 * Time: 5:39 PM
 */

namespace App\HttpController\Api\Admin;

use App\Model\User\UserBean;
use App\Model\User\UserModel;
use EasySwoole\Http\Annotation\Param;
use EasySwoole\Http\Message\Status;
use EasySwoole\Validate\Validate;

class User extends AdminBase
{
    /**
     * getAll
     * @Param(name="page", alias="Number of pages", optional="", integer="")
     * @Param(name="limit", alias="Total number of pages", optional="", integer="")
     * @Param(name="keyword", alias="Keyword", optional="", lengthMax="32")
     * @author Tioncico
     * Time: 14:01
     */
    function getAll()
    {
        $page = (int)$this->input('page', 1);
        $limit = (int)$this->input('limit', 20);
        $model = new UserModel();
        $data = $model->getAll($page, $this->input('keyword'), $limit);
        $this->writeJson(Status::CODE_OK, $data, 'success');
    }


    /**
     * getOne
     * @Param(name="userId", alias="User id", required="", integer="")
     * @throws \EasySwoole\ORM\Exception\Exception
     * @throws \Throwable
     * @author Tioncico
     * Time: 11:48
     */
    function getOne()
    {
        $param = $this->request()->getRequestParam();
        $model = new UserModel();
        $model->userId = $param['userId'];
        $rs = $model->get();
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], 'fail');
        }

    }

    /**
     * add
     * @Param(name="userName", alias="User's Nickname", optional="", lengthMax="32")
     * @Param(name="userAccount", alias="username", required="", lengthMax="32")
     * @Param(name="userPassword", alias="user password", required="", lengthMin="6",lengthMax="18")
     * @Param(name="phone", alias="cellphone number", optional="", lengthMax="18",numeric="")
     * @Param(name="state", alias="user status", optional="", inArray="{0,1}")
     * @author Tioncico
     * Time: 11:48
     */
    function add()
    {
        $param = $this->request()->getRequestParam();
        $model = new UserModel($param);
        $model->userPassword = md5($param['userPassword']);
        $rs = $model->save();
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], $model->lastQueryResult()->getLastError());
        }
    }

    /**
     * update
     * @Param(name="userId", alias="User id", required="", integer="")
     * @Param(name="userPassword", alias="member password", optional="", lengthMin="6",lengthMax="18")
     * @Param(name="userName", alias="Member name", optional="",  lengthMax="32")
     * @Param(name="state", alias="status", optional="", inArray="{0,1}")
     * @Param(name="phone", alias="phone number", optional="",  lengthMax="18")
     * @throws \EasySwoole\ORM\Exception\Exception
     * @throws \Throwable
     * @author Tioncico
     * Time: 11:54
     */
    function update()
    {
        $model = new UserModel();
        $model->userId = $this->input('userId');
        /**
         * @var $userInfo UserModel
         */
        $userInfo = $model->get();
        if (!$userInfo) {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], 'This member was not found');
        }
        $password = $this->input('userPassword');
        $update = [
          'userName'=>$this->input('userName', $userInfo->userName),
          'userPassword'=>$password ? md5($password) : $userInfo->userPassword,
          'state'=>$this->input('state', $userInfo->state),
          'phone'=>$this->input('phone', $userInfo->phone),
        ];

        $rs = $model->update($update);
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], $model->lastQueryResult()->getLastError());
        }

    }

    /**
     * delete
     * @Param(name="userId", alias="User id", required="", integer="")
     * @throws \EasySwoole\ORM\Exception\Exception
     * @throws \Throwable
     * @author Tioncico
     * Time: 14:02
     */
    function delete()
    {
        $param = $this->request()->getRequestParam();
        $model = new UserModel();
        $model->userId = $param['userId'];
        $rs = $model->destroy();
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], 'failed to delete');
        }

    }
}
```



::: warning 
After the background administrator logs in, you can use the interface of this file to perform the curd member.  
:::


::: warning 
 The request address is: 127.0.0.1:9501/Api/Admin/User/getAll (etc.)  
:::


### Normal user base controller definition  
Added `App/HttpController/Api/User/UserBase.php` file:  

```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/10/26
 * Time: 5:39 PM
 */

namespace App\HttpController\Api\User;

use App\HttpController\Api\ApiBase;
use App\Model\User\UserBean;
use App\Model\User\UserModel;
use App\Utility\Pool\MysqlPool;
use App\Utility\Pool\RedisPool;
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Spl\SplBean;
use EasySwoole\Validate\Validate;

class UserBase extends ApiBase
{
    protected $who;
    //Session cookie header
    protected $sessionKey = 'userSession';
    //whitelist
    protected $whiteList = ['login', 'register'];

    /**
     * onRequest
     * @param null|string $action
     * @return bool|null
     * @throws \Throwable
     * @author yangzhenyu
     * Time: 13:49
     */
    function onRequest(?string $action): ?bool
    {
        if (parent::onRequest($action)) {
            //White list judgment
            if (in_array($action, $this->whiteList)) {
                return true;
            }
            //Get login information
            if (!$data = $this->getWho()) {
                $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'Login has expired');
                return false;
            }
            //Refresh cookie survival
            $this->response()->setCookie($this->sessionKey, $data->getUserSession(), time() + 3600, '/');

            return true;
        }
        return false;
    }

    /**
     * getWho
     * @author yangzhenyu
     * Time: 13:51
     */
    function getWho(): ?UserModel
    {
        if ($this->who instanceof UserModel) {
            return $this->who;
        }
        $sessionKey = $this->request()->getRequestParam($this->sessionKey);
        if (empty($sessionKey)) {
            $sessionKey = $this->request()->getCookieParams($this->sessionKey);
        }
        if (empty($sessionKey)) {
            return null;
        }
        $userModel = new UserModel();
        $userModel->userSession = $sessionKey;
        $this->who = $userModel->getOneBySession();
        return $this->who;
    }
}
```

### Ordinary user login controller


Added `App/HttpController/Api/User/Auth.php` file:   


```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2019-04-02
 * Time: 13:03
 */

namespace App\HttpController\Api\User;

use App\Model\User\UserBean;
use App\Model\User\UserModel;
use App\Service\Common\VerifyService;
use App\Utility\Pool\MysqlPool;
use App\Utility\SwooleApi\User\Login;
use EasySwoole\Http\Annotation\Param;
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Spl\SplBean;
use EasySwoole\Validate\Validate;

class Auth extends UserBase
{
    protected $whiteList = ['login', 'register'];

    /**
     * login
     * @Param(name="userAccount", alias="username", required="", lengthMax="32")
     * @Param(name="userPassword", alias="password", required="", lengthMin="6",lengthMax="18")
     * @throws \EasySwoole\ORM\Exception\Exception
     * @throws \Throwable
     * @author Tioncico
     * Time: 15:06
     */
    function login()
    {
        $param = $this->request()->getRequestParam();
        $model = new UserModel();
        $model->userAccount = $param['userAccount'];
        $model->userPassword = md5($param['userPassword']);

        if ($userInfo = $model->login()) {
            $sessionHash = md5(time() . $userInfo->userId);
            $userInfo->update([
                'lastLoginIp'   => $this->clientRealIP(),
                'lastLoginTime' => time(),
                'userSession'   => $sessionHash
            ]);
            $rs = $userInfo->toArray();
            unset($rs['userPassword']);
            $rs['userSession'] = $sessionHash;
            $this->response()->setCookie('userSession', $sessionHash, time() + 3600, '/');
            $this->writeJson(Status::CODE_OK, $rs);
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, '', 'wrong password');
        }
    }


    function logout()
    {
        $sessionKey = $this->request()->getRequestParam('userSession');
        if (empty($sessionKey)) {
            $sessionKey = $this->request()->getCookieParams('userSession');
        }
        if (empty($sessionKey)) {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'Not signed');
            return false;
        }
        $result = $this->getWho()->logout();
        if ($result) {
            $this->writeJson(Status::CODE_OK, '', "Logout success");
        } else {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'fail');
        }
    }


    function getInfo()
    {
        $this->writeJson(200, $this->getWho(), 'success');
    }
}
```
You can log in successfully by accessing 127.0.0.1:9501/Api/User/Auth/login?userAccount=xsk&userPassword=123456



::: warning
Administrator login: 127.0.0.1:9501/Api/Admin/Auth/login?account=xsk&password=123456
Public request banner:127.0.0.1:9501/Api/Common/Banner/getAll
Member login: 127.0.0.1:9501/Api/User/Auth/login?userAccount=xsk&userPassword=123456
:::