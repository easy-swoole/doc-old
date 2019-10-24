---
title: 定义表结构
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|定义表结构
---


# 定义表结构

## 自动生成表结构
```php
$model = new User();
$table = $model->getSchemaInfo();
```
使用模型中的`getSchemaInfo()`方法可以获取当前模型指定数据表的结构返回一个`EasySwoole\ORM\Utility\Schema\Table`对象

::: tip 
模型本身会**自动**生成表结构,但每次启动Easyswoole,都会去重新获取一次表结构信息,并且在这次服务中缓存,直到Easyswoole服务停止或者重启
如果不希望每次重启都去请求一次数据库,可自行定义该方法,返回Table对象
:::

## 自定义表结构

在模型类中，我们实现一个`getSchemaInfo`方法，要求返回一个`EasySwoole\ORM\Utility\Schema\Table`实例化对象

```php
class User extends AbstractModel
{
    /**
     * 表的获取
     * 此处需要返回一个 EasySwoole\ORM\Utility\Schema\Table
     * @return Table
     */
    public function getSchemaInfo(): Table
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

