# 时间戳

在ORM组件版本 `>= 1.0.18` 后，增加自动时间戳特性支持。

用于：自动写入创建和更新的时间字段

- 在插入数据的时候，自动设置插入时间为当前，
- 在更新数据的时候，自动设置更新时间为当前。

# 使用方式

```php
use \EasySwoole\ORM\AbstractModel ;

Class AdminModel extends AbstractModel
{
    // 都是非必选的，默认值看文档下面说明
    protected $autoTimeStamp = true;
    protected $createTime = 'create_at';
    protected $updateTime = 'update_at';
}
```


## autoTimeStamp

是否开启自动时间戳，默认值 `false`

可选值： 

- true 字段默认为int类型 储存时间戳
- int  字段为int类型 储存时间戳
- datetime  字段为datetime类型  Y-m-d H:i:s

## createTime

`数据创建时间` 字段名，默认值 `create_time` 

可选值

- 任意字符串，对应为表中要储存创建时间的字段名
- false，不处理创建时间字段


## updateTime

`数据更新时间` 字段名，默认值 `update_time` 

可选值

- 任意字符串，对应为表中要储存创建时间的字段名
- false，不处理更新时间字段
