---
title: Read and write separation
meta:
  - name: description
    content: Easyswoole ORM component,Read and write separation
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli coroutine client|swoole ORM|swoole Read and write separation
---


# Read and write separation


## Register read and write link configuration information

First, we need to register to read/write the information of the two links according to [Configuration Information Registration] (./En/configuration_register).

The main code is probably as follows

```php
DbManager::getInstance()->addConnection($con, 'read');
DbManager::getInstance()->addConnection($con2, 'write');
```

## Specify to use the link

There are two ways to use it. You can choose according to your needs.

Mainly use the `connection()` method provided by AbstractModel

```php
Function connection(string $name, bool $isTemp = false)
```

::: tip prompt
The second parameter needs to be passed as true, indicating temporary use, otherwise it is considered to be fixed use (the effect is equivalent to defining the connectionName attribute in the class)
:::

### Model inheritance definition

```php
Class Test extends AbstractModel{
     /** This is because you are not using the default configuration link name, so you need to specify */
     Protected $connectionName = 'write';
    
     /** get method uses read link */
     Public function get($where = null, bool $returnAsArray)
     {
         $this->connection('read', true);
         Return parent::get($where, $returnAsArray);
     }
}
```

### External use

```php
Test::create()->connection('read',true)->all();
```
