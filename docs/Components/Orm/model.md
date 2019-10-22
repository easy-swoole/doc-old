---
title: ORM组件
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# ORM 模型
## 模型定义

定义一个模型基础的模型，只需要创建一个类，并且继承`EasySwoole\ORM\AbstractModel`即可

```php

<?php

namespace EasySwoole\ORM\Tests;

use EasySwoole\ORM\AbstractModel;
use EasySwoole\ORM\Utility\Schema\Table;

/**
 * 用于测试的用户模型
 * Class UserModel
 * @package EasySwoole\ORM\Tests
 */
class UserModel extends AbstractModel
{
}
```

## 定义表结构

在模型类中，强制我们实现一个`function schemaInfo(): Table`方法，要求返回一个`EasySwoole\ORM\Utility\Schema\Table`类

```php
class UserModel extends AbstractModel
{
    /**
     * 表的定义
     * 此处需要返回一个 EasySwoole\ORM\Utility\Schema\Table
     * @return Table
     */
    protected function schemaInfo(): Table
    {
        $table = new Table('siam');
        $table->colInt('id')->setIsPrimaryKey(true);
        $table->colChar('name', 255);
        $table->colInt('age');
        return $table;
    }
}

```

### 表字段

在Table中，有colX系列方法，用于表示表字段的类型，如以上示例的Int,Char

```php
$table->colInt('id')；
$table->colChar('name', 255);
```

### 表主键

如果需要将某个字段指定为主键 则用连贯操作方式，在后续继续指定即可。

```php
$table->colInt('id')->setIsPrimaryKey(true);
```

## 增

```php
<?php
$model = new UserModel([
    'name' => 'siam',
    'age'  => 21,
]);
// 不同设置值的方式
// $model->setAttr('id', 7);
// $model->id = 10003;

$res = $model->save();
var_dump($res); // 返回自增id 或者主键的值  失败则返回null
```

## 删

```php
<?php
// 删除(返回影响的记录数)
// 不同方式
$res = UserModel::create()->destroy(1);
$res = UserModel::create()->destroy('2,4,5');
$res = UserModel::create()->destroy([3, 7]);
$res = UserModel::create()->destroy(['age' => 21]);
$res = UserModel::create()->destroy(function (QueryBuilder $builder) {
    $builder->where('id', 1);
});

var_dump($res);
```

## 获取器和修改器注意

数据表的字段会自动转换为驼峰法

## 修改器

setter，修改器的作用是可以在数据赋值的时候自动进行转换处理，例如：

```php
class UserModel extends AbstractModel
{
    /**
     * $value mixed 是原值
     * $data  array 是当前model所有的值 
     */
    protected function setNameAttr($value, $data)
    {
        return $value."_加一个统一后缀";
    }
}
```
如下代码在设置保存的时候将会被修改内容
```php
$model = new UserModel([
    'name' => 'siam',
    'age'  => 21,
]);
$model->save();
```


## 改

```php
<?php

// 可以直接静态更新
$res = UserModel::create()->update([
    'name' => 'new'
], ['id' => 1]);

// 根据模型对象进行更新（无需写更新条件）
$model = UserModel::create()->get(1);

// 不同设置新字段值的方式
$res = $model->update([
    'name' => 123,
]);
$model->name = 323;
$model['name'] = 333;

// 调用保存  返回bool 成功失败
$res = $model->update();
var_dump($res);
```

## 查
```php
<?php

// 获取单条(返回一个模型)
$res = UserModel::create()->get(10001);
$res = UserModel::create()->get(['emp_no' => 10001]);
var_dump($res); // 如果查询不到则为null
// 不同获取字段方式
var_dump($res->emp_no);
var_dump($res['emp_no']);

// 批量获取 返回一个数组  每一个元素都是一个模型对象
$res = UserModel::create()->all([1, 3, 10003]);
$res = UserModel::create()->all('1, 3, 10003');
$res = UserModel::create()->all(['name' => 'siam']);
$res = UserModel::create()->all(function (QueryBuilder $builder) {
    $builder->where('name', 'siam');
});
var_dump($res);

```

### 复杂查询

在以上查的示例中，我们可以看到最后一个是闭包方式，我们可以在其中使用QueryBuilder的任意连贯操作，来构建一个复杂的查询操作。

支持方法列表查看Mysqli。

```php
$res = UserModel::create()->all(function (QueryBuilder $builder) {
    $builder->where('name', 'siam');
    $builder->order('id');
    $builder->limit(10);
});
```

## 获取器

getter，获取器的作用是在获取数据的字段值后自动进行处理

```php
class UserModel extends AbstractModel
{
    /**
     * $value mixed 是原值
     * $data  array 是当前model所有的值 
     */
    protected function getIdAttr($value, $data)
    {
        // id = 1 管理员
        if ($value == 1){
            return '管理员';
        }
        return '普通账号';
    }
    
    protected function getStatusAttr($value)
    {
        $status = [-1=>'删除',0=>'禁用',1=>'正常',2=>'待审核'];
        return $status[$value];
    }
}
```

获取器还可以定义数据表中不存在的字段，例如：
```php
protected function getEasyswooleAttr($value,$data)
{
  return 'Easyswoole用户-'.$data['id'];
}
```
那么在外部我们就可以使用这个easyswoole字段了
```php
$res = UserModel::create()->get(4);
var_dump($res->easyswoole);
```

## 指定连接

connectionName属性，支持多数据库连接方式。

指定``` blank ```连接方式

```php
Class AdminModel extends \EasySwoole\ORM\AbstractModel {

    protected $connectionName = 'blank';

    /**
     * 返回当前模型的结构信息
     * 请为当前模型编写正确的结构
     * @return \EasySwoole\ORM\Utility\Schema\Table
     */
    protected function schemaInfo(): \EasySwoole\ORM\Utility\Schema\Table
    {
        // TODO: Implement schemaInfo() method.
        $table = new \EasySwoole\ORM\Utility\Schema\Table('admin_list');
        $table->colInt('admin_id')->setIsPrimaryKey(true);
        $table->colChar('admin_name', 30);
        $table->colChar('admin_account', 20);
        $table->colChar('admin_password', 32);
        $table->colChar('admin_session', 32);
        $table->colChar('last_login_ip', 20);
        $table->colInt('last_login_time');
        $table->colInt('add_time');
        $table->colTinyInt('is_forbid', 2);
        return $table;
    }
}
```

添加``` blank ```连接方式

```php
\co::create(function() {
    $config = new Config();
    $config->setDatabase('cry');
    $config->setUser('root');
    $config->setPassword('root');
    $config->setHost('192.168.75.1');

    DbManager::getInstance()->addConnection(new Connection($config), 'blank');

    $admin = AdminModel::create()->get(1);

    print_r($admin->toArray());

});
```

## 指定字段

field，其作用是获取指定的数据库字段数据。

获取``` admin_id ```，``` admin_name ```数据

```php
\co::create(function() {
    $config = new Config();
    $config->setDatabase('cry');
    $config->setUser('root');
    $config->setPassword('root');
    $config->setHost('192.168.75.1');

    DbManager::getInstance()->addConnection(new Connection($config), 'blank');

    $admin = AdminModel::create()->field(['admin_id', 'admin_name'])->get(1);

    print_r($admin->toArray());

});
```

## 分页

limit和withTotalCount，获取分页列表数据以及总条数。

下面模拟获取分页列表数据，page为页码，limit为每页显示多少条数。

```php
\co::create(function() {
    $config = new Config();
    $config->setDatabase('cry');
    $config->setUser('root');
    $config->setPassword('root');
    $config->setHost('192.168.75.1');

    DbManager::getInstance()->addConnection(new Connection($config), 'blank');

    $page = 1;          // 当前页码
    $limit = 10;        // 每页多少条数据

    $model = AdminModel::create()->limit($limit * ($page - 1), $limit * $page - 1)->withTotalCount();
    
    // 列表数据
    $list = $model->all(null, true);

    $result = $model->lastQueryResult();

    // 总条数
    $total = $result->getTotalCount();
   

});
```

## 获取序列化记录数据

jsonSerialize，获取序列化记录数据。

```php
\co::create(function() {
    $config = new Config();
    $config->setDatabase('cry');
    $config->setUser('root');
    $config->setPassword('root');
    $config->setHost('192.168.75.1');

    DbManager::getInstance()->addConnection(new Connection($config), 'blank');

    $model = AdminModel::create();

    $admin = $model->get(1);

    $data = $admin->jsonSerialize();

});
```

## 获取字符串json数据

__toString，将数据转化成字符串json数据并返回。

```php
\co::create(function() {
   $config = new Config();
   $config->setDatabase('cry');
   $config->setUser('root');
   $config->setPassword('root');
   $config->setHost('192.168.75.1');

   DbManager::getInstance()->addConnection(new Connection($config), 'blank');

   $model = AdminModel::create();

   $admin = $model->get(1);

   $data = $admin->__toString();

   var_dump($data);

});
```