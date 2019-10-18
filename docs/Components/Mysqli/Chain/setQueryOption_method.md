# setQueryOption

设置查询条件

## 用法


```php
$builder->setQueryOption("FOR UPDATE")->where('whereUpdate', 'whereValue')->update('updateTable', ['a' => 1], 2);
```

## 传参说明

方法原型
```php
function setQueryOption($options)
```