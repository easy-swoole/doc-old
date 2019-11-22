---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# 查询构造器

QueryBuilder是一个SQL构造器，用来构造prepare sql。例如：

```php
use EasySwoole\Mysqli\QueryBuilder;

$builder = new QueryBuilder();

//执行条件构造逻辑
$builder->where('col1',2)->get('my_table');

//获取最后的查询参数
echo $builder->getLastQueryOptions();

//获取子查询
echo $builder->getSubQuery();


//获取上次条件构造的预处理sql语句
echo $builder->getLastPrepareQuery();
// SELECT  * FROM whereGet WHERE  col1 = ? 

//获取上次条件构造的预处理sql语句所以需要的绑定参数
echo $builder->getLastBindParams();
//[2]

//获取上次条件构造的sql语句
echo $builder->getLastQuery();
//SELECT  * FROM whereGet WHERE  col1 = 2 

// 获取最后插入的insert_id 使用客户端从swoole mysql获取
$client->mysqlClient()->insert_id
```
