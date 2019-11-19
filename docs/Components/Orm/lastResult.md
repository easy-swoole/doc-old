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
```

:::warning
当$model执行get,all,save等类似方法出错时,可通过调用getLastError方法获取错误消息用于调试
:::