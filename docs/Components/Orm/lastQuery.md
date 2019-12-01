# 最后执行语句

当model执行一个语句之后,会将该次执行的语句保存到`$model->lastQuery()`中:

```php
<?php
$model = new AdminModel();
//执行all查询
var_dump($model->all());
//打印最后执行的`EasySwoole\Mysqli\QueryBuilder` 对象
var_dump($model->lastQuery());
//打印最后执行的sql语句
var_dump($model->lastQuery()->getLastQuery());
```

::: warning
$model->lastQuery() 返回的是query对象,具体文档可查看:[查询构造器](../Mysqli/builder.md) 文档
:::
