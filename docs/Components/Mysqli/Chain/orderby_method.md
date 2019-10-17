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
