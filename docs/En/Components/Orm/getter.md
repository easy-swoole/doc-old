---
title: Getter
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  swoole|swoole extension|swoole framework|EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Getter
---


# Getter

The function of the getter is to automatically process the field value of the data.

To define an acquirer, you must create a "`get` field name `Attr`" method on your model.

The getter method of the field to be accessed needs to be named using "Little Hump". In this example, we will define an accessor for the `status` property.

::: tip
The fields of the data table are automatically converted to hump method access when using the getter
:::

This accessor is called automatically when an ORM instance attempts to get the value of status :
```php
Class UserModel extends AbstractModel
{
    /**
     * $value mixed is the original value
     * $data array is the current model all values
     */
    Protected function getStatusAttr($value, $data)
    {
        $status = [-1=>'delete', 0=>'disabled', 1=>'normal', 2=>'pending'];
        Return $status[$value];
    }
}
```

The getter can also define fields that do not exist in the data table, for example:
```php
Protected function getEasyswooleAttr($value,$data)
{
  Return 'Easyswoole user-'.$data['id'];
}
```
Then we can use this easyswoole field on the outside.
```php
$res = UserModel::create()->get(4);
var_dump($res->easyswoole);
```


