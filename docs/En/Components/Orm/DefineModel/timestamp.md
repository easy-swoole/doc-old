# Timestamp

Added automatic timestamp feature support after the ORM component version `>= 1.0.18`.

Used to: automatically write time fields for creation and update

- When inserting data, automatically set the insertion time to current,
- When updating data, the update time is automatically set to current.

# How to use

```php
Use \EasySwoole\ORM\AbstractModel ;

Class AdminModel extends AbstractModel
{
    // are optional, the default value to see the document below
    Protected $autoTimeStamp = true;
    Protected $createTime = 'create_at';
    Protected $updateTime = 'update_at';
}
```


## autoTimeStamp

Whether to enable automatic timestamp, default value `false`

Optional value:

- true field defaults to int type save timestamp
- int field is int type save timestamp
- datetime field is datetime type Y-m-d H:i:s

## createTime

`Data creation time` field name, default value `create_time`

Optional value

- any string corresponding to the field name in the table where the creation time is to be stored
- false, does not process the creation time field


## updateTime

`Data update time` field name, default value `update_time`

Optional value

- any string corresponding to the field name in the table where the creation time is to be stored
- false, does not process the update time field