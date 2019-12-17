---
title: 读写分离
meta:
  - name: description
    content: Easyswoole ORM组件,读写分离
  - name: keywords
    content:  EasySwoole mysql ORM|EasySwoole ORM|Swoole mysqli协程客户端|swoole ORM|swoole 读写分离
---


# 读写分离


## 注册读写链接配置信息

首先，我们需要按照 [配置信息注册](./configuration_register) 注册 读 / 写 两个链接的信息

主要代码大概如下

```php
DbManager::getInstance()->addConnection($con, 'read');
DbManager::getInstance()->addConnection($con2, 'write');
```

## 指定使用链接

有两种方式可以使用 可以根据自己的需求选择

主要利用AbstractModel提供的`connection()`方法

```php
function connection(string $name, bool $isTemp = false)
```

::: tip  提示
第二个参数需要传入为true，表示临时使用，否则该认定为固定使用<br/> 建议只在临时使用时设置该方式，如果要固定使用则从Model类文件中定义。
:::

### Model继承定义

```php
class Test extends AbstractModel{
    /** 这里因为不是使用默认的配置链接名 所以需要指定 */
    protected $connectionName = 'write';
    
    /** get 方法使用读链接 */
    public function get($where = null, bool $returnAsArray)
    {
        $this->connection('read', true);
        return parent::get($where, $returnAsArray);
    } 
}
```

### 外部使用

```php
Test::create()->connection('read',true)->all();
```
