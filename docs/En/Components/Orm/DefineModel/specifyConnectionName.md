---
title: Specify the connection name
meta:
  - name: description
    content: Easyswoole ORM component,
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|Specify the connection name
---


# Specify the connection name

From the [Configuration Information Registration] (/En/Components/Orm/configurationRegister) section, we already know that when registering configuration information, you can specify a `connection name' for this configuration.


You can specify the connection configuration to be used by the model class custom property `connectionName`. The default is `default`


Assume that a `read` connection name configuration has been registered through the configuration information registration section.

Then we can define the ``` read ``` connection name in the Model.

```php
Class AdminModel extends \EasySwoole\ORM\AbstractModel
{
     Protected $connectionName = 'read';
}
```


You can continue to see the [Reading and Writing Separation] (/En/Components/Orm/readWriteSeparation) section for further details on how to use different database configurations.