---
title: 配置文件
meta:
  - name: description
    content: EasySwoole基础开发示例,手把手教你怎么用easyswoole实现一个api接口网站
  - name: keywords
    content: easyswoole|swoole 扩展|swoole框架|php协程框架
---
# 基础开发示例
## demo地址
基础开发示例已经开源,地址:https://github.com/easy-swoole/demo/tree/3.x

## 安装
### 框架安装
- 我们先安装好swooole拓展，执行 `php --ri swoole` 确保可以看到swoole拓展最版本为4.4.8
- 建立一个目录，名为 `Test` ,执行 `composer require easyswoole/easyswoole=3.x` 引入easyswoole
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

### 引入ORM库

执行以下命令用于实现ORM库的引入
```
composer require easyswoole/orm
```

### 事件注册

我们编辑根目录下的```EasySwooleEvent.php```文件，在```mainServerCreate```事件中进行ORM的连接注册，大体结构如下：
```php
<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/5/28
 * Time: 下午6:33
 */

namespace EasySwoole\EasySwoole;


use EasySwoole\Component\Timer;
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

        $config = new \EasySwoole\ORM\Db\Config(Config::getInstance()->getConf('MYSQL'));
        DbManager::getInstance()->addConnection(new Connection($config));
    }

    public static function mainServerCreate(EventRegister $register)
    {
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
在initialize事件中注册数据库连接池,这个$config可同时配置连接池大小等
:::


## 模型定义
### 管理员模型
#### 新增管理员用户表:  
```sql
CREATE TABLE `admin_list` (
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

INSERT INTO `admin_list` VALUES ('1', '仙士可', 'xsk', 'e10adc3949ba59abbe56e057f20f883e', '', '1566279458', '192.168.159.1');

```
#### 新增model文件  
新增 `App/Model/Admin/AdminModel.php`文件:  

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
     * 登录成功后请返回更新后的bean
     */
    function login():?AdminModel
    {
        $info = $this->get(['adminAccount'=>$this->adminAccount,'adminPassword'=>$this->adminPassword]);
        return $info;
    }

    /*
     * 以account进行查询
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
 model的定义可查看orm章节
:::
::: warning
 关于ide自动提示,只要你在类上面注释中加上`@property $adminId` ide就可以自动提示类的这个属性
:::




### 普通用户模型
普通用户模型和管理员模型同理
#### 建表
```sql
CREATE TABLE `user_list` (
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
  `money` int(10) NOT NULL DEFAULT '0' COMMENT '用户余额',
  `frozenMoney` int(10) NOT NULL DEFAULT '0' COMMENT '冻结余额',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `pk_userAccount` (`userAccount`),
  KEY `userSession` (`userSession`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

```

#### 新增model文件
新增 `App/Model/User/UserModel.php` 文件:  

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

    const STATE_PROHIBIT = 0;//禁用状态
    const STATE_NORMAL = 1;//正常状态

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
     * 登录成功后请返回更新后的bean
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

### banner模型
#### 建表

```sql
CREATE TABLE `banner_list` (
  `bannerId` int(11) NOT NULL AUTO_INCREMENT,
  `bannerName` varchar(32) DEFAULT NULL,
  `bannerImg` varchar(255) NOT NULL COMMENT 'banner图片',
  `bannerDescription` varchar(255) DEFAULT NULL,
  `bannerUrl` varchar(255) DEFAULT NULL COMMENT '跳转地址',
  `state` tinyint(3) DEFAULT NULL COMMENT '状态0隐藏 1正常',
  PRIMARY KEY (`bannerId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
```


#### 新增model文件
新增 `App/Model/Admin/BannerModel.php` 文件:  

```php
<?php
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

## 控制器定义

### 全局基础控制器定义
新增 `App/Httpcontroller/BaseController` 文件:

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
     * 获取用户的真实IP
     * @param string $headerName 代理服务器传递的标头名称
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
            if (!empty($xri)) {  // 如果有xri 则判定为前端有NGINX等代理
                $clientAddress = $xri[0];
            } elseif (!empty($xff)) {  // 如果不存在xri 则继续判断xff
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
 新增基础控制器,里面的方法用于获取用户ip,以及获取api参数  
:::

::: warning
 基础控制器继承了`EasySwoole\Http\AbstractInterface\AnnotationController`,这个是注解支持控制器,可查看注解章节
:::


### api基础控制器定义
新增 `App/Httpcontroller/Api/ApiBase.php` 文件:
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
                $this->writeJson(500, null, '系统内部错误，请稍后重试');
            }
        }
    }
}
```

::: warning
 api基类控制器,用于拦截注解异常,以及api异常,给用户返回一个json格式错误信息
:::



### 公共基础控制器定义
新增 `App/Httpcontroller/Api/Common/CommonBase.php`文件:   

```php
<?php
namespace App\HttpController\Api\Common;

use App\HttpController\Api\ApiBase;
use EasySwoole\Validate\Validate;

class CommonBase extends ApiBase
{
}
```


### 公共控制器
公共控制器放不需要登陆即可查看的控制器,例如banner列表查看:  

#### 新增 `App/HttpController/Api/Common/Banner.php` 文件:  
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
     * @Param(name="bannerId", alias="主键id", required="", integer="")
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
     * @Param(name="page", alias="页数", optional="", integer="")
     * @Param(name="limit", alias="每页总数", optional="", integer="")
     * @Param(name="keyword", alias="关键字", optional="", lengthMax="32")
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
 可看到,在getAll方法中,有着`@Param(name="page", alias="页数", optional="", integer="")`的注释,这个是注解支持写法,可写也不可以不写,当写上这个注释之后,将会约束page参数必须是int,具体的验证机制可查看[validate验证器](../HttpServer/validate.md)
:::

::: warning
测试链接:127.0.0.1:9501/api/common/banner/getAll
:::


::: warning 
 需要有数据才能看到具体输出
:::



### 管理员基础控制器定义
新增 `App/HttpController/Api/Admin/AdminBase.php` 文件:   

 
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
use App\Model\Admin\AdminBean;
use App\Model\Admin\AdminModel;
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Validate\Validate;

class AdminBase extends ApiBase
{
    //public才会根据协程清除
    public $who;
    //session的cookie头
    protected $sessionKey = 'adminSession';
    //白名单
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
            //白名单判断
            if (in_array($action, $this->whiteList)) {
                return true;
            }
            //获取登入信息
            if (!$this->getWho()) {
                $this->writeJson(Status::CODE_UNAUTHORIZED, '', '登入已过期');
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * getWho
     * @return bool
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

    protected function getValidateRule(?string $action): ?Validate
    {
        return null;
        // TODO: Implement getValidateRule() method.
    }
}

```

### 管理员登录控制器
新增 `App/HttpController/Api/Admin/Auth.php` 文件:   
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
     * 登陆,参数验证注解写法
     * @Param(name="account", alias="帐号", required="", lengthMax="20")
     * @Param(name="password", alias="密码", required="", lengthMin="6", lengthMax="16")
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
            $this->writeJson(Status::CODE_BAD_REQUEST, '', '密码错误');
        }

    }

    /**
     * logout
     * 退出登录,参数注解写法
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
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', '尚未登入');
            return false;
        }
        $result = $this->getWho()->logout();
        if ($result) {
            $this->writeJson(Status::CODE_OK, '', "登出成功");
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
 可看到,在getAll方法中,有着`@Param(name="account", alias="帐号", required="", lengthMax="20")`的注释,这个是注解支持写法,可写也不可以不写,当写上这个注释之后,将会约束page参数必须是int,具体的验证机制可查看[validate验证器](../HttpServer/validate.md)
:::

::: warning 
请求127.0.0.1:9501/Api/Admin/Auth/login?account=xsk&password=123456  即可返回:
:::

```
{
    "code": 200,
    "result": {
        "adminId": 1,
        "adminName": "仙士可",
        "adminAccount": "xsk",
        "adminSession": "d45de0cd6dd91122db4bd7e976c7deb8",
        "adminLastLoginTime": 1566279458,
        "adminLastLoginIp": "192.168.159.1"
    },
    "msg": null
}
```

### 管理员用户管理控制器
新增 `App/httpController/Api/Admin/User.php` 文件:   


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
     * @Param(name="page", alias="页数", optional="", integer="")
     * @Param(name="limit", alias="每页总数", optional="", integer="")
     * @Param(name="keyword", alias="关键字", optional="", lengthMax="32")
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
     * @Param(name="userId", alias="用户id", required="", integer="")
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
     * @Param(name="userName", alias="用户昵称", optional="", lengthMax="32")
     * @Param(name="userAccount", alias="用户名", required="", lengthMax="32")
     * @Param(name="userPassword", alias="用户密码", required="", lengthMin="6",lengthMax="18")
     * @Param(name="phone", alias="手机号码", optional="", lengthMax="18",numeric="")
     * @Param(name="state", alias="用户状态", optional="", inArray="{0,1}")
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
     * @Param(name="userId", alias="用户id", required="", integer="")
     * @Param(name="userPassword", alias="会员密码", optional="", lengthMin="6",lengthMax="18")
     * @Param(name="userName", alias="会员名", optional="",  lengthMax="32")
     * @Param(name="state", alias="状态", optional="", inArray="{0,1}")
     * @Param(name="phone", alias="手机号", optional="",  lengthMax="18")
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
            $this->writeJson(Status::CODE_BAD_REQUEST, [], '未找到该会员');
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
     * @Param(name="userId", alias="用户id", required="", integer="")
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
            $this->writeJson(Status::CODE_BAD_REQUEST, [], '删除失败');
        }

    }
}
```



::: warning 
后台管理员登陆之后,可通过此文件的接口,去进行curd会员  
:::


::: warning 
 请求地址为: 127.0.0.1:9501/Api/Admin/User/getAll(等方法)  
:::


### 普通用户基础控制器定义  
新增 `App/HttpController/Api/User/UserBase.php` 文件:    

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
    //session的cookie头
    protected $sessionKey = 'userSession';
    //白名单
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
            //白名单判断
            if (in_array($action, $this->whiteList)) {
                return true;
            }
            //获取登入信息
            if (!$data = $this->getWho()) {
                $this->writeJson(Status::CODE_UNAUTHORIZED, '', '登入已过期');
                return false;
            }
            //刷新cookie存活
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

### 普通用户登录控制器


新增 `App/HttpController/Api/User/Auth.php`文件:    


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
     * @Param(name="userAccount", alias="用户名", required="", lengthMax="32")
     * @Param(name="userPassword", alias="密码", required="", lengthMin="6",lengthMax="18")
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
            $this->writeJson(Status::CODE_BAD_REQUEST, '', '密码错误');
        }
    }


    function logout()
    {
        $sessionKey = $this->request()->getRequestParam('userSession');
        if (empty($sessionKey)) {
            $sessionKey = $this->request()->getCookieParams('userSession');
        }
        if (empty($sessionKey)) {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', '尚未登入');
            return false;
        }
        $result = $this->getWho()->logout();
        if ($result) {
            $this->writeJson(Status::CODE_OK, '', "登出成功");
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
访问 127.0.0.1:9501/Api/User/Auth/login?userAccount=xsk&userPassword=123456  即可登陆成功


