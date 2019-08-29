# 基础开发示例
## demo地址
基础开发示例已经开源,地址:https://github.com/easy-swoole/demo/tree/3.x

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
再引入mysqli-pool库
```
composer require easyswoole/mysqli-pool
```

### 事件注册

我们编辑根目录下的```EasySwooleEvent.php```文件，在```mainServerCreate```事件中进行连接池的注册，大体结构如下：  
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
        $configData = Config::getInstance()->getConf('MYSQL');
        $config = new \EasySwoole\Mysqli\Config($configData);
        $poolConf = \EasySwoole\MysqliPool\Mysql::getInstance()->register('mysql', $config);
        $poolConf->setMaxObjectNum(20);
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

## 模型定义
### 基础模型定义
新建`App/Model/BaseModel.php`文件:  
```php
<?php


namespace App\Model;



use EasySwoole\Mysqli\Mysqli;

class BaseModel
{
    protected $db;
    protected $table;
    function __construct(Mysqli $connection)
    {
        $this->db = $connection;
    }

    function getDbConnection():Mysqli
    {
        return $this->db;
    }

    /**
     * @return mixed
     */
    public function getTable()
    {
        return $this->table;
    }
}
```

### 管理员模型
#### 新增管理员用户表:  
```mysql
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
#### 新增bean文件
新增 `App/Model/Admin/AdminBean.php` 文件:  
```php
<?php

namespace App\Model\Admin;

/**
 * Class AdminBean
 * Create With Automatic Generator
 * @property int adminId |
 * @property string adminName |
 * @property string adminAccount |
 * @property string adminPassword |
 * @property string adminSession |
 * @property int adminLastLoginTime |
 * @property string adminLastLoginIp |
 */
class AdminBean extends \EasySwoole\Spl\SplBean
{
	protected $adminId;

	protected $adminName;

	protected $adminAccount;

	protected $adminPassword;

	protected $adminSession;

	protected $adminLastLoginTime;

	protected $adminLastLoginIp;


	public function setAdminId($adminId)
	{
		$this->adminId = $adminId;
	}


	public function getAdminId()
	{
		return $this->adminId;
	}


	public function setAdminName($adminName)
	{
		$this->adminName = $adminName;
	}


	public function getAdminName()
	{
		return $this->adminName;
	}


	public function setAdminAccount($adminAccount)
	{
		$this->adminAccount = $adminAccount;
	}


	public function getAdminAccount()
	{
		return $this->adminAccount;
	}


	public function setAdminPassword($adminPassword)
	{
		$this->adminPassword = $adminPassword;
	}


	public function getAdminPassword()
	{
		return $this->adminPassword;
	}


	public function setAdminSession($adminSession)
	{
		$this->adminSession = $adminSession;
	}


	public function getAdminSession()
	{
		return $this->adminSession;
	}


	public function setAdminLastLoginTime($adminLastLoginTime)
	{
		$this->adminLastLoginTime = $adminLastLoginTime;
	}


	public function getAdminLastLoginTime()
	{
		return $this->adminLastLoginTime;
	}


	public function setAdminLastLoginIp($adminLastLoginIp)
	{
		$this->adminLastLoginIp = $adminLastLoginIp;
	}


	public function getAdminLastLoginIp()
	{
		return $this->adminLastLoginIp;
	}
}
```
#### 新增model文件  
新增 `App/Model/Admin/AdminModel.php`文件:  

```php
<?php

namespace App\Model\Admin;

/**
 * Class AdminModel
 * Create With Automatic Generator
 */
class AdminModel extends \App\Model\BaseModel
{
    protected $table = 'admin_list';

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
        if (!empty($keyword)) {
            $this->getDbConnection()->where('adminAccount', '%' . $keyword . '%', 'like');
        }

        $list = $this->getDbConnection()
            ->withTotalCount()
            ->orderBy($this->primaryKey, 'DESC')
            ->get($this->table, [$pageSize * ($page - 1), $pageSize]);
        $total = $this->getDbConnection()->getTotalCount();
        return ['total' => $total, 'list' => $list];
    }


    /**
     * 默认根据主键(adminId)进行搜索
     * @getOne
     * @param  AdminBean $bean
     * @return AdminBean
     */
    public function getOne(AdminBean $bean): ?AdminBean
    {
        $info = $this->getDbConnection()->where($this->primaryKey, $bean->getAdminId())->getOne($this->table);
        if (empty($info)) {
            return null;
        }
        return new AdminBean($info);
    }


    /**
     * 默认根据bean数据进行插入数据
     * @add
     * @param  AdminBean $bean
     * @return bool
     */
    public function add(AdminBean $bean): bool
    {
        return $this->getDbConnection()->insert($this->table, $bean->toArray(null, $bean::FILTER_NOT_NULL));
    }


    /**
     * 默认根据主键(adminId)进行删除
     * @delete
     * @param  AdminBean $bean
     * @return bool
     */
    public function delete(AdminBean $bean): bool
    {
        return $this->getDbConnection()->where($this->primaryKey, $bean->getAdminId())->delete($this->table);
    }


    /**
     * 默认根据主键(adminId)进行更新
     * @delete
     * @param  AdminBean $bean
     * @param  array     $data
     * @return bool
     */
    public function update(AdminBean $bean, array $data): bool
    {
        if (empty($data)) {
            return false;
        }
        return $this->getDbConnection()->where($this->primaryKey, $bean->getAdminId())->update($this->table, $data);
    }

    /*
     * 登录成功后请返回更新后的bean
     */
    function login(AdminBean $userBean): ?AdminBean
    {
        $user = $this->getDbConnection()
            ->where('adminAccount', $userBean->getAdminAccount())
            ->where('adminPassword', $userBean->getAdminPassword())
            ->getOne($this->table);
        if (empty($user)) {
            return null;
        }
        return new AdminBean($user);
    }

    /*
     * 以account进行查询
     */
    function accountExist(AdminBean $userBean): ?AdminBean
    {
        $user = $this->getDbConnection()
            ->where('adminAccount', $userBean->getAdminAccount())
            ->getOne($this->table);
        if (empty($user)) {
            return null;
        }
        return new AdminBean($user);
    }

    function getOneBySession($session)
    {
        $user = $this->getDbConnection()
            ->where('adminSession', $session)
            ->getOne($this->table);
        if (empty($user)) {
            return null;
        }
        return new AdminBean($user);
    }

    function logout(AdminBean $bean){
        $update = [
            'adminSession'=>'',
        ];
        return $this->getDbConnection()->where($this->primaryKey, $bean->getAdminId())->update($this->table, $update);
    }

}
```

### 普通用户模型
普通用户模型和管理员模型同理
#### 建表
```mysql
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


#### 新增bean文件
在 `App/Model/User/UserBean.php` 文件:  
```php
<?php

namespace App\Model\User;

/**
 * Class UserBean
 * Create With Automatic Generator
 * @property int userId |
 * @property string userName |
 * @property string userAccount |
 * @property string userPassword |
 * @property string phone |
 * @property string money |
 * @property int addTime |
 * @property string lastLoginIp |
 * @property int lastLoginTime |
 * @property string userSession |
 * @property int state |
 */
class UserBean extends \EasySwoole\Spl\SplBean
{
    protected $userId;

    protected $userName;

    protected $userAccount;

    protected $userPassword;

    protected $userAvatar;

    protected $phone;

    protected $money;

    protected $frozenMoney;

    protected $addTime;

    protected $lastLoginIp;

    protected $lastLoginTime;

    protected $userSession;

    protected $state;

    const STATE_PROHIBIT = 0;//禁用状态
    const STATE_NORMAL = 1;//正常状态

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }


    public function getUserId()
    {
        return $this->userId;
    }


    public function setUserName($userName)
    {
        $this->userName = $userName;
    }


    public function getUserName()
    {
        return $this->userName;
    }


    public function setUserAccount($userAccount)
    {
        $this->userAccount = $userAccount;
    }


    public function getUserAccount()
    {
        return $this->userAccount;
    }

    /**
     * @return mixed
     */
    public function getUserAvatar()
    {
        return $this->userAvatar;
    }

    /**
     * @param mixed $userAvatar
     */
    public function setUserAvatar($userAvatar): void
    {
        $this->userAvatar = $userAvatar;
    }


    public function setUserPassword($userPassword)
    {
        $this->userPassword = $userPassword;
    }


    public function getUserPassword()
    {
        return $this->userPassword;
    }


    public function setPhone($phone)
    {
        $this->phone = $phone;
    }


    public function getPhone()
    {
        return $this->phone;
    }


    public function setMoney($money)
    {
        $this->money = $money;
    }


    public function getMoney()
    {
        return $this->money;
    }


    public function setAddTime($addTime)
    {
        $this->addTime = $addTime;
    }


    public function getAddTime()
    {
        return $this->addTime;
    }


    public function setLastLoginIp($lastLoginIp)
    {
        $this->lastLoginIp = $lastLoginIp;
    }


    public function getLastLoginIp()
    {
        return $this->lastLoginIp;
    }


    public function setLastLoginTime($lastLoginTime)
    {
        $this->lastLoginTime = $lastLoginTime;
    }


    public function getLastLoginTime()
    {
        return $this->lastLoginTime;
    }


    public function setUserSession($userSession)
    {
        $this->userSession = $userSession;
    }


    public function getUserSession()
    {
        return $this->userSession;
    }


    public function setState($state)
    {
        $this->state = $state;
    }


    public function getState()
    {
        return $this->state;
    }

    /**
     * @return mixed
     */
    public function getFrozenMoney()
    {
        return $this->frozenMoney;
    }

    /**
     * @param mixed $frozenMoney
     */
    public function setFrozenMoney($frozenMoney)
    {
        $this->frozenMoney = $frozenMoney;
    }
}

```

#### 新增model文件
新增 `App/Model/User/UserModel.php` 文件:  

```php
<?php

namespace App\Model\User;

/**
 * Class UserModel
 * Create With Automatic Generator
 */
class UserModel extends \App\Model\BaseModel
{
	protected $table = 'user_list';

	protected $primaryKey = 'userId';


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
		if (!empty($keyword)) {
		    $this->getDbConnection()->where('userAccount', '%' . $keyword . '%', 'like');
		}

		$list = $this->getDbConnection()
		    ->withTotalCount()
		    ->orderBy($this->primaryKey, 'DESC')
		    ->get($this->table, [$pageSize * ($page  - 1), $pageSize]);
		$total = $this->getDbConnection()->getTotalCount();
		return ['total' => $total, 'list' => $list];
	}


	/**
	 * 默认根据主键(userId)进行搜索
	 * @getOne
	 * @param  UserBean $bean
	 * @return UserBean
	 */
	public function getOne(UserBean $bean,$field='*'): ?UserBean
	{
		$info = $this->getDbConnection()->where($this->primaryKey, $bean->getUserId())->getOne($this->table,$field);
		if (empty($info)) {
		    return null;
		}
		return new UserBean($info);
	}

	public function getOneByPhone($phone,$field='*'): ?UserBean
	{
		$info = $this->getDbConnection()->where('phone', $phone)->getOne($this->table,$field);
		if (empty($info)) {
		    return null;
		}
		return new UserBean($info);
	}


	/**
	 * 默认根据bean数据进行插入数据
	 * @add
	 * @param  UserBean $bean
	 * @return bool
	 */
	public function add(UserBean $bean): bool
	{
		return $this->getDbConnection()->insert($this->table, $bean->toArray(null, $bean::FILTER_NOT_NULL));
	}


	/**
	 * 默认根据主键(userId)进行删除
	 * @delete
	 * @param  UserBean $bean
	 * @return bool
	 */
	public function delete(UserBean $bean): bool
	{
		return  $this->getDbConnection()->where($this->primaryKey, $bean->getUserId())->delete($this->table);
	}


	/**
	 * 默认根据主键(userId)进行更新
	 * @delete
	 * @param  UserBean $bean
	 * @param  array    $data
	 * @return bool
	 */
	public function update(UserBean $bean, array $data): bool
	{
		if (empty($data)){
		    return false;
		}
		return $this->getDbConnection()->where($this->primaryKey, $bean->getUserId())->update($this->table, $data);
	}

    /*
     * 登录成功后请返回更新后的bean
     */
    function login(UserBean $userBean): ?UserBean
    {
        $user = $this->getDbConnection()
            ->where('userAccount', $userBean->getUserAccount())
            ->where('userPassword', $userBean->getUserPassword())
            ->getOne($this->table);
        if (empty($user)) {
            return null;
        }
        return new UserBean($user);
    }


    function getOneBySession($session)
    {
        $user = $this->getDbConnection()
            ->where('userSession', $session)
            ->getOne($this->table);
        if (empty($user)) {
            return null;
        }
        return new UserBean($user);
    }

    function logout(UserBean $bean){
        $update = [
            'userSession'=>'',
        ];
        return $this->getDbConnection()->where($this->primaryKey, $bean->getUserId())->update($this->table, $update);
    }

}
```

### banner模型
#### 建表

```mysql
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
#### 新增bean文件
新增 `App/Model/Admin/BannerBean.php` 文件:  

```php
<?php

namespace App\Model\Admin;

/**
 * Class BannerBean
 * Create With Automatic Generator
 * @property int bannerId |
 * @property string bannerImg | banner图片
 * @property string bannerUrl | 跳转地址
 * @property int state | 状态0隐藏 1正常
 */
class BannerBean extends \EasySwoole\Spl\SplBean
{
    protected $bannerId;
    protected $bannerImg;
    protected $bannerUrl;
    protected $bannerName;
    protected $bannerDescription;
    protected $state;


    public function setBannerId($bannerId)
    {
        $this->bannerId = $bannerId;
    }


    public function getBannerId()
    {
        return $this->bannerId;
    }


    public function setBannerImg($bannerImg)
    {
        $this->bannerImg = $bannerImg;
    }


    public function getBannerImg()
    {
        return $this->bannerImg;
    }


    public function setBannerUrl($bannerUrl)
    {
        $this->bannerUrl = $bannerUrl;
    }


    public function getBannerUrl()
    {
        return $this->bannerUrl;
    }


    public function setState($state)
    {
        $this->state = $state;
    }


    public function getState()
    {
        return $this->state;
    }

    /**
     * @return mixed
     */
    public function getBannerName()
    {
        return $this->bannerName;
    }

    /**
     * @param mixed $bannerName
     */
    public function setBannerName($bannerName): void
    {
        $this->bannerName = $bannerName;
    }

    /**
     * @return mixed
     */
    public function getBannerDescription()
    {
        return $this->bannerDescription;
    }

    /**
     * @param mixed $bannerDescription
     */
    public function setBannerDescription($bannerDescription): void
    {
        $this->bannerDescription = $bannerDescription;
    }
}
```

#### 新增model文件
新增 `App/Model/Admin/BannerModel.php` 文件:  

```php
<?php

namespace App\Model\Admin;

/**
 * Class BannerModel
 * Create With Automatic Generator
 */
class BannerModel extends \App\Model\BaseModel
{
	protected $table = 'banner_list';

	protected $primaryKey = 'bannerId';


	/**
	 * @getAll
	 * @keyword bannerUrl
	 * @param  int  page  1
	 * @param  string  keyword
	 * @param  int  pageSize  10
	 * @return array[total,list]
	 */
	public function getAll(int $page = 1, string $keyword = null, int $pageSize = 10): array
	{
		if (!empty($keyword)) {
		    $this->getDbConnection()->where('bannerUrl', '%' . $keyword . '%', 'like');
		}

		$list = $this->getDbConnection()
		    ->withTotalCount()
		    ->orderBy($this->primaryKey, 'DESC')
		    ->get($this->table, [$pageSize * ($page  - 1), $pageSize]);
		$total = $this->getDbConnection()->getTotalCount();
		return ['total' => $total, 'list' => $list];
	}

    /**
     * getAllByState
     * @param int         $page
     * @param int|null    $state
     * @param string|null $keyword
     * @param int         $pageSize
     * @return array
     * @throws \EasySwoole\Mysqli\Exceptions\ConnectFail
     * @throws \EasySwoole\Mysqli\Exceptions\Option
     * @throws \EasySwoole\Mysqli\Exceptions\OrderByFail
     * @throws \EasySwoole\Mysqli\Exceptions\PrepareQueryFail
     * @author Tioncico
     * Time: 15:13
     */
	public function getAllByState(int $page = 1, ?int $state = null, string $keyword = null, int $pageSize = 10): array
	{
		if (!empty($keyword)) {
		    $this->getDbConnection()->where('bannerUrl', '%' . $keyword . '%', 'like');
		}
		if ($state!==null) {
		    $this->getDbConnection()->where('state', $state);
		}

		$list = $this->getDbConnection()
		    ->withTotalCount()
		    ->orderBy($this->primaryKey, 'DESC')
		    ->get($this->table, [$pageSize * ($page  - 1), $pageSize]);
		$total = $this->getDbConnection()->getTotalCount();
		return ['total' => $total, 'list' => $list];
	}


	/**
	 * 默认根据主键(bannerId)进行搜索
	 * @getOne
	 * @param  BannerBean $bean
	 * @return BannerBean
	 */
	public function getOne(BannerBean $bean): ?BannerBean
	{
		$info = $this->getDbConnection()->where($this->primaryKey, $bean->getBannerId())->getOne($this->table);
		if (empty($info)) {
		    return null;
		}
		return new BannerBean($info);
	}


	/**
	 * 默认根据bean数据进行插入数据
	 * @add
	 * @param  BannerBean $bean
	 * @return bool
	 */
	public function add(BannerBean $bean): bool
	{
		return $this->getDbConnection()->insert($this->table, $bean->toArray(null, $bean::FILTER_NOT_NULL));
	}


	/**
	 * 默认根据主键(bannerId)进行删除
	 * @delete
	 * @param  BannerBean $bean
	 * @return bool
	 */
	public function delete(BannerBean $bean): bool
	{
		return  $this->getDbConnection()->where($this->primaryKey, $bean->getBannerId())->delete($this->table);
	}


	/**
	 * 默认根据主键(bannerId)进行更新
	 * @delete
	 * @param  BannerBean $bean
	 * @param  array $data
	 * @return bool
	 */
	public function update(BannerBean $bean, array $data): bool
	{
		if (empty($data)){
		    return false;
		}
		return $this->getDbConnection()->where($this->primaryKey, $bean->getBannerId())->update($this->table, $data);
	}
}

```

## 控制器定义

### 全局基础控制器定义
新增 `App/Httpcontroller/Api/ApiBase.php` 文件:   


```php
<?php
namespace App\HttpController\Api;
use EasySwoole\EasySwoole\Core;
use EasySwoole\EasySwoole\ServerManager;
use EasySwoole\EasySwoole\Trigger;
use EasySwoole\Http\AbstractInterface\Controller;
use EasySwoole\Http\Message\Status;
use EasySwoole\Validate\Validate;
abstract class ApiBase extends Controller
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
        /*
         * 各个action的参数校验
         */
        $v = $this->getValidateRule($action);
        if ($v && !$this->validate($v)) {
            $this->writeJson(Status::CODE_BAD_REQUEST, ['errorCode' => 1, 'data' => []], $v->getError()->__toString());
            return false;
        }
        return true;
    }

    abstract protected function getValidateRule(?string $action): ?Validate;


    protected function onException(\Throwable $throwable): void
    {
        Trigger::getInstance()->throwable($throwable);
        $this->writeJson(Status::CODE_INTERNAL_SERVER_ERROR, null, $throwable->getMessage() . " at file {$throwable->getFile()} line {$throwable->getLine()}");
    }

    /**
     * 获取用户的get/post的一个值,可设定默认值
     * input
     * @param      $key
     * @param null $default
     * @return array|mixed|null
     * @author Tioncico
     * Time: 17:27
     */
    protected function input($key, $default = null)
    {
        $value = $this->request()->getRequestParam($key);
        return $value ?? $default;
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
}
```

> 新增基础控制器,里面的方法用于获取用户ip,以及获取api参数  


### 公共基础控制器定义
新增 `App/Httpcontroller/Api/Common/CommonBase.php`文件:   

```php
<?php
namespace App\HttpController\Api\Common;
use App\HttpController\Api\ApiBase;
use EasySwoole\Validate\Validate;
class CommonBase extends ApiBase
{
    function onRequest(?string $action): ?bool
    {
        if (parent::onRequest($action)) {
            return true;
        }
        return false;
    }

    protected function getValidateRule(?string $action): ?Validate
    {
        return null;
        // TODO: Implement getValidateRule() method.
    }
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
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Validate\Validate;
class Banner extends CommonBase
{

	public function getOne()
	{
		$db = Mysql::defer('mysql');
		$param = $this->request()->getRequestParam();
		$model = new BannerModel($db);
		$bean = $model->getOne(new BannerBean(['bannerId' => $param['bannerId']]));
		if ($bean) {
		    $this->writeJson(Status::CODE_OK, $bean, "success");
		} else {
		    $this->writeJson(Status::CODE_BAD_REQUEST, [], 'fail');
		}
	}

	public function getAll()
	{
        $db = Mysql::defer('mysql');
        $param = $this->request()->getRequestParam();
		$page = $param['page']??1;
		$limit = $param['limit']??20;
		$model = new BannerModel($db);
		$data = $model->getAllByState($page, 1,$param['keyword']??null, $limit);
		$this->writeJson(Status::CODE_OK, $data, 'success');
	}

    function getValidateRule(?string $action): ?Validate
    {
        $validate = null;
        switch ($action) {
            case 'getAll':
                $validate = new Validate();
                $validate->addColumn('page', '页数')->optional();
                $validate->addColumn('limit', 'limit')->optional();
                $validate->addColumn('keyword', '关键词')->optional();
                break;
            case 'getOne':
                $validate = new Validate();
                $validate->addColumn('bannerId', '主键id')->required()->lengthMax(11);
                break;
        }
        return $validate;
    }
}
```

> 测试链接:127.0.0.1:9501/api/common/banner/getAll 
> 需要有数据才能看到具体输出



### 管理员基础控制器定义
新增 `App/HttpController/Api/Admin/AdminBase.php` 文件:   

 
```php
<?php
namespace App\HttpController\Api\Admin;
use App\HttpController\Api\ApiBase;
use App\Model\Admin\AdminBean;
use App\Model\Admin\AdminModel;
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Validate\Validate;
class AdminBase extends ApiBase
{
    protected $who;
    //session的cookie头
    protected $sessionKey = 'adminSession';
    //白名单
    protected $whiteList = ['login'];

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

    function getWho(): ?AdminBean
    {
        if ($this->who instanceof AdminBean) {
            return $this->who;
        }
        $sessionKey = $this->request()->getRequestParam($this->sessionKey);
        if (empty($sessionKey)) {
            $sessionKey = $this->request()->getCookieParams($this->sessionKey);
        }
        if (empty($sessionKey)) {
            return null;
        }
        $db = Mysql::defer('mysql');
        $adminModel = new AdminModel($db);
        $this->who = $adminModel->getOneBySession($sessionKey);
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
namespace App\HttpController\Api\Admin;
use App\Model\Admin\AdminBean;
use App\Model\Admin\AdminModel;
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Spl\SplBean;
use EasySwoole\Validate\Validate;
class Auth extends AdminBase
{
    protected $whiteList=['login'];

    function login()
    {
        $param = $this->request()->getRequestParam();
        $db = Mysql::defer('mysql');
        $model = new AdminModel($db);
        $bean = new AdminBean();
        $bean->setAdminAccount($param['account']);
        $bean->setAdminPassword(md5($param['password']));

        if ($rs = $model->login($bean)) {
            $bean->restore(['adminId' => $rs->getAdminId()]);
            $sessionHash = md5(time() . $rs->getAdminId());
            $model->update($bean, [
                'adminLastLoginTime' => time(),
                'adminLastLoginIp'   => $this->clientRealIP(),
                'adminSession'       => $sessionHash
            ]);
            $rs = $rs->toArray(null, SplBean::FILTER_NOT_NULL);
            unset($rs['adminPassword']);
            $rs['adminSession'] = $sessionHash;
            $this->response()->setCookie('adminSession', $sessionHash, time() + 3600, '/');
            $this->writeJson(Status::CODE_OK, $rs);
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, '', '密码错误');
        }

    }

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
        $db = Mysql::defer('mysql');
        $adminModel = new AdminModel($db);
        $result = $adminModel->logout($this->getWho());
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

    protected function getValidateRule(?string $action): ?Validate
    {
        $validate = null;
        switch ($action) {
            case 'login':
                $validate = new Validate();
                $validate->addColumn('account')->required()->lengthMax(32);
                $validate->addColumn('password')->required()->lengthMax(32);
                break;
            case 'logout':
                break;
        }
        return $validate;
    }
}
```
> 请求127.0.0.1:9501/Api/Admin/Auth/login?account=xsk&password=123456  即可返回:
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
namespace App\HttpController\Api\Admin;

use App\Model\User\UserBean;
use App\Model\User\UserModel;
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Validate\Validate;

class User extends AdminBase
{
    function getAll()
    {
        $db = Mysql::defer('mysql');
        $page = (int)$this->input('page', 1);
        $limit = (int)$this->input('limit', 20);
        $model = new UserModel($db);
        $data = $model->getAll($page, $this->input('keyword'), $limit);
        $this->writeJson(Status::CODE_OK, $data, 'success');
    }

    function getOne()
    {
        $db = Mysql::defer('mysql');
        $param = $this->request()->getRequestParam();
        $data['userId'] = intval($param['userId']);
        $model = new UserModel($db);
        $rs = $model->getOne(new UserBean($data));
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], 'fail');
        }

    }

    function add()
    {
        $db = Mysql::defer('mysql');
        $param = $this->request()->getRequestParam();
        $model = new UserModel($db);
        $bean = new UserBean($param);
        $bean->setUserPassword(md5($param['userPassword']));
        $bean->setState($this->input('state',1));
        $bean->setMoney(0);
        $bean->setAddTime(time());
        $rs = $model->add($bean);
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], $db->getLastError());
        }
    }

    function update()
    {
        $db = Mysql::defer('mysql');
        $model = new UserModel($db);
        $userInfo = $model->getOne( new UserBean(['userId' => $this->input('userId')]));
        if (!$userInfo){
            $this->writeJson(Status::CODE_BAD_REQUEST, [], '未找到该会员');
        }
        $password = $this->input('userPassword');
        $updateBean = new UserBean();
        $updateBean->setUserName($this->input('userName',$userInfo->getUserName()));
        $updateBean->setUserPassword($password?md5($password):$userInfo->getUserPassword());
        $updateBean->setState($this->input('state',$userInfo->getState()));
        $updateBean->setPhone($this->input('phone',$userInfo->getPhone()));

        $rs = $model->update($userInfo, $updateBean->toArray([], $updateBean::FILTER_NOT_EMPTY));
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], $db->getLastError());
        }

    }

    function delete()
    {
        $db = Mysql::defer('mysql');
        $param = $this->request()->getRequestParam();
        $model = new UserModel($db);
        $bean = new UserBean(['userId' => intval($param['userId'])]);
        $rs = $model->delete($bean);
        if ($rs) {
            $this->writeJson(Status::CODE_OK, $rs, "success");
        } else {
            $this->writeJson(Status::CODE_BAD_REQUEST, [], '删除失败');
        }

    }

    function getValidateRule(?string $action): ?Validate
    {
        $validate = null;
        switch ($action) {
            case 'getAll':
                $validate = new Validate();
                $validate->addColumn('page','页数')->optional();
                $validate->addColumn('limit','limit')->optional();
                $validate->addColumn('keyword','关键词')->optional();
                break;
            case 'getOne':
                $validate = new Validate();
                $validate->addColumn('userId', '会员id')->required()->lengthMax(11);
                break;
            case 'add':
                $validate = new Validate();
                $validate->addColumn('userName', '会员名')->required()->lengthMax(18);
                $validate->addColumn('userAccount', '会员账号')->required()->lengthMax(32);
                $validate->addColumn('userPassword', '会员密码')->required()->lengthMax(18);
                $validate->addColumn('phone', '手机号')->optional()->lengthMax(18);
                $validate->addColumn('state', '状态')->optional()->inArray([0,1]);
                break;
            case 'update':
                $validate = new Validate();
                $validate->addColumn('userId', '会员id')->required()->lengthMax(11);
                $validate->addColumn('userName', '会员名')->optional()->lengthMax(18);
                $validate->addColumn('userPassword', '会员密码')->optional()->lengthMax(18);
                $validate->addColumn('phone', '手机号')->optional()->lengthMax(18);
                $validate->addColumn('state', '状态')->optional()->inArray([0,1]);
                break;
            case 'delete':
                $validate = new Validate();
                $validate->addColumn('userId', '会员id')->required()->lengthMax(11);
                break;
        }
        return $validate;
    }
}
```


> 后台管理员登陆之后,可通过此文件的接口,去进行curd会员  
> 请求地址为: 127.0.0.1:9501/Api/Admin/User/getAll(等方法)  


### 普通用户基础控制器定义  
新增 `App/HttpController/Api/User/UserBase.php` 文件:    

```php
<?php
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

    function getWho(): ?UserBean
    {
        if ($this->who instanceof UserBean) {
            return $this->who;
        }
        $sessionKey = $this->request()->getRequestParam($this->sessionKey);
        if (empty($sessionKey)) {
            $sessionKey = $this->request()->getCookieParams($this->sessionKey);
        }
        if (empty($sessionKey)) {
            return null;
        }
        $db = Mysql::defer('mysql');
        $userModel = new UserModel($db);
        $this->who = $userModel->getOneBySession($sessionKey);
        return $this->who;
    }

    protected function getValidateRule(?string $action): ?Validate
    {
        return null;
        // TODO: Implement getValidateRule() method.
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
use EasySwoole\Http\Message\Status;
use EasySwoole\MysqliPool\Mysql;
use EasySwoole\Spl\SplBean;
use EasySwoole\Validate\Validate;

class Auth extends UserBase
{
    protected $whiteList = ['login', 'register'];

    function login()
    {
        $param = $this->request()->getRequestParam();
        $db = Mysql::defer('mysql');
        $model = new UserModel($db);
        $bean = new UserBean();
        $bean->setUserAccount($param['userAccount']);
        $bean->setUserPassword(md5($param['userPassword']));

        if ($rs = $model->login($bean)) {
            $bean->restore(['userId' => $rs->getUserId()]);
            $sessionHash = md5(time() . $rs->getUserId());
            $model->update($bean, [
                'lastLoginIp'   => $this->clientRealIP(),
                'lastLoginTime' => time(),
                'userSession'   => $sessionHash
            ]);
            $rs = $rs->toArray(null, SplBean::FILTER_NOT_NULL);
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
        $db = Mysql::defer('mysql');
        $userModel = new UserModel($db);
        $result = $userModel->logout($this->getWho());
        if ($result) {
            $this->writeJson(Status::CODE_OK, '', "登出成功");
        } else {
            $this->writeJson(Status::CODE_UNAUTHORIZED, '', 'fail');
        }
    }


    function getInfo()
    {
        $this->getWho()->setPhone(substr_replace($this->getWho()->getPhone(), '****', 3, 4));
        $this->writeJson(200, $this->getWho(), 'success');
    }

    protected function getValidateRule(?string $action): ?Validate
    {
        $validate = null;
        switch ($action) {
            case 'login':
                $validate = new Validate();
                $validate->addColumn('userAccount')->required()->lengthMax(32);
                $validate->addColumn('userPassword')->required()->lengthMax(32);
                break;
            case 'getInfo':
                break;
            case 'logout':
                break;
        }
        return $validate;
    }
}
```
访问 127.0.0.1:9501/Api/User/Auth/login?userAccount=xsk&userPassword=123456  即可登陆成功


