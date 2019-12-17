---
title: Mysqli组件
meta:
  - name: description
    content: Easyswoole Mysqli库，旨在方便用户以面向对象的形式进行数据库调用的一个库。并且为Orm组件等高级用法提供了基础支持
  - name: keywords
    content:  swoole|swoole 拓展|swoole 框架|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM
---
# orderBy

用于对操作的结果排序。


## 基本用法

默认DESC排序规则

```php
$builder->orderBy('col1', 'ASC')->get('getTable');
$builder->where('col1',2)->orderBy('col1', 'ASC')->get('getTable');
```

## ORDER BY FIELD


可以通过第三个参数实现

```php
$array = [
    'a',
    'b'
];
$builder->orderBy('', 'DESC', $array)->get('getTable');
```

实现原理
```php
if (is_array($customFieldsOrRegExp)) {
    foreach ($customFieldsOrRegExp as $key => $value) {
        $customFieldsOrRegExp[$key] = preg_replace("/[^\x80-\xff-a-z0-9\.\(\),_` ]+/i", '', $value);
    }
    $orderByField = 'FIELD (' . $orderByField . ', "' . implode('","', $customFieldsOrRegExp) . '")';
}
```

## ORDER BY REGEXP


可以通过第三个参数实现

实现原理
```php
if (is_string($customFieldsOrRegExp)) {
    $orderByField = $orderByField . " REGEXP '" . $customFieldsOrRegExp . "'";
}
```

## 传参说明

方法原型
```php
function orderBy($orderByField, $orderbyDirection = "DESC", $customFieldsOrRegExp = null)
```

- $orderByField 排序字段
- $orderbyDirection 排序规则
- $customFieldsOrRegExp 其他条件
