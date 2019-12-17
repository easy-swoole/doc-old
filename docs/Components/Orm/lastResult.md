---
title: Orm 执行结果
meta:
  - name: description
    content: Easyswoole ORM组件,
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|Orm Invoke
---
# 执行结果

当model执行一个语句之后,会将该次执行的结果保存到`$model->lastQueryResult()`中,该方法将返回一个`EasySwoole\ORM\Db\Result`对象
    
```php
<?php
$model = new AdminModel();
$model->all();
//获取查询结果对象
$lastResult = $model->lastQueryResult();
//获取查询数据总数,查询时需要调用`withTotalCount`才可以使用该方法
var_dump($lastResult->getTotalCount());
//获得最后插入的id
var_dump($lastResult->getLastInsertId());
//获取执行影响的数据条数  update,delete等方法使用
var_dump($lastResult->getAffectedRows());
//获取错误code
var_dump($lastResult->getLastErrorNo());
//获取错误消息
var_dump($lastResult->getLastError());
//获取执行mysql返回的结果
var_dump($lastResult->getResult());

// 以下内容在版本>=1.2.2后提供

// 获取结果中的第一条
var_dump($lastResult->getResultOne());
// 获取结果中某列
var_dump($lastResult->getResultColumn(string $column));
// 获取结果中某列的第一条数据
var_dump($lastResult->getResultScalar(string $column));
// 以某一个字段名为key 返回结果数组
var_dump($lastResult->getResultIndexBy(string $column));
```

:::warning
当$model执行get,all,save等类似方法出错时,可通过调用getLastError方法获取错误消息用于调试
:::
