---
title: Mysqli component
meta:
  - name: description
    content: The Easyswoole Mysqli library is designed to make it easy for users to make a database call in an object-oriented form. And provide basic support for advanced usage such as Orm components.
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysqli|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM
---
# orderBy

Used to sort the results of an operation.


## Basic usage

Default DESC collation

```php
$builder->orderBy('col1', 'ASC')->get('getTable');
$builder->where('col1',2)->orderBy('col1', 'ASC')->get('getTable');
```

## ORDER BY FIELD


Can be implemented by the third parameter

```php
$array = [
    'a',
    'b'
];
$builder->orderBy('', 'DESC', $array)->get('getTable');
```

Principle of implementation
```php
if (is_array($customFieldsOrRegExp)) {
    foreach ($customFieldsOrRegExp as $key => $value) {
        $customFieldsOrRegExp[$key] = preg_replace("/[^\x80-\xff-a-z0-9\.\(\),_` ]+/i", '', $value);
    }
    $orderByField = 'FIELD (' . $orderByField . ', "' . implode('","', $customFieldsOrRegExp) . '")';
}
```

## ORDER BY REGEXP


Can be implemented by the third parameter

Principle of implementation
```php
if (is_string($customFieldsOrRegExp)) {
    $orderByField = $orderByField . " REGEXP '" . $customFieldsOrRegExp . "'";
}
```

## Pass the instructions

Method prototype
```php
function orderBy($orderByField, $orderbyDirection = "DESC", $customFieldsOrRegExp = null)
```

- $orderByField Sort field
- $orderbyDirection Sort rule
- $customFieldsOrRegExp Other conditions
